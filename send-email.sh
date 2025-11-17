#!/bin/bash

# Script para enviar el sistema por email
echo "📧 Preparando envío del sistema por email..."

# Configuración
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="sanchezsec@gmail.com"
SMTP_PASS="tu_contraseña"  # Deberás configurar tu contraseña
SMTP_FROM="Sistema Inventario MDP <sanchezsec@gmail.com>"

# Destinatarios
TO_EMAIL_1="sanchezsec@gmail.com"
TO_EMAIL_2="vcrsistemas@hotmail.com"

# Archivo a enviar
PACKAGE_FILE="sistema-inventario-mdp-20251114-171128.tar.gz"
PACKAGE_PATH="/home/z/my-project/$PACKAGE_FILE"

# Asunto y mensaje
SUBJECT="🎯 Sistema de Inventario MDP - Código Completo"
MESSAGE="Hola,

Adjunto encontrarás el sistema completo de gestión de inventario MDP.

📦 Archivo: $PACKAGE_FILE
📊 Tamaño: $(du -h "$PACKAGE_PATH" | cut -f1)

🔑 Credenciales de acceso:
- Administrador: admin@mdp.com / admin123
- Supervisor: supervisor@mdp.com / supervisor123
- Usuario: usuario@mpd.com / usuario123

🚀 Instrucciones de instalación:
1. Descomprime el archivo: tar -xzf $PACKAGE_FILE
2. Entra al directorio: cd sistema-inventario-mdp-*
3. npm install
4. npx prisma generate && npm run db:push
5. npx tsx scripts/seed-database.ts
6. npm run dev
7. http://localhost:3000/login

📞 Soporte:
- Email: rsanchezsec@gmail.com
- Email alternativo: vcristemas@hotmail.com

🎉 ¡Sistema 100% funcional y listo para uso empresarial!

Atentamente,
Equipo de Desarrollo"