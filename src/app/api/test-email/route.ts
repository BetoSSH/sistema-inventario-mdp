import { NextRequest, NextResponse } from 'next/server';
import { sendAppointmentNotification, verifyEmailConfig } from '@/lib/email';

// Esta ruta es solo para pruebas de configuración de correo
export async function POST(request: NextRequest) {
  try {
    // Verificar configuración primero
    const isConfigValid = await verifyEmailConfig();
    if (!isConfigValid) {
      return NextResponse.json(
        { error: 'La configuración del correo no es válida. Verifique las variables de entorno EMAIL_USER y EMAIL_PASS.' },
        { status: 500 }
      );
    }

    // Enviar correo de prueba
    await sendAppointmentNotification({
      name: 'Paciente de Prueba',
      email: 'test@example.com',
      phone: '+34 600 000 000',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'Análisis de sangre',
      message: 'Este es un correo de prueba para verificar la configuración.'
    });

    return NextResponse.json(
      { message: 'Correo de prueba enviado exitosamente a sanchezrsec@gmail.com' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en prueba de correo:', error);
    return NextResponse.json(
      { 
        error: 'Error al enviar correo de prueba',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}