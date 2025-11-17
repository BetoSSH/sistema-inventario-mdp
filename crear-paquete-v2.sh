#!/bin/bash

# Script para crear paquete completo del Sistema de Inventario MDP
echo "🎯 Creando paquete del Sistema de Inventario MDP..."

# Nombre del paquete
PACKAGE_NAME="sistema-inventario-mdp-$(date +%Y%m%d-%H%M%S)"
PACKAGE_DIR="$PACKAGE_NAME"

echo "📁 Creando directorio del paquete: $PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

echo "📋 Copiando archivos del proyecto..."

# Copiar archivos principales
cp -r src/ "$PACKAGE_DIR/"
cp -r public/ "$PACKAGE_DIR/"
cp -r prisma/ "$PACKAGE_DIR/"
cp -r scripts/ "$PACKAGE_DIR/"

# Copiar archivos de configuración
cp package*.json "$PACKAGE_DIR/"
cp next.config.ts "$PACKAGE_DIR/"
cp tsconfig.json "$PACKAGE_DIR/"
cp tailwind.config.ts "$PACKAGE_DIR/"
cp postcss.config.mjs "$PACKAGE_DIR/"
cp eslint.config.mjs "$PACKAGE_DIR/"
cp components.json "$PACKAGE_DIR/"

# Copiar base de datos si existe
if [ -f "db/custom.db" ]; then
    cp db/custom.db "$PACKAGE_DIR/"
fi

# Crear archivo README especial
cat > "$PACKAGE_DIR/README-INSTALACION.md" << 'EOF'
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
- **Administrador**: `admin@mdp.com` / `admin123`
- **Supervisor**: `supervisor@mdp.com` / `supervisor123`
- **Usuario**: `usuario@mdp.com` / `usuario123`

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
└── README-INSTALACION.md # Esta guía
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
EOF

echo "📦 Creando archivo comprimido..."

# Crear archivo comprimido
tar -czf "$PACKAGE_NAME.tar.gz" -C . "$PACKAGE_DIR"

# Eliminar directorio temporal
rm -rf "$PACKAGE_DIR"

echo "✅ Paquete creado exitosamente!"
echo ""
echo "📦 Nombre del archivo: $PACKAGE_NAME.tar.gz"
echo "📊 Tamaño del archivo: $(du -h "$PACKAGE_NAME.tar.gz" | cut -f1)"
echo ""
echo "🚀 Para instalar en tu equipo:"
echo "1. Copia el archivo $PACKAGE_NAME.tar.gz a tu equipo"
echo "2. Descomprime: tar -xzf $PACKAGE_NAME.tar.gz"
echo "3. Entra al directorio: cd $PACKAGE_NAME"
echo "4. Sigue la guía en README-INSTALACION.md"
echo ""
echo "🎯 ¡Sistema de Inventario MDP listo para despliegue! 🎉"
EOF

chmod +x crear-paquete.sh