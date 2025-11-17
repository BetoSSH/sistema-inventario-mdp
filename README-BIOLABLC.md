# BiolabLC - Laboratorio de Análisis Clínicos

Sitio web profesional para BiolabLC, un laboratorio de análisis clínicos con 25 años de experiencia.

## Características

- 🏥 **Diseño Profesional**: Sitio web moderno y responsive optimizado para laboratorios clínicos
- 📅 **Sistema de Reservas**: Formulario completo para reservar citas de análisis clínicos
- 📱 **Integración Social**: Botones de WhatsApp y Facebook para contacto directo
- 📍 **Ubicación**: Información de contacto y ubicación física
- 🎨 **Imágenes Profesionales**: Imágenes generadas específicamente para el laboratorio
- 💾 **Base de Datos**: Sistema de gestión de citas con SQLite y Prisma
- 🔒 **Validaciones**: Validación completa de formularios y datos
- 📱 **Responsive Design**: Optimizado para todos los dispositivos

## Tecnologías Utilizadas

- **Frontend**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Base de Datos**: SQLite con Prisma ORM
- **Iconos**: Lucide React

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/appointments/    # API para gestión de citas
│   ├── page.tsx            # Página principal
│   ├── layout.tsx          # Layout principal
│   └── globals.css         # Estilos globales
├── components/ui/          # Componentes shadcn/ui
├── lib/
│   ├── db.ts              # Configuración de Prisma
│   └── utils.ts           # Utilidades
└── hooks/
    └── use-toast.ts       # Hook para notificaciones
```

## Instalación y Desarrollo

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar base de datos**:
   ```bash
   npm run db:push
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Verificar calidad del código**:
   ```bash
   npm run lint
   ```

## Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

## API Endpoints

### POST /api/appointments
Crea una nueva cita de análisis clínico.

**Body**:
```json
{
  "name": "Nombre del paciente",
  "email": "email@ejemplo.com",
  "phone": "+34 900 123 456",
  "date": "2024-12-25",
  "time": "10:30",
  "type": "sangre",
  "message": "Mensaje opcional"
}
```

**Response**:
```json
{
  "message": "Cita reservada exitosamente",
  "appointment": {
    "id": "cuid",
    "name": "Nombre del paciente",
    "date": "2024-12-25",
    "time": "10:30"
  }
}
```

### GET /api/appointments
Obtiene todas las citas registradas.

## Despliegue en Hosting

### Para Midominio.es u otros hostings compartidos:

1. **Construir el proyecto**:
   ```bash
   npm run build
   ```

2. **Archivos necesarios para subir**:
   - `.next/` (directorio de compilación)
   - `public/` (archivos estáticos)
   - `package.json`
   - `package-lock.json`
   - `.env.production` (con las variables de entorno de producción)

3. **Configuración del servidor**:
   - Asegurarse de que Node.js 18+ esté instalado
   - Configurar las variables de entorno
   - Instalar dependencias: `npm install --production`
   - Iniciar con: `npm start`

### Configuración Adicional para Producción:

1. **Base de Datos**:
   - Para producción, considera migrar a PostgreSQL o MySQL
   - Actualizar la URL de la base de datos en las variables de entorno

2. **Dominio y SSL**:
   - Configurar el dominio personalizado
   - Instalar certificado SSL

3. **Optimizaciones**:
   - Configurar CDN para imágenes estáticas
   - Habilitar compresión gzip
   - Configurar caché apropiada

## Personalización

### Cambiar Información del Laboratorio:

1. **Datos de contacto**: Editar en `src/app/page.tsx`
2. **Ubicación**: Actualizar en la sección de contacto
3. **Servicios**: Modificar en la sección de servicios
4. **Redes sociales**: Actualizar enlaces de WhatsApp y Facebook

### Personalizar Colores:

Los colores utilizados son variables de Tailwind CSS:
- `primary`: Color principal del sitio
- `primary-foreground`: Color de texto sobre el primario
- `background`: Color de fondo
- `foreground`: Color de texto principal

## Soporte

Para soporte técnico o consultas sobre el proyecto:
- Revisar la documentación de Next.js
- Consultar la documentación de Prisma
- Revisar los componentes de shadcn/ui

## Licencia

Este proyecto fue desarrollado para BiolabLC y es propiedad exclusiva del laboratorio.