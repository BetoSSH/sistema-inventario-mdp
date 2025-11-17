'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn, Monitor, Shield, User } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
  department?: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  department?: string
  position?: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    department: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Usuarios preconfigurados para demostración
  const demoUsers: User[] = [
    {
      id: '1',
      name: 'Administrador del Sistema',
      email: 'admin@mdp.com',
      role: 'Administrador',
      department: 'Sistemas',
      position: 'Administrador de TI'
    },
    {
      id: '2',
      name: 'Supervisor de TI',
      email: 'supervisor@mdp.com',
      role: 'Supervisor',
      department: 'Sistemas',
      position: 'Supervisor de Soporte'
    },
    {
      id: '3',
      name: 'Juan Pérez',
      email: 'usuario@mdp.com',
      role: 'Usuario',
      department: 'Auditoría',
      position: 'Auditor Senior'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      department: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Simular autenticación (en producción, esto sería una llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validar credenciales contra usuarios preconfigurados
      const user = demoUsers.find(u => 
        u.email === formData.email && 
        (
          (formData.email === 'admin@mdp.com' && formData.password === 'admin123') ||
          (formData.email === 'supervisor@mdp.com' && formData.password === 'supervisor123') ||
          (formData.email === 'usuario@mdp.com' && formData.password === 'usuario123')
        )
      )

      if (user) {
        setSuccess(true)
        // Guardar usuario en localStorage (en producción, usar cookies o tokens seguros)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      } else {
        setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (user: User) => {
    setFormData({
      email: user.email,
      password: user.email === 'admin@mdp.com' ? 'admin123' : 
                 user.email === 'supervisor@mdp.com' ? 'supervisor123' : 'usuario123',
      department: user.department || ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo - Información */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Sistema de Inventario
            </h1>
            <p className="text-xl text-slate-600 mb-6">
              MDP - Gestión de Equipos de Cómputo
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">🔑 Credenciales de Demostración</h3>
              <div className="space-y-3">
                {demoUsers.map((user, index) => (
                  <div key={user.id} className="bg-white rounded p-3 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{user.role}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDemoLogin(user)}
                        className="text-xs"
                      >
                        Usar
                      </Button>
                    </div>
                    <div className="text-sm text-slate-600">
                      <div><strong>Email:</strong> {user.email}</div>
                      <div><strong>Contraseña:</strong> {
                        user.email === 'admin@mdp.com' ? 'admin123' : 
                        user.email === 'supervisor@mdp.com' ? 'supervisor123' : 'usuario123'
                      }</div>
                      <div><strong>Departamento:</strong> {user.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-slate-900">150+</div>
              <div className="text-sm text-slate-600">Equipos</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-slate-900">50+</div>
              <div className="text-sm text-slate-600">Usuarios</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-slate-900">99.9%</div>
              <div className="text-sm text-slate-600">Uptime</div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Formulario de Login */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                Iniciar Sesión
              </CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      ¡Inicio de sesión exitoso! Redirigiendo...
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@empresa.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento (Opcional)</Label>
                  <Select value={formData.department} onValueChange={handleDepartmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auditoria">Auditoría</SelectItem>
                      <SelectItem value="contabilidad">Contabilidad</SelectItem>
                      <SelectItem value="gerencia">Gerencia</SelectItem>
                      <SelectItem value="sistemas">Sistemas</SelectItem>
                      <SelectItem value="ventas">Ventas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Iniciar Sesión
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-600">
                <p>¿Necesitas ayuda? Contacta al administrador del sistema</p>
                <p className="mt-1">
                  <strong>Email:</strong> sistemas@mdp.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}