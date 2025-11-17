# 🎯 Sistema de Inventario MDP - Guía de Instalación

## 📋 Requisitos Previos

### **Node.js y npm**
- Node.js 18+ 
- npm o yarn

### **Base de Datos**
- SQLite (incluido)
- Prisma CLI

## 🚀 Instalación Rápida

### **1. Instalar Dependencias**
```bash
cd sistema-inventario-mdp
npm install
```

### **2. Configurar Base de Datos**
```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar schema a la base de datos
npm run db:push
```

### **3. Inicializar Datos**
```bash
# Cargar datos iniciales (usuarios, departamentos, etc.)
npx tsx scripts/seed-database.ts
```

### **4. Iniciar Sistema**
```bash
# Iniciar servidor de desarrollo
npm run dev
```

### **5. Acceder al Sistema**
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000

## 🔑 Credenciales de Acceso

### **Usuarios Preconfigurados**
- **Administrador**: admin@mdp.com / admin123
- **Supervisor**: supervisor@mdp.com / supervisor123
- **Usuario**: usuario@mdp.com / usuario123

## 📁 Estructura del Proyecto

```
sistema-inventario-mdp/
├── src/                    # Código fuente
│   ├── app/               # Páginas Next.js
│   ├── components/          # Componentes UI
│   ├── lib/               # Utilidades y configuración
│   └── hooks/             # Hooks personalizados
├── prisma/                # Schema de base de datos
├── public/                # Archivos estáticos
├── scripts/               # Scripts de inicialización
├── package.json           # Dependencias del proyecto
├── README-INSTALACION.md # Esta guía
```

## 🎯 Características del Sistema

### **✅ Módulos Completos**
- **Gestión de Equipos** (CRUD completo)
- **Gestión de Usuarios** (3 niveles de rol)
- **Gestión de Departamentos** (CRUD completo)
- **Gestión de Proveedores** (CRUD completo)
- **Sistema de Mantenimiento** (con costos)
- **Sistema de Asignaciones** (con historial)
- **Dashboard con Estadísticas**
- **Sistema de Login** (autenticación)

### **🔐 Seguridad**
- Autenticación de usuarios
- Protección de rutas
- Contraseñas hasheadas
- Validaciones completas

### **🎨 Interface Moderna**
- shadcn/ui components
- Tailwind CSS
- Responsive design
- Dark mode ready

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

# Calidad de código
npm run lint
```

## 📞 Soporte

Para cualquier consulta o problema:
- Revisar la consola del navegador
- Revisar los logs del servidor
- Verificar que todos los requisitos estén instalados

---

**¡Sistema listo para uso empresarial!** 🎉
