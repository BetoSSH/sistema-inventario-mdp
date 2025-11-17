# 🎯 Sistema de Inventario MDP - Repositorio Completo

Este repositorio contiene un sistema completo de gestión de inventario de equipos de cómputo desarrollado con Next.js 15, TypeScript y Prisma.

## 🌟 Características Principales

- ✅ **Sistema de Autenticación** con 3 niveles de rol (Administrador, Supervisor, Usuario)
- ✅ **CRUD Completo** para equipos, usuarios, departamentos, proveedores
- ✅ **Sistema de Mantenimiento** con costos y repuestos
- ✅ **Dashboard** con estadísticas en tiempo real
- ✅ **Interface Moderna** con shadcn/ui y Tailwind CSS
- ✅ **25+ APIs RESTful** funcionales
- ✅ **Base de Datos Relacional** completa con 14 modelos

## 🚀 Inicio Rápido

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/rsanchezsec/sistema-inventario-mdp.git
cd sistema-inventario-mdp
```

### **2. Instalación**
```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npm run db:push

# Inicializar datos
npx tsx scripts/seed-database.ts

# Iniciar sistema
npm run dev
```

### **3. Acceder al Sistema**
- **URL**: http://localhost:3000/login
- **Credenciales de Demostración**:
  - **Administrador**: `admin@mdp.com` / `admin123`
  - **Supervisor**: `supervisor@mdp.com` / `supervisor123`
  - **Usuario**: `usuario@mdp.com` / `usuario123`

## 📁 Estructura del Proyecto

```
sistema-inventario-mdp/
├── src/                    # Código fuente TypeScript/React
│   ├── app/               # Páginas Next.js y APIs
│   │   ├── login/         # Página de login
│   │   ├── page.tsx       # Dashboard principal
│   │   └── api/           # APIs RESTful
│   ├── components/          # Componentes UI reutilizables
│   ├── lib/               # Utilidades y configuración
│   └── hooks/             # Hooks personalizados
├── prisma/                # Schema de base de datos
├── public/                # Archivos estáticos
├── scripts/               # Scripts de inicialización
├── package.json           # Dependencias y scripts
└── README.md              # Documentación
```

## 🎯 Módulos Disponibles

### **💻 Gestión de Equipos**
- Crear, editar, eliminar equipos
- Generador automático de códigos: `M{TIPO}-{DEPTO}{N°}`
- Especificaciones dinámicas por tipo
- Filtrado avanzado por estado, departamento, tipo

### **👥 Gestión de Usuarios**
- 3 niveles de rol con permisos definidos
- Autenticación segura con bcryptjs
- Asignación a departamentos

### **🏢 Gestión de Departamentos**
- CRUD completo para departamentos
- Estadísticas de usuarios y equipos
- Gestión de ubicaciones

### **🔧 Gestión de Proveedores**
- Registro de proveedores de servicios
- Historial de mantenimientos
- Servicios ofrecidos

### **🛠️ Sistema de Mantenimiento**
- Solicitudes de mantenimiento
- Costos de repuestos y mano de obra
- Estados: Pendiente, En Progreso, Completado

### **📋 Sistema de Asignaciones**
- Asignación de equipos a usuarios
- Historial completo de movimientos
- Cálculo automático de duración

### **📊 Dashboard y Reportes**
- Estadísticas en tiempo real
- Reportes exportables
- Visualización de datos

## 🔐 Seguridad

- Autenticación de usuarios con tokens seguros
- Protección de rutas
- Validaciones completas en frontend y backend
- Contraseñas hasheadas

## 🎨 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: SQLite
- **Seguridad**: bcryptjs, JWT ready

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Base de datos
npm run db:push
npm run db:generate

# Calidad
npm run lint
```

## 📞 Soporte

Para cualquier consulta o problema:
- Revisar la documentación en el repositorio
- Abrir un issue en GitHub
- Contactar al desarrollador

---

**🎉 ¡Sistema 100% funcional y listo para uso empresarial!**