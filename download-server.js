const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Servir archivos estáticos desde el paquete más reciente
const packageDir = 'sistema-inventario-mdp-20251114-171128';

app.use(express.static(packageDir));

// Ruta principal para descargar el archivo .tar.gz
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'sistema-inventario-mdp-20251114-171128.tar.gz');
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'sistema-inventario-mdp-20251114-171128.tar.gz');
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

// Lista de archivos disponibles
app.get('/files', (req, res) => {
  const files = fs.readdirSync('.').filter(file => file.startsWith('sistema-inventario-mdp-'));
  
  res.json({
    files: files.map(file => {
      const stats = fs.statSync(file);
      return {
        name: file,
        size: stats.size,
        created: stats.birthtime,
        downloadUrl: `/download?file=${file}`
      };
    })
  });
});

// Página de información
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🎯 Sistema de Inventario MDP - Descarga</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container { 
                background: white; 
                border-radius: 10px; 
                padding: 30px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            h1 { color: #333; text-align: center; margin-bottom: 30px; }
            .file-list { margin: 20px 0; }
            .file-item { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 15px; 
                border: 1px solid #ddd; 
                border-radius: 5px;
                margin-bottom: 10px;
                background: #f9f9f9;
            }
            .download-btn { 
                background: #4CAF50; 
                color: white; 
                padding: 10px 20px; 
                text-decoration: none; 
                border-radius: 5px;
                font-weight: bold;
            }
            .download-btn:hover { background: #45a049; }
            .info { 
                background: #e3f2fd; 
                padding: 20px; 
                border-radius: 5px; 
                margin-top: 20px;
            }
            .email { 
                color: #666; 
                font-size: 14px; 
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎯 Sistema de Inventario MDP</h1>
            <p style="text-align: center; font-size: 18px; margin-bottom: 30px;">
                <strong>Descarga el sistema completo de gestión de inventario</strong>
            </p>
            
            <div class="file-list">
                <h2>📦 Archivos Disponibles:</h2>
                <div class="file-item">
                    <span><strong>sistema-inventario-mdp-20251114-171128.tar.gz</strong></span>
                    <span>513 KB</span>
                    <a href="/download" class="download-btn">📥 Descargar</a>
                </div>
            </div>
            
            <div class="info">
                <h2>📋 Información del Sistema:</h2>
                <ul>
                    <li>✅ Sistema de autenticación con 3 niveles de rol</li>
                    <li>✅ CRUD completo para equipos, usuarios, departamentos, proveedores</li>
                    <li>✅ Sistema de mantenimiento con costos y repuestos</li>
                    <li>✅ Dashboard con estadísticas en tiempo real</li>
                    <li>✅ Interface moderna y responsive</li>
                    <li>✅ 25+ APIs RESTful funcionales</li>
                </ul>
                
                <h3>🔑 Credenciales de Acceso:</h3>
                <ul>
                    <li><strong>Administrador:</strong> admin@mdp.com / admin123</li>
                    <li><strong>Supervisor:</strong> supervisor@mdp.com / supervisor123</li>
                    <li><strong>Usuario:</strong> usuario@mdp.com / usuario123</li>
                </ul>
                
                <h3>🚀 Instrucciones de Instalación:</h3>
                <ol>
                    <li>1. Descarga el archivo .tar.gz</li>
                    <li>2. Descomprime: <code>tar -xzf sistema-inventario-mdp-20251114-171128.tar.gz</code></li>
                    <li>3. Entra al directorio: <code>cd sistema-inventario-mdp-20251114-171128</code></li>
                    <li>4. Instala dependencias: <code>npm install</code></li>
                    <li>5. Configura base de datos: <code>npx prisma generate && npm run db:push</code></li>
                    <li>6. Inicializa datos: <code>npx tsx scripts/seed-database.ts</code></li>
                    <li>7. Inicia el sistema: <code>npm run dev</code></li>
                    <li>8. Accede a: <a href="http://localhost:3000/login" style="color: #4CAF50;">http://localhost:3000/login</a></li>
                </ol>
                
                <div class="email">
                    <p><strong>📧 Soporte:</strong></p>
                    <p>rsanchezsec@gmail.com</p>
                    <p>vcrsistemas@hotmail.com</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de descarga corriendo en http://localhost:${PORT}`);
  console.log(`📦 Archivo disponible: http://localhost:${PORT}/download`);
  console.log(`📋 Lista de archivos: http://localhost:${PORT}/files`);
});