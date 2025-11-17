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
        { contact: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    const providers = await db.provider.findMany({
      where,
      include: {
        maintenance: {
          select: {
            id: true,
            type: true,
            cost: true,
            startDate: true,
            status: true
          },
          orderBy: { startDate: 'desc' },
          take: 5
        },
        _count: {
          select: { maintenance: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Formatear respuesta
    const formattedProviders = providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      contact: provider.contact,
      email: provider.email,
      phone: provider.phone,
      services: provider.services ? JSON.parse(provider.services) : [],
      maintenanceCount: provider._count.maintenance,
      recentMaintenance: provider.maintenance,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString()
    }))

    return NextResponse.json(formattedProviders)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Error fetching providers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que el nombre no existe
    const existingProvider = await db.provider.findUnique({
      where: { name: body.name }
    })

    if (existingProvider) {
      return NextResponse.json(
        { error: 'Provider name already exists' },
        { status: 400 }
      )
    }

    const provider = await db.provider.create({
      data: {
        name: body.name,
        contact: body.contact || null,
        email: body.email || null,
        phone: body.phone || null,
        services: body.services ? JSON.stringify(body.services) : null
      }
    })

    return NextResponse.json(provider, { status: 201 })
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { error: 'Error creating provider' },
      { status: 500 }
    )
  }
}