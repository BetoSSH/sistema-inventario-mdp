import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const user = searchParams.get('user')
    const equipment = searchParams.get('equipment')
    const department = searchParams.get('department')

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== undefined) {
      where.isActive = status === 'true'
    }

    if (user && user !== 'all') {
      where.userId = user
    }

    if (equipment && equipment !== 'all') {
      where.equipmentId = equipment
    }

    if (department && department !== 'all') {
      where.equipment = {
        department: {
          name: { contains: department, mode: 'insensitive' }
        }
      }
    }

    const assignments = await db.assignment.findMany({
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
        user: {
          select: { 
            name: true, 
            email: true, 
            position: true,
            department: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { assignedAt: 'desc' }
    })

    // Formatear respuesta
    const formattedAssignments = assignments.map(assignment => ({
      id: assignment.id,
      equipmentId: assignment.equipmentId,
      equipment: {
        id: assignment.equipment.id,
        code: assignment.equipment.code,
        type: assignment.equipment.equipmentType.name,
        brand: assignment.equipment.brand,
        model: assignment.equipment.model,
        department: assignment.equipment.department?.name || null
      },
      userId: assignment.userId,
      user: {
        id: assignment.user.id,
        name: assignment.user.name,
        email: assignment.user.email,
        position: assignment.user.position,
        department: assignment.user.department?.name || null
      },
      assignedBy: assignment.assignedBy,
      assignedAt: assignment.assignedAt.toISOString(),
      returnedAt: assignment.returnedAt?.toISOString() || null,
      returnedBy: assignment.returnedBy,
      notes: assignment.notes,
      isActive: assignment.isActive,
      duration: assignment.returnedAt ? 
        Math.ceil((assignment.returnedAt.getTime() - assignment.assignedAt.getTime()) / (1000 * 60 * 60 * 24)) : 
        Math.ceil((new Date().getTime() - assignment.assignedAt.getTime()) / (1000 * 60 * 60 * 24)),
      createdAt: assignment.createdAt.toISOString(),
      updatedAt: assignment.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedAssignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Error fetching assignments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que el equipo existe y está disponible
    const equipment = await db.equipment.findUnique({
      where: { id: body.equipmentId }
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 400 }
      )
    }

    if (equipment.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Equipment is not available for assignment' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe y está activo
    const user = await db.user.findUnique({
      where: { id: body.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 400 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'User is not active' },
        { status: 400 }
      )
    }

    // Crear asignación
    const assignment = await db.assignment.create({
      data: {
        equipmentId: body.equipmentId,
        userId: body.userId,
        assignedBy: body.assignedBy,
        notes: body.notes || null,
        isActive: true
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
        user: {
          select: { 
            name: true, 
            email: true, 
            position: true,
            department: {
              select: { name: true }
            }
          }
        }
      }
    })

    // Actualizar estado del equipo
    await db.equipment.update({
      where: { id: body.equipmentId },
      data: { status: 'ASSIGNED' }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json(
      { error: 'Error creating assignment' },
      { status: 500 }
    )
  }
}