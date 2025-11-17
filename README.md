# 🚀 Sistema de Inventario MDP

Un sistema completo y profesional de gestión de inventario de equipos de cómputo desarrollado con Next.js 15, TypeScript, Prisma y shadcn/ui.

## ✨ Características Principales

### 🖥️ Gestión de Equipos
- **Registro completo** de equipos por tipo (Laptops, Desktops, Monitores, etc.)
- **Códigos automáticos** con formato: `M{TIPO}-{DEPTO}{NÚMERO}`
- **Especificaciones dinámicas** según tipo de equipo
- **Seguimiento de estado** (Disponible, Asignado, Mantenimiento, Retirado)
- **Control de garantía** y fechas de compra

### 👥 Gestión de Usuarios
- **3 niveles de acceso**: Administrador, Supervisor, Usuario
- **Autenticación segura** con bcrypt
- **Asignación por departamento**
- **Control de activos/inactivos**

### 🏢 Gestión Organizacional
- **Departamentos** con códigos identificativos
- **Proveedores** con información completa
- **Ubicaciones** físicas de equipos
- **Contactos y servicios**

### 🔧 Mantenimiento
- **Tipos de mantenimiento**: Preventivo, Correctivo, Actualización
- **Control de costos** y repuestos
- **Historial completo** por equipo
- **Programación automática**

### 📊 Reportes y Estadísticas
- **Dashboard en tiempo real**
- **Estadísticas por categoría**
- **Reportes exportables**
- **Gráficos interactivos**

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de Datos**: SQLite con Prisma ORM
- **Autenticación**: bcryptjs
- **UI Components**: Radix UI + Lucide Icons
- **Estado**: React Hooks + Zustand

## 🚀 Instalación Rápida

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone https://github.com/sanchezrsec/sistema-inventario-mdp.git
cd sistema-inventario-mdp
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Base de Datos
```bash
npx prisma db push
npx tsx scripts/seed-database.ts
```

### 4. Iniciar el Sistema
```bash
npm run dev
```

### 5. Acceder al Sistema
- **URL**: http://localhost:3000
- **Login**: http://localhost:3000/login

## 🔑 Credenciales de Demostración

| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| Administrador | admin@mdp.com | admin123 | Acceso completo |
| Supervisor | supervisor@mdp.com | supervisor123 | Gestión y usuarios |
| Usuario | user@mdp.com | user123 | Solo consulta |

## 📁 Estructura del Proyecto

```
sistema-inventario-mdp/
├── src/
│   ├── app/                    # Páginas y API routes
│   │   ├── api/               # Endpoints del backend
│   │   ├── login/             # Página de autenticación
│   │   ├── page.tsx           # Dashboard principal
│   │   └── layout.tsx         # Layout principal
│   ├── components/
│   │   └── ui/                # Componentes shadcn/ui
│   ├── lib/
│   │   ├── db.ts              # Cliente Prisma
│   │   └── utils.ts           # Utilidades
│   └── hooks/                  # Custom React hooks
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── scripts/
│   └── seed-database.ts       # Datos iniciales
└── public/                    # Archivos estáticos
```

## 🎯 Funcionalidades Detalladas

### Gestión de Equipos
- ✅ Registro por tipo con especificaciones dinámicas
- ✅ Generación automática de códigos únicos
- ✅ Control de estado y ubicación
- ✅ Historial de asignaciones
- ✅ Seguimiento de mantenimiento

### Sistema de Usuarios
- ✅ 3 roles con permisos diferenciados
- ✅ Autenticación segura
- ✅ Gestión por departamentos
- ✅ Control de sesión

### Mantenimiento
- ✅ Tipos de mantenimiento configurables
- ✅ Control de costos y proveedores
- ✅ Historial completo
- ✅ Notificaciones automáticas

### Reportes
- ✅ Dashboard en tiempo real
- ✅ Estadísticas por categoría
- ✅ Exportación de datos
- ✅ Gráficos interactivos

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env.local`:
```env
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
```

### Base de Datos
El sistema usa SQLite por defecto. Para cambiar a PostgreSQL:

1. Instalar cliente: `npm install pg`
2. Cambiar URL en `.env.local`: `DATABASE_URL="postgresql://..."`
3. Ejecutar: `npx prisma db push`

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t sistema-inventario-mdp .
docker run -p 3000:3000 sistema-inventario-mdp
```

### Servidor Propio
```bash
npm run build
npm start
```

## 📱 Características Técnicas

- **Performance**: Optimizado con Next.js 15
- **SEO**: Metadata optimizada
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG 2.1 AA
- **Type Safety**: TypeScript estricto
- **Code Quality**: ESLint + Prettier

## 🔐 Seguridad

- **Autenticación** con bcrypt
- **Validación** de datos con Zod
- **SQL Injection** protegido por Prisma
- **XSS Protection** con Next.js
- **CSRF Protection** incluido

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Email**: sanchezrsec@gmail.com
- **Issues**: [GitHub Issues](https://github.com/sanchezrsec/sistema-inventario-mdp/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/sanchezrsec/sistema-inventario-mdp/wiki)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM de base de datos
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Iconos

---

**Desarrollado con ❤️ por [sanchezrsec](https://github.com/sanchezrsec)**

⭐ Si este proyecto te ayuda, ¡dale una estrella!