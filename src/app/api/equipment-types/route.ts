import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const equipmentTypes = await db.equipmentType.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(equipmentTypes)
  } catch (error) {
    console.error('Error fetching equipment types:', error)
    return NextResponse.json(
      { error: 'Error fetching equipment types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const equipmentType = await db.equipmentType.create({
      data: {
        name: body.name,
        code: body.code,
        description: body.description || null,
        hasSpecifications: body.hasSpecifications ?? true,
        fields: body.fields || '{}'
      }
    })

    return NextResponse.json(equipmentType, { status: 201 })
  } catch (error) {
    console.error('Error creating equipment type:', error)
    return NextResponse.json(
      { error: 'Error creating equipment type' },
      { status: 500 }
    )
  }
}