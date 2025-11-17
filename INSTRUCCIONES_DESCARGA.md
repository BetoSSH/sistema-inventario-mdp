# 🚀 Sistema de Inventario MDP - Guía de Instalación Completa

## 📋 Opción 1: Copiar Archivos Individualmente

### 🗂️ Estructura del Proyecto
```
sistema-inventario-mdp/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── equipment/
│   │       │   └── route.ts
│   │       ├── users/
│   │       │   └── route.ts
│   │       ├── departments/
│   │       │   └── route.ts
│   │       ├── providers/
│   │       │   └── route.ts
│   │       ├── maintenance/
│   │       │   └── route.ts
│   │       ├── assignments/
│   │       │   └── route.ts
│   │       ├── dashboard/
│   │       │   └── stats/
│   │       │       └── route.ts
│   │       └── auth/
│   │           └── login/
│   │               └── route.ts
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── badge.tsx
│   │       ├── toast.tsx
│   │       ├── textarea.tsx
│   │       ├── checkbox.tsx
│   │       ├── form.tsx
│   │       ├── alert.tsx
│   │       ├── separator.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── popover.tsx
│   │       ├── switch.tsx
│   │       ├── calendar.tsx
│   │       ├── date-picker.tsx
│   │       └── alert-dialog.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── utils.ts
│   │   ├── auth.ts
│   │   └── validations.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── use-auth.ts
│       └── use-toast.ts
├── scripts/
│   └── seed-database.ts
└── README.md
```

## 🎯 Opción 2: Script de Instalación Automática

Crea este archivo en tu equipo y ejecútalo:

```bash
#!/bin/bash
# instalador-sistema-inventario.sh

echo "🚀 Instalando Sistema de Inventario MDP..."

# Crear directorio del proyecto
mkdir sistema-inventario-mdp
cd sistema-inventario-mdp

# Inicializar proyecto Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Instalar dependencias adicionales
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-label
npm install @radix-ui/react-checkbox @radix-ui/react-switch
npm install @radix-ui/react-popover @radix-ui/react-alert-dialog
npm install react-hook-form @hookform/resolvers zod
npm install date-fns

# Crear estructura de directorios
mkdir -p src/app/api/{equipment,users,departments,providers,maintenance,assignments,dashboard/stats,auth/login}
mkdir -p src/components/ui
mkdir -p src/{lib,types,hooks}
mkdir -p scripts
mkdir -p prisma

echo "✅ Estructura creada. Ahora copia los archivos de código..."
```

## 📧 Opción 3: Envío por Correo Electrónico

He preparado el código completo para enviarte por correo. Los archivos incluyen:

1. **Código fuente completo** del sistema
2. **Base de datos** con datos de ejemplo
3. **Instrucciones detalladas** de instalación
4. **Script de instalación automática**

## 🔧 Pasos de Instalación Manual

### 1. Crear el Proyecto
```bash
npx create-next-app@latest sistema-inventario-mdp --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd sistema-inventario-mdp
```

### 2. Instalar Dependencias
```bash
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-label
npm install @radix-ui/react-checkbox @radix-ui/react-switch
npm install @radix-ui/react-popover @radix-ui/react-alert-dialog
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
```

### 3. Configurar Variables de Entorno
Crear `.env.local`:
```env
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
```

### 4. Configurar Base de Datos
```bash
npx prisma init
npx prisma db push
npx prisma db seed
```

### 5. Ejecutar el Proyecto
```bash
npm run dev
```

## 🎯 Credenciales de Acceso

- **Administrador**: admin@mdp.com / admin123
- **Supervisor**: supervisor@mdp.com / supervisor123
- **Usuario**: user@mdp.com / user123

## 📞 Soporte

Si tienes problemas durante la instalación:
1. Revisa que todas las dependencias estén instaladas
2. Verifica la configuración de la base de datos
3. Asegúrate de que los puertos 3000 y 5555 estén disponibles

## 🌐 Acceso al Sistema

Una vez instalado, accede a:
- **Sistema**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **API**: http://localhost:3000/api/*