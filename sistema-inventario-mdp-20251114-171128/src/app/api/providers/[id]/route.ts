import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await db.provider.findUnique({
      where: { id: params.id },
      include: {
        maintenance: {
          include: {
            equipment: {
              select: { code: true, brand: true, model: true }
            }
          }
        },
        _count: {
          select: { maintenance: true }
        }
      }
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Formatear servicios
    const formattedProvider = {
      ...provider,
      services: provider.services ? JSON.parse(provider.services) : []
    }

    return NextResponse.json(formattedProvider)
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json(
      { error: 'Error fetching provider' },
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
    
    // Verificar que el proveedor existe
    const existingProvider = await db.provider.findUnique({
      where: { id: params.id }
    })

    if (!existingProvider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Si se cambia el nombre, verificar que no exista
    if (body.name && body.name !== existingProvider.name) {
      const nameExists = await db.provider.findUnique({
        where: { name: body.name }
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Provider name already exists' },
          { status: 400 }
        )
      }
    }

    const provider = await db.provider.update({
      where: { id: params.id },
      data: {
        name: body.name,
        contact: body.contact || null,
        email: body.email || null,
        phone: body.phone || null,
        services: body.services ? JSON.stringify(body.services) : null
      }
    })

    // Formatear servicios
    const formattedProvider = {
      ...provider,
      services: provider.services ? JSON.parse(provider.services) : []
    }

    return NextResponse.json(formattedProvider)
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { error: 'Error updating provider' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el proveedor existe
    const existingProvider = await db.provider.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { maintenance: true }
        }
      }
    })

    if (!existingProvider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // No permitir eliminar si tiene mantenimientos asociados
    if (existingProvider._count.maintenance > 0) {
      return NextResponse.json(
        { error: 'Cannot delete provider with associated maintenance records' },
        { status: 400 }
      )
    }

    // Eliminar proveedor
    await db.provider.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Provider deleted successfully' })
  } catch (error) {
    console.error('Error deleting provider:', error)
    return NextResponse.json(
      { error: 'Error deleting provider' },
      { status: 500 }
    )
  }
}