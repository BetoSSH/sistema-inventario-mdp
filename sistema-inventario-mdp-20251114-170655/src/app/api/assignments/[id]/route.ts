import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignment = await db.assignment.findUnique({
      where: { id: params.id },
      include: {
        equipment: {
          include: {
            equipmentType: {
              select: { name: true }
            },
            department: {
              select: { name: true }
            },
            assignments: {
              where: { isActive: false },
              include: {
                user: {
                  select: { name: true }
                }
              },
              orderBy: { returnedAt: 'desc' }
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

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Formatear respuesta
    const formattedAssignment = {
      ...assignment,
      equipment: {
        ...assignment.equipment,
        previousAssignments: assignment.equipment.assignments.map(a => ({
          user: a.user.name,
          returnedAt: a.returnedAt
        }))
      }
    }

    return NextResponse.json(formattedAssignment)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: 'Error fetching assignment' },
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
    
    // Verificar que la asignación existe
    const existingAssignment = await db.assignment.findUnique({
      where: { id: params.id },
      include: {
        equipment: {
          select: { id: true, status: true }
        }
      }
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Preparar datos de actualización
    const updateData: any = {
      notes: body.notes || null
    }

    // Si se está devolviendo el equipo
    if (body.isActive === false && existingAssignment.isActive) {
      updateData.isActive = false
      updateData.returnedAt = new Date()
      updateData.returnedBy = body.returnedBy

      // Actualizar estado del equipo a disponible
      await db.equipment.update({
        where: { id: existingAssignment.equipmentId },
        data: { status: 'AVAILABLE' }
      })
    }

    const assignment = await db.assignment.update({
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

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Error updating assignment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que la asignación existe
    const existingAssignment = await db.assignment.findUnique({
      where: { id: params.id },
      include: {
        equipment: {
          select: { id: true, status: true }
        }
      }
    })

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    // Si la asignación está activa, actualizar estado del equipo
    if (existingAssignment.isActive) {
      await db.equipment.update({
        where: { id: existingAssignment.equipmentId },
        data: { status: 'AVAILABLE' }
      })
    }

    // Eliminar asignación
    await db.assignment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json(
      { error: 'Error deleting assignment' },
      { status: 500 }
    )
  }
}