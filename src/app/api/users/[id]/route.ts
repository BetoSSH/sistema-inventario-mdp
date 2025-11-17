import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        department: {
          select: { name: true, location: true }
        },
        role: {
          select: { name: true, permissions: true }
        },
        assignments: {
          include: {
            equipment: {
              include: {
                equipmentType: {
                  select: { name: true }
                }
              }
            }
          },
          orderBy: { assignedAt: 'desc' }
        },
        loans: {
          include: {
            equipment: {
              select: { code: true, brand: true, model: true }
            }
          },
          orderBy: { loanedAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error fetching user' },
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
    
    // Verificar que el usuario existe
    const existingUser = await db.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Si se cambia el email, verificar que no exista
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email: body.email }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Preparar datos de actualización
    const updateData: any = {
      email: body.email,
      name: body.name,
      position: body.position || null,
      phone: body.phone || null,
      departmentId: body.departmentId || null,
      roleId: body.roleId,
      isActive: body.isActive ?? true
    }

    // Si se proporciona nueva contraseña, hashearla
    if (body.password && body.password.trim() !== '') {
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    const user = await db.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        department: {
          select: { name: true }
        },
        role: {
          select: { name: true }
        }
      }
    })

    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error updating user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el usuario existe
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          where: { isActive: true }
        }
      }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // No permitir eliminar si tiene asignaciones activas
    if (existingUser.assignments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with active equipment assignments' },
        { status: 400 }
      )
    }

    // Eliminar usuario (en cascada se eliminarán asignaciones, préstamos)
    await db.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error deleting user' },
      { status: 500 }
    )
  }
}