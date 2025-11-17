import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    const departments = await db.department.findMany({
      where,
      include: {
        users: {
          select: { id: true }
        },
        equipment: {
          select: { id: true, status: true }
        },
        _count: {
          select: { 
            users: true,
            equipment: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Formatear respuesta
    const formattedDepartments = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      location: dept.location,
      userCount: dept._count.users,
      equipmentCount: dept._count.equipment,
      activeEquipmentCount: dept.equipment.filter(eq => eq.status === 'ASSIGNED').length,
      createdAt: dept.createdAt.toISOString(),
      updatedAt: dept.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedDepartments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Error fetching departments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que el nombre no existe
    const existingDepartment = await db.department.findUnique({
      where: { name: body.name }
    })

    if (existingDepartment) {
      return NextResponse.json(
        { error: 'Department name already exists' },
        { status: 400 }
      )
    }

    const department = await db.department.create({
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
      equipmentCount: department._count.equipment,
      activeEquipmentCount: 0
    }

    return NextResponse.json(formattedDepartment, { status: 201 })
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Error creating department' },
      { status: 500 }
    )
  }
}