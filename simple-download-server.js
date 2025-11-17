const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const PACKAGE_DIR = 'sistema-inventario-mdp-20251114-171128';

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '') {
        // Servir página HTML
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>🎯 Sistema de Inventario MDP - Descarga</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
                    .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                    h1 { color: #333; text-align: center; margin-bottom: 10px; font-size: 2.5em; }
                    .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 1.2em; }
                    .download-section { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
                    .file-info { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: white; border: 2px solid #e9ecef; border-radius: 8px; margin-bottom: 15px; }
                    .download-btn { background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1.1em; transition: background-color 0.3s; }
                    .download-btn:hover { background: #45a049; }
                    .info-section { background: #e3f2fd; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
                    .credentials { background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 15px; }
                    .instructions { background: #f8f9fa; padding: 30px; border-radius: 10px; }
                    .step { margin-bottom: 15px; padding-left: 20px; position: relative; }
                    .step:before { content: counter(step); position: absolute; left: -20px; top: 5px; background: #4CAF50; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; font-weight: bold; }
                    .code { background: #f1f3f4; padding: 10px 15px; border-radius: 5px; font-family: 'Courier New', monospace; color: #d63384; }
                    .contact { text-align: center; background: #e8f5e8; padding: 20px; border-radius: 10px; margin-top: 20px; }
                    .status { text-align: center; margin-top: 20px; padding: 10px; background: #d4edda; border-radius: 5px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🎯 Sistema de Inventario MDP</h1>
                    <p class="subtitle">Descarga el sistema completo de gestión de inventario</p>
                    
                    <div class="download-section">
                        <h2>📦 Archivo Disponible para Descargar</h2>
                        <div class="file-info">
                            <div>
                                <strong>Archivo:</strong><br>
                                sistema-inventario-mdp-20251114-171128.tar.gz
                            </div>
                            <div>
                                <strong>Tamaño:</strong><br>
                                513 KB
                            </div>
                            <a href="/download" class="download-btn" download>
                                📥 Descargar Sistema Completo
                            </a>
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
                        <div class="step">
                            <strong>Paso 1:</strong> Descarga el archivo .tar.gz haciendo clic en el botón de arriba
                        </div>
                        <div class="step">
                            <strong>Paso 2:</strong> Descomprime el archivo
                            <div class="code">tar -xzf sistema-inventario-mdp-20251114-171128.tar.gz</div>
                        </div>
                        <div class="step">
                            <strong>Paso 3:</strong> Entra al directorio
                            <div class="code">cd sistema-inventario-mdp-20251114-171128</div>
                        </div>
                        <div class="step">
                            <strong>Paso 4:</strong> Instala dependencias
                            <div class="code">npm install</div>
                        </div>
                        <div class="step">
                            <strong>Paso 5:</strong> Configura base de datos
                            <div class="code">npx prisma generate && npm run db:push</div>
                        </div>
                        <div class="step">
                            <strong>Paso 6:</strong> Inicializa datos
                            <div class="code">npx tsx scripts/seed-database.ts</div>
                        </div>
                        <div class="step">
                            <strong>Paso 7:</strong> Inicia el sistema
                            <div class="code">npm run dev</div>
                        </div>
                        <div class="step">
                            <strong>Paso 8:</strong> Accede al sistema
                            <a href="http://localhost:3000/login" style="color: #4CAF50; text-decoration: none;">http://localhost:3000/login</a>
                        </div>
                    </div>
                    
                    <div class="contact">
                        <h2>📧 Soporte Técnico</h2>
                        <p><strong>Email:</strong> rsanchezsec@gmail.com</p>
                        <p><strong>Email Alternativo:</strong> vcrsistemas@hotmail.com</p>
                        <p><strong>📱 Teléfono:</strong> +52 1 XXX XXX XXXX</p>
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
    console.log(`⏹ Presiona Ctrl+C para detener el servidor`);
});
EOF

echo "🚀 Iniciando servidor de descarga..."