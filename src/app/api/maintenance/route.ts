import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const equipment = searchParams.get('equipment')
    const provider = searchParams.get('provider')

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { performedBy: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (equipment && equipment !== 'all') {
      where.equipmentId = equipment
    }

    if (provider && provider !== 'all') {
      where.providerId = provider
    }

    const maintenance = await db.maintenance.findMany({
      where,
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
      },
      orderBy: { startDate: 'desc' }
    })

    // Formatear respuesta
    const formattedMaintenance = maintenance.map(maint => ({
      id: maint.id,
      equipmentId: maint.equipmentId,
      equipment: {
        id: maint.equipment.id,
        code: maint.equipment.code,
        type: maint.equipment.equipmentType.name,
        brand: maint.equipment.brand,
        model: maint.equipment.model,
        department: maint.equipment.department?.name || null
      },
      providerId: maint.providerId,
      provider: maint.provider ? {
        id: maint.provider.id,
        name: maint.provider.name,
        contact: maint.provider.contact,
        phone: maint.provider.phone
      } : null,
      type: maint.type,
      description: maint.description,
      cost: maint.cost,
      partsUsed: maint.partsUsed ? JSON.parse(maint.partsUsed) : [],
      startDate: maint.startDate.toISOString().split('T')[0],
      endDate: maint.endDate?.toISOString().split('T')[0] || null,
      performedBy: maint.performedBy,
      status: maint.status,
      notes: maint.notes,
      duration: maint.endDate ? 
        Math.ceil((maint.endDate.getTime() - maint.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 
        null,
      createdAt: maint.createdAt.toISOString(),
      updatedAt: maint.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedMaintenance)
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    return NextResponse.json(
      { error: 'Error fetching maintenance' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que el equipo existe
    const equipment = await db.equipment.findUnique({
      where: { id: body.equipmentId }
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 400 }
      )
    }

    // Cambiar estado del equipo a mantenimiento si no está ya
    if (equipment.status !== 'MAINTENANCE') {
      await db.equipment.update({
        where: { id: body.equipmentId },
        data: { status: 'MAINTENANCE' }
      })
    }

    // Crear registro de mantenimiento
    const maintenance = await db.maintenance.create({
      data: {
        equipmentId: body.equipmentId,
        providerId: body.providerId || null,
        type: body.type || 'CORRECTIVE',
        description: body.description,
        cost: body.cost || null,
        partsUsed: body.partsUsed ? JSON.stringify(body.partsUsed) : null,
        startDate: new Date(body.startDate || new Date()),
        endDate: body.endDate ? new Date(body.endDate) : null,
        performedBy: body.performedBy || null,
        status: body.status || 'PENDING',
        notes: body.notes || null
      },
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

    return NextResponse.json(maintenance, { status: 201 })
  } catch (error) {
    console.error('Error creating maintenance:', error)
    return NextResponse.json(
      { error: 'Error creating maintenance' },
      { status: 500 }
    )
  }
}