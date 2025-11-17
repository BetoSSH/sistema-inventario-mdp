import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Obtener estadísticas generales
    const [
      totalEquipos,
      asignados,
      disponibles,
      mantenimiento,
      damaged,
      prestamos
    ] = await Promise.all([
      db.equipment.count(),
      db.equipment.count({ where: { status: 'ASSIGNED' } }),
      db.equipment.count({ where: { status: 'AVAILABLE' } }),
      db.equipment.count({ where: { status: 'MAINTENANCE' } }),
      db.equipment.count({ where: { status: 'DAMAGED' } }),
      db.loan.count({ where: { status: 'ACTIVE' } })
    ])

    const stats = {
      totalEquipos,
      asignados,
      disponibles,
      mantenimiento,
      damaged,
      prestamos
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Error fetching dashboard statistics' },
      { status: 500 }
    )
  }
}