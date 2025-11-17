const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const PACKAGE_DIR = 'sistema-inventario-mdp-20251114-171128';

const server = http.createServer((req, res) => {
  console.log('Request URL:', req.url);
  
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎯 Sistema de Inventario MDP</title>
    <style>
      body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
      .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
      h1 { color: #333; text-align: center; margin-bottom: 10px; font-size: 2.5em; }
      .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 1.2em; }
      .download-section { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
      .file-info { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: white; border: 2px solid #e9ecef; border-radius: 8px; margin-bottom: 15px; }
      .download-btn { background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
      .download-btn:hover { background: #45a049; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎯 Sistema de Inventario MDP</h1>
      <p class="subtitle">Descarga el sistema completo de gestión de inventario</p>
      
      <div class="download-section">
        <h2>📦 Archivo Disponible para Descargar</h2>
        <div class="file-info">
          <div><strong>Archivo:</strong><br>sistema-inventario-mdp-20251114-171128.tar.gz</div>
          <div><strong>Tamaño:</strong><br>513 KB</div>
          <a href="/download" class="download-btn" download>📥 Descargar Sistema Completo</a>
        </div>
      </div>
      
      <div class="info-section">
        <h2>📋 Información del Sistema</h2>
        <div class="info-section">
          <h3>🌟 Características Principales</h3>
          <ul>
            <li>✅ Sistema de autenticación con 3 niveles de rol</li>
            <li>✅ CRUD completo para equipos, usuarios, departamentos, proveedores</li>
            <li>✅ Sistema de mantenimiento con costos y repuestos</li>
            <li>✅ Dashboard con estadísticas en tiempo real</li>
            <li>✅ Interface moderna y responsive</li>
            <li>✅ 25+ APIs RESTful funcionales</li>
          </ul>
        </div>
      </div>
      
      <div class="credentials">
        <h3>🔑 Credenciales de Acceso</h3>
        <div class="credentials">
          <div><strong>Administrador:</strong> admin@mdp.com / admin123</div>
          <div><strong>Supervisor:</strong> supervisor@mdp.com / supervisor123</div>
          <div><strong>Usuario:</strong> usuario@mdp.com / usuario123</div>
        </div>
      </div>
      
      <div class="instructions">
        <h2>🚀 Instrucciones de Instalación</h2>
        <div class="step">1. Descarga el archivo .tar.gz</div>
        <div class="step">2. Descomprime: tar -xzf sistema-inventario-mdp-20251114-171128.tar.gz</div>
        <div class="step">3. Entra al directorio: cd sistema-inventario-mdp-20251114-171128</div>
        <div class="step">4. npm install</div>
        <div class="step">5. npx prisma generate && npm run db:push</div>
        <div class="step">6. npx tsx scripts/seed-database.ts</div>
        <div class="step">7. npm run dev</div>
        <div class="step">8. Accede a http://localhost:3000/login</div>
      </div>
      
      <div class="contact">
        <h2>📧 Soporte Técnico</h2>
        <p><strong>Email:</strong> rsanchezsec@gmail.com</p>
        <p><strong>Email Alternativo:</strong> vcrsistemas@hotmail.com</p>
      </div>
      
      <div class="status">
        ✅ Servidor de descarga activo
      </div>
    </div>
  </body>
</html>
  `);
  } else if (req.url === '/download') {
    const filePath = path.join(__dirname, PACKAGE_DIR + '.tar.gz');
    
    if (fs.existsSync(filePath)) {
      res.writeHead(200, {
        'Content-Type': 'application/gzip',
        'Content-Disposition': `attachment; filename="${PACKAGE_DIR}.tar.gz"`
      });
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Archivo no encontrado');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor de descarga corriendo en http://localhost:${PORT}`);
  console.log(`📦 Archivo disponible: http://localhost:${PORT}/download`);
  console.log(`🌐 Página principal: http://localhost:${PORT}`);
  console.log(`📧 Soporte: rsanchezsec@gmail.com | vcrsistemas@hotmail.com`);
});
});