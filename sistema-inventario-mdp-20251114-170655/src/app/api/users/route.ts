import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const department = searchParams.get('department')
    const role = searchParams.get('role')
    const isActive = searchParams.get('isActive')

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (department && department !== 'all') {
      where.departmentId = department
    }

    if (role && role !== 'all') {
      where.roleId = role
    }

    if (isActive !== undefined && isActive !== 'all') {
      where.isActive = isActive === 'true'
    }

    const users = await db.user.findMany({
      where,
      include: {
        department: {
          select: { name: true }
        },
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
        },
        _count: {
          select: { assignments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Formatear respuesta
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      position: user.position,
      phone: user.phone,
      department: user.department?.name || null,
      departmentId: user.departmentId,
      role: user.role.name,
      roleId: user.roleId,
      isActive: user.isActive,
      equipmentCount: user._count.assignments,
      assignedEquipment: user.assignments.map(a => ({
        id: a.equipment.id,
        code: a.equipment.code,
        brand: a.equipment.brand,
        model: a.equipment.model,
        assignedAt: a.assignedAt
      })),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que el email no existe
    const existingUser = await db.user.findUnique({
      where: { email: body.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await db.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        position: body.position || null,
        phone: body.phone || null,
        departmentId: body.departmentId || null,
        roleId: body.roleId,
        isActive: body.isActive ?? true
      },
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

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
}