import nodemailer from 'nodemailer';

// Configuración del transporter de correo
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para enviar correo de notificación de nueva cita
export async function sendAppointmentNotification(appointmentData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: string;
  message?: string | null;
}) {
  try {
    const { name, email, phone, date, time, type, message } = appointmentData;

    // Formatear la fecha para mejor legibilidad
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Contenido del correo para el laboratorio
    const labEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Nueva Cita Reservada</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">BiolabLC - Laboratorio Clínico</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Detalles de la Cita</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>Nombre del Paciente:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>Tipo de Análisis:</strong> ${type}</p>
          </div>
          
          ${message ? `
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>Mensaje Adicional:</strong></p>
            <p style="margin: 5px 0; font-style: italic;">${message}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">Este correo fue generado automáticamente por el sistema de reservas de BiolabLC</p>
            <p style="color: #666; font-size: 12px; margin-top: 5px;">Por favor, no responda a este correo</p>
          </div>
        </div>
      </div>
    `;

    // Enviar correo al laboratorio
    const labMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sanchezrsec@gmail.com',
      subject: `Nueva Cita Reservada - ${name} - ${formattedDate}`,
      html: labEmailContent,
    };

    // Enviar correo de confirmación al paciente
    const patientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Confirmación de Cita</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">BiolabLC - Laboratorio Clínico</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Su Cita ha sido Confirmada</h2>
          
          <p style="color: #666; margin-bottom: 20px;">Estimado/a ${name},</p>
          
          <p style="color: #666; margin-bottom: 20px;">Le confirmamos que su cita ha sido reservada exitosamente. A continuación los detalles:</p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${time}</p>
            <p style="margin: 5px 0;"><strong>Tipo de Análisis:</strong> ${type}</p>
          </div>
          
          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #155724;">Información Importante:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #155724;">
              <li>Por favor llegue 10 minutos antes de su cita</li>
              <li>Traiga su documento de identificación</li>
              <li>Si requiere análisis en ayunas, no consuma alimentos 8 horas antes</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 25px;">
            <p style="color: #666; font-size: 14px;">Si necesita cancelar o cambiar su cita, por favor contáctenos</p>
            <p style="color: #666; font-size: 14px;">Teléfono: +34 900 123 456</p>
            <p style="color: #666; font-size: 14px;">Email: info@biolablc.com</p>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">BiolabLC - 25 años de confianza en análisis clínicos</p>
          </div>
        </div>
      </div>
    `;

    const patientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmación de Cita - BiolabLC - ${formattedDate}`,
      html: patientEmailContent,
    };

    // Enviar ambos correos
    await Promise.all([
      transporter.sendMail(labMailOptions),
      transporter.sendMail(patientMailOptions)
    ]);

    console.log('Correos de notificación enviados exitosamente');
    return true;

  } catch (error) {
    console.error('Error al enviar correo de notificación:', error);
    throw error;
  }
}

// Función para verificar la configuración del correo
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Configuración de correo verificada exitosamente');
    return true;
  } catch (error) {
    console.error('Error en la configuración del correo:', error);
    return false;
  }
}