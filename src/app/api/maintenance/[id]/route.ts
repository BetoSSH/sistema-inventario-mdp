import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const maintenance = await db.maintenance.findUnique({
      where: { id: params.id },
      include: {
        equipment: {
          include: {
            equipmentType: {
              select: { name: true }
            },
            department: {
              select: { name: true }
            }
          }
        },
        provider: {
          select: { name: true, contact: true, phone: true, services: true }
        }
      }
    })

    if (!maintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    // Formatear respuesta
    const formattedMaintenance = {
      ...maintenance,
      partsUsed: maintenance.partsUsed ? JSON.parse(maintenance.partsUsed) : [],
      provider: maintenance.provider ? {
        ...maintenance.provider,
        services: maintenance.provider.services ? JSON.parse(maintenance.provider.services) : []
      } : null
    }

    return NextResponse.json(formattedMaintenance)
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    return NextResponse.json(
      { error: 'Error fetching maintenance' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Verificar que el mantenimiento existe
    const existingMaintenance = await db.maintenance.findUnique({
      where: { id: params.id },
      include: {
        equipment: {
          select: { id: true, status: true }
        }
      }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    // Preparar datos de actualización
    const updateData: any = {
      providerId: body.providerId || null,
      type: body.type || 'CORRECTIVE',
      description: body.description,
      cost: body.cost || null,
      partsUsed: body.partsUsed ? JSON.stringify(body.partsUsed) : null,
      performedBy: body.performedBy || null,
      status: body.status || 'PENDING',
      notes: body.notes || null
    }

    if (body.startDate) {
      updateData.startDate = new Date(body.startDate)
    }

    if (body.endDate) {
      updateData.endDate = new Date(body.endDate)
    }

    const maintenance = await db.maintenance.update({
      where: { id: params.id },
      data: updateData,
      include: {
        equipment: {
          include: {
            equipmentType: {
              select: { name: true }
            },
            department: {
              select: { name: true }
            }
          }
        },
        provider: {
          select: { name: true, contact: true, phone: true }
        }
      }
    })

    // Si el mantenimiento se completa, actualizar estado del equipo
    if (body.status === 'COMPLETED' && existingMaintenance.equipment.status === 'MAINTENANCE') {
      await db.equipment.update({
        where: { id: existingMaintenance.equipmentId },
        data: { status: 'AVAILABLE' }
      })
    }

    return NextResponse.json(maintenance)
  } catch (error) {
    console.error('Error updating maintenance:', error)
    return NextResponse.json(
      { error: 'Error updating maintenance' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el mantenimiento existe
    const existingMaintenance = await db.maintenance.findUnique({
      where: { id: params.id },
      include: {
        equipment: {
          select: { id: true, status: true }
        }
      }
    })

    if (!existingMaintenance) {
      return NextResponse.json(
        { error: 'Maintenance record not found' },
        { status: 404 }
      )
    }

    // Eliminar mantenimiento
    await db.maintenance.delete({
      where: { id: params.id }
    })

    // Verificar si el equipo tiene otros mantenimientos activos
    const otherMaintenance = await db.maintenance.findFirst({
      where: {
        equipmentId: existingMaintenance.equipmentId,
        status: { in: ['PENDING', 'IN_PROGRESS'] }
      }
    })

    // Si no hay otros mantenimientos activos, cambiar estado del equipo
    if (!otherMaintenance && existingMaintenance.equipment.status === 'MAINTENANCE') {
      await db.equipment.update({
        where: { id: existingMaintenance.equipmentId },
        data: { status: 'AVAILABLE' }
      })
    }

    return NextResponse.json({ message: 'Maintenance record deleted successfully' })
  } catch (error) {
    console.error('Error deleting maintenance:', error)
    return NextResponse.json(
      { error: 'Error deleting maintenance' },
      { status: 500 }
    )
  }
}