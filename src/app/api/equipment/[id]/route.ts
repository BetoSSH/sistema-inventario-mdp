import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const equipment = await db.equipment.findUnique({
      where: { id: params.id },
      include: {
        equipmentType: true,
        department: true,
        location: true,
        assignments: {
          include: {
            user: {
              select: { name: true, email: true, position: true }
            }
          },
          orderBy: { assignedAt: 'desc' }
        },
        maintenance: {
          include: {
            provider: {
              select: { name: true, contact: true, phone: true }
            }
          },
          orderBy: { startDate: 'desc' }
        },
        loans: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { loanedAt: 'desc' }
        }
      }
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Error fetching equipment' },
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
    
    // Verificar que el equipo existe
    const existingEquipment = await db.equipment.findUnique({
      where: { id: params.id }
    })

    if (!existingEquipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    // Preparar datos de actualización
    const updateData: any = {
      brand: body.brand,
      model: body.model,
      serialNumber: body.serialNumber || null,
      departmentId: body.departmentId || null,
      locationId: body.locationId || null,
      purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
      purchasePrice: body.purchasePrice || null,
      depreciationRate: body.depreciationRate || 0.1,
      currentValue: body.currentValue || null,
      warrantyUntil: body.warrantyUntil ? new Date(body.warrantyUntil) : null,
      specifications: body.specifications || '{}',
      status: body.status
    }

    // Si cambia el tipo de equipo, actualizarlo
    if (body.equipmentTypeId && body.equipmentTypeId !== existingEquipment.equipmentTypeId) {
      updateData.equipmentTypeId = body.equipmentTypeId
      
      // Regenerar código si cambia el tipo
      const equipmentType = await db.equipmentType.findUnique({
        where: { id: body.equipmentTypeId }
      })
      
      if (equipmentType && body.departmentId) {
        const department = await db.department.findUnique({
          where: { id: body.departmentId }
        })
        
        if (department) {
          const count = await db.equipment.count({
            where: {
              equipmentType: { code: equipmentType.code },
              department: { name: department.name }
            }
          })
          
          updateData.code = `M${equipmentType.code}-${department.name.toUpperCase()}${(count + 1).toString().padStart(3, '0')}`
        }
      }
    }

    const equipment = await db.equipment.update({
      where: { id: params.id },
      data: updateData,
      include: {
        equipmentType: true,
        department: true,
        location: true
      }
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error updating equipment:', error)
    return NextResponse.json(
      { error: 'Error updating equipment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el equipo existe
    const existingEquipment = await db.equipment.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          where: { isActive: true }
        }
      }
    })

    if (!existingEquipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 }
      )
    }

    // No permitir eliminar si tiene asignaciones activas
    if (existingEquipment.assignments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete equipment with active assignments' },
        { status: 400 }
      )
    }

    // Eliminar equipo (en cascada se eliminarán asignaciones, mantenimiento, préstamos)
    await db.equipment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Equipment deleted successfully' })
  } catch (error) {
    console.error('Error deleting equipment:', error)
    return NextResponse.json(
      { error: 'Error deleting equipment' },
      { status: 500 }
    )
  }
}