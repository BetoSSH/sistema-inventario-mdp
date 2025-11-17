import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const department = await db.department.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: {
            role: {
              select: { name: true }
            },
            assignments: {
              where: { isActive: true },
              include: {
                equipment: {
                  select: { code: true, brand: true, model: true }
                }
              }
            }
          },
          orderBy: { name: 'asc' }
        },
        equipment: {
          include: {
            equipmentType: {
              select: { name: true }
            },
            assignments: {
              where: { isActive: true },
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          },
          orderBy: { code: 'asc' }
        },
        _count: {
          select: { 
            users: true,
            equipment: true
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // Formatear usuarios y equipos
    const formattedDepartment = {
      ...department,
      users: department.users.map(user => ({
        ...user,
        equipmentCount: user.assignments.length,
        assignedEquipment: user.assignments.map(a => ({
          code: a.equipment.code,
          brand: a.equipment.brand,
          model: a.equipment.model
        }))
      })),
      equipment: department.equipment.map(eq => ({
        ...eq,
        assignedTo: eq.assignments[0]?.user.name || null,
        status: eq.assignments[0]?.isActive ? 'ASSIGNED' : eq.status
      }))
    }

    return NextResponse.json(formattedDepartment)
  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(
      { error: 'Error fetching department' },
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
    
    // Verificar que el departamento existe
    const existingDepartment = await db.department.findUnique({
      where: { id: params.id }
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // Si se cambia el nombre, verificar que no exista
    if (body.name && body.name !== existingDepartment.name) {
      const nameExists = await db.department.findUnique({
        where: { name: body.name }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Department name already exists' },
          { status: 400 }
        )
      }
    }

    const department = await db.department.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description || null,
        location: body.location || null
      },
      include: {
        _count: {
          select: { 
            users: true,
            equipment: true
          }
        }
      }
    })

    const formattedDepartment = {
      ...department,
      userCount: department._count.users,
      equipmentCount: department._count.equipment
    }

    return NextResponse.json(formattedDepartment)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Error updating department' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el departamento existe
    const existingDepartment = await db.department.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { 
            users: true,
            equipment: true
          }
        }
      }
    })

    if (!existingDepartment) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // No permitir eliminar si tiene usuarios o equipos asociados
    if (existingDepartment._count.users > 0 || existingDepartment._count.equipment > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete department with associated users or equipment. Please reassign or delete them first.',
          userCount: existingDepartment._count.users,
          equipmentCount: existingDepartment._count.equipment
        },
        { status: 400 }
      )
    }

    // Eliminar departamento
    await db.department.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'Error deleting department' },
      { status: 500 }
    )
  }
}