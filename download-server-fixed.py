import http.server
import socketserver
import os

PORT = 3001
DIRECTORY = '/home/z/my-project'
PACKAGE_DIR = 'sistema-inventario-mdp-20251114-171128'

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200, {
                'Content-Type': 'text/html; charset=utf-8'
            }, open('download-page.html').read())
        elif self.path.startswith('/download'):
            file_path = os.path.join(DIRECTORY, PACKAGE_DIR + '.tar.gz')
            if os.path.exists(file_path):
                self.send_response(200, {
                    'Content-Type': 'application/gzip',
                    'Content-Disposition': f'attachment; filename="{PACKAGE_DIR}.tar.gz"'
                }, open(file_path, 'rb').read())
            else:
                self.send_response(404, {'Content-Type': 'text/plain'})
                self.end('Archivo no encontrado')
        else:
            self.send_response(404, {'Content-Type': 'text/plain'})
                self.end('Ruta no encontrada')

with socketserver.TCPServer(('', PORT), MyHandler) as httpd:
    print(f'🚀 Servidor de descarga corriendo en http://localhost:{PORT}')
    print(f'📦 Archivo disponible: http://localhost:{PORT}/download')
    print(f'🌐 Página principal: http://localhost:{PORT}/')
    print(f'📧 Soporte: rsanchezsec@gmail.com | vcrsistemas@hotmail.com')
    print(f'⏹ Presiona Ctrl+C para detener el servidor')
"