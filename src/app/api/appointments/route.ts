import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendAppointmentNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, type, message } = body;

    // Validación básica
    if (!name || !email || !phone || !date || !time || !type) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validación de teléfono (formato español)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Teléfono inválido' },
        { status: 400 }
      );
    }

    // Crear la cita en la base de datos
    const appointment = await db.appointment.create({
      data: {
        name,
        email,
        phone,
        date,
        time,
        type,
        message: message || null,
      },
    });

    // Enviar correo de notificación
    try {
      await sendAppointmentNotification({
        name,
        email,
        phone,
        date,
        time,
        type,
        message: message || null,
      });
    } catch (emailError) {
      console.error('Error al enviar correo de notificación:', emailError);
      // No fallamos la petición si el correo no se envía, pero lo registramos
    }

    return NextResponse.json(
      { 
        message: 'Cita reservada exitosamente. Se ha enviado un correo de confirmación.',
        appointment: {
          id: appointment.id,
          name: appointment.name,
          date: appointment.date,
          time: appointment.time,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al crear cita:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}