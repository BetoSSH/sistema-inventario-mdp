import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const department = searchParams.get('department')
    const type = searchParams.get('type')

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
      where.equipmentTypeId = type
    }

    if (department && department !== 'all') {
      where.department = {
        name: { contains: department, mode: 'insensitive' }
      }
    }

    const equipment = await db.equipment.findMany({
      where,
      include: {
        equipmentType: true,
        department: true,
        location: true,
        assignments: {
          where: { isActive: true },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        maintenance: {
          where: { status: 'IN_PROGRESS' },
          orderBy: { startDate: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Formatear respuesta
    const formattedEquipment = equipment.map(eq => ({
      id: eq.id,
      code: eq.code,
      type: eq.equipmentType.name,
      typeId: eq.equipmentType.id,
      brand: eq.brand,
      model: eq.model,
      serialNumber: eq.serialNumber,
      status: eq.status,
      user: eq.assignments[0]?.user.name || null,
      userId: eq.assignments[0]?.user.id || null,
      department: eq.department?.name || null,
      departmentId: eq.department?.id || null,
      location: eq.location ? `${eq.location.building}, ${eq.location.floor}${eq.location.office ? ', ' + eq.location.office : ''}` : null,
      locationId: eq.location?.id || null,
      purchaseDate: eq.purchaseDate?.toISOString().split('T')[0] || null,
      purchasePrice: eq.purchasePrice,
      currentValue: eq.currentValue || 0,
      warrantyUntil: eq.warrantyUntil?.toISOString().split('T')[0] || null,
      specifications: eq.specifications,
      inMaintenance: eq.maintenance.length > 0,
      createdAt: eq.createdAt.toISOString(),
      updatedAt: eq.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedEquipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Error fetching equipment' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generar código automático
    const equipmentType = await db.equipmentType.findUnique({
      where: { id: body.equipmentTypeId }
    })

    if (!equipmentType) {
      return NextResponse.json(
        { error: 'Equipment type not found' },
        { status: 400 }
      )
    }

    // Obtener departamento
    const department = await db.department.findUnique({
      where: { id: body.departmentId }
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 400 }
      )
    }

    // Contar equipos existentes para este tipo y departamento
    const count = await db.equipment.count({
      where: {
        equipmentType: { code: equipmentType.code },
        department: { name: department.name }
      }
    })

    // Generar código: M{TIPO}-{DEPTO}{N°}
    const code = `M${equipmentType.code}-${department.name.toUpperCase()}${(count + 1).toString().padStart(3, '0')}`

    // Calcular valor actual si se proporcionó precio de compra
    let currentValue = body.currentValue
    if (body.purchasePrice && !currentValue) {
      currentValue = body.purchasePrice // En producción, calcular depreciación
    }

    // Crear equipo
    const equipment = await db.equipment.create({
      data: {
        code,
        equipmentTypeId: body.equipmentTypeId,
        brand: body.brand,
        model: body.model,
        serialNumber: body.serialNumber || null,
        departmentId: body.departmentId || null,
        locationId: body.locationId || null,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : null,
        purchasePrice: body.purchasePrice || null,
        depreciationRate: body.depreciationRate || 0.1,
        currentValue: currentValue || null,
        warrantyUntil: body.warrantyUntil ? new Date(body.warrantyUntil) : null,
        specifications: body.specifications || '{}',
        status: 'AVAILABLE'
      },
      include: {
        equipmentType: true,
        department: true,
        location: true
      }
    })

    return NextResponse.json(equipment, { status: 201 })
  } catch (error) {
    console.error('Error creating equipment:', error)
    return NextResponse.json(
      { error: 'Error creating equipment' },
      { status: 500 }
    )
  }
}