# Configuración de Correo Electrónico - BiolabLC

## Descripción

El sistema de reservas de BiolabLC envía automáticamente correos de notificación cuando:
- Un paciente reserva una nueva cita (envía correo al laboratorio)
- Se confirma una cita (envía correo al paciente)

## Configuración Requerida

### 1. Configurar Cuenta de Gmail

Para enviar correos desde el sistema, necesitas configurar una cuenta de Gmail con autenticación de dos factores:

1. **Activa la autenticación de dos factores en tu cuenta Gmail**
   - Ve a la configuración de tu cuenta Google
   - Selecciona "Seguridad"
   - Activa "Verificación en dos pasos"

2. **Genera una Contraseña de Aplicación**
   - En la misma sección de seguridad, busca "Contraseñas de aplicaciones"
   - Selecciona "Mail" y "Otro (nombre personalizado)"
   - Escribe "BiolabLC" como nombre
   - Copia la contraseña generada (solo se muestra una vez)

### 2. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de correo electrónico
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_generada
```

**Importante:**
- `EMAIL_USER`: Debe ser tu dirección de Gmail completa
- `EMAIL_PASS`: Es la contraseña de aplicación de 16 caracteres, NO tu contraseña normal de Gmail

### 3. Correos de Notificación

El sistema envía dos tipos de correos:

#### Al Laboratorio (sanchezrsec@gmail.com):
- **Asunto:** "Nueva Cita Reservada - [Nombre Paciente] - [Fecha]"
- **Contenido:** Todos los detalles de la cita incluyendo información del paciente

#### Al Paciente:
- **Asunto:** "Confirmación de Cita - BiolabLC - [Fecha]"
- **Contenido:** Confirmación de la cita con detalles e instrucciones importantes

### 4. Funcionalidades del Correo

#### Correo al Laboratorio incluye:
- ✅ Nombre completo del paciente
- ✅ Email y teléfono de contacto
- ✅ Fecha y hora de la cita
- ✅ Tipo de análisis solicitado
- ✅ Mensaje adicional (si lo proporciona)
- ✅ Diseño profesional con colores corporativos

#### Correo al Paciente incluye:
- ✅ Confirmación de la cita
- ✅ Detalles de fecha, hora y tipo de análisis
- ✅ Instrucciones importantes (ayunas, llegada anticipada, documentos)
- ✅ Información de contacto para cambios o cancelaciones
- ✅ Diseño profesional y amigable

### 5. Manejo de Errores

El sistema está diseñado para ser robusto:
- Si el correo no se puede enviar, la cita igual se guarda en la base de datos
- Los errores de correo se registran en la consola del servidor
- El usuario recibe confirmación independientemente del estado del correo

### 6. Seguridad

- ✅ Las credenciales de correo nunca se exponen en el código
- ✅ Se usan variables de entorno para configuración sensible
- ✅ Se recomienda usar una cuenta dedicada para el sistema
- ✅ Las contraseñas de aplicación son más seguras que las contraseñas normales

### 7. Pruebas

Para verificar que la configuración funciona correctamente:

1. **Verificar configuración:**
   ```bash
   # El sistema verifica la conexión al iniciar
   npm run dev
   ```

2. **Probar con una cita real:**
   - Completa el formulario de reserva en la web
   - Verifica que recibes ambos correos
   - Revisa la consola del servidor para ver los logs

### 8. Solución de Problemas

#### Problemas Comunes:

**"Invalid login"**
- Verifica que estás usando una contraseña de aplicación, no tu contraseña normal
- Asegúrate de que la autenticación de dos factores está activada

**"Connection timeout"**
- Verifica tu conexión a internet
- Revisa que el firewall no bloquee el puerto 587

**"Email not sent" pero cita guardada**
- Esto es comportamiento esperado
- El sistema prioriza guardar la cita sobre enviar el correo
- Revisa los logs del servidor para ver el error específico

### 9. Personalización

Para personalizar los correos:
- Edita el archivo `src/lib/email.ts`
- Modifica los templates HTML según necesites
- Los colores y estilos están configurados con estilos inline para máxima compatibilidad

---

**Nota Importante:** Esta configuración es esencial para el funcionamiento completo del sistema de notificaciones. Sin ella, las citas se guardarán correctamente pero no se enviarán correos de notificación.