'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Monitor, 
  Laptop, 
  Printer, 
  Scan, 
  Mouse, 
  Keyboard,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Users,
  Wrench,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Building,
  Tool,
  ClipboardList,
  Save,
  X,
  LogOut,
  User
} from 'lucide-react'

// Interfaces para TypeScript
interface DashboardStats {
  totalEquipos: number
  asignados: number
  disponibles: number
  mantenimiento: number
  damaged: number
  prestamos: number
}

interface Equipment {
  id: string
  code: string
  type: string
  typeId: string
  brand: string
  model: string
  serialNumber?: string
  status: string
  user?: string
  userId?: string
  department?: string
  departmentId?: string
  location?: string
  locationId?: string
  purchaseDate?: string
  purchasePrice?: number
  currentValue: number
  warrantyUntil?: string
  specifications: string
  inMaintenance: boolean
  createdAt: string
  updatedAt: string
}

interface Department {
  id: string
  name: string
  description?: string
  location?: string
  userCount: number
  equipmentCount: number
  activeEquipmentCount: number
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  name: string
  email: string
  position?: string
  phone?: string
  department?: string
  departmentId?: string
  role: string
  roleId: string
  isActive: boolean
  equipmentCount: number
  assignedEquipment: Array<{
    id: string
    code: string
    brand: string
    model: string
    assignedAt: string
  }>
  createdAt: string
  updatedAt: string
}

interface Provider {
  id: string
  name: string
  contact?: string
  email?: string
  phone?: string
  services: string[]
  maintenanceCount: number
  recentMaintenance: Array<{
    id: string
    type: string
    cost?: number
    startDate: string
    status: string
  }>
  createdAt: string
  updatedAt: string
}

interface Maintenance {
  id: string
  equipmentId: string
  equipment: {
    id: string
    code: string
    type: string
    brand: string
    model: string
    department?: string
  }
  providerId?: string
  provider?: {
    id: string
    name: string
    contact?: string
    phone?: string
  }
  type: string
  description: string
  cost?: number
  partsUsed: Array<{
    name: string
    quantity: number
    cost: number
  }>
  startDate: string
  endDate?: string
  performedBy?: string
  status: string
  notes?: string
  duration?: number
  createdAt: string
  updatedAt: string
}

interface Assignment {
  id: string
  equipmentId: string
  equipment: {
    id: string
    code: string
    type: string
    brand: string
    model: string
    department?: string
  }
  userId: string
  user: {
    id: string
    name: string
    email: string
    position?: string
    department?: string
  }
  assignedBy: string
  assignedAt: string
  returnedAt?: string
  returnedBy?: string
  notes?: string
  isActive: boolean
  duration: number
  createdAt: string
  updatedAt: string
}

interface EquipmentType {
  id: string
  name: string
  code: string
  description?: string
  hasSpecifications: boolean
  fields: string
}

export default function InventarioSistemas() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  
  // Estado de autenticación
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Estados para diálogos
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false)
  const [isEditEquipmentOpen, setIsEditEquipmentOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false)
  const [isEditProviderOpen, setIsEditProviderOpen] = useState(false)
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false)
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [isEditDepartmentOpen, setIsEditDepartmentOpen] = useState(false)
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false)
  
  // Estados para datos dinámicos
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipos: 0,
    asignados: 0,
    disponibles: 0,
    mantenimiento: 0,
    damaged: 0,
    prestamos: 0
  })
  const [equipos, setEquipos] = useState<Equipment[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados para edición
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  // Cargar datos desde APIs y verificar autenticación
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAuthenticated(true)
    } else {
      // Redirigir al login si no está autenticado
      router.push('/login')
      return
    }

    // Cargar datos del sistema
    Promise.all([
      fetch('/api/dashboard/stats').then(r => r.json()),
      fetch('/api/equipment').then(r => r.json()),
      fetch('/api/departments').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
      fetch('/api/providers').then(r => r.json()),
      fetch('/api/maintenance').then(r => r.json()),
      fetch('/api/assignments').then(r => r.json()),
      fetch('/api/equipment-types').then(r => r.json())
    ]).then(([statsData, equipmentData, departmentsData, usersData, providersData, maintenanceData, assignmentsData, typesData]) => {
      setStats(statsData)
      setEquipos(equipmentData)
      setDepartments(departmentsData)
      setUsers(usersData)
      setProviders(providersData)
      setMaintenance(maintenanceData)
      setAssignments(assignmentsData)
      setEquipmentTypes(typesData)
      setLoading(false)
    }).catch(error => {
      console.error('Error loading data:', error)
      setLoading(false)
    })
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-green-100 text-green-800'
      case 'AVAILABLE': return 'bg-blue-100 text-blue-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800'
      case 'DAMAGED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return <CheckCircle className="h-4 w-4" />
      case 'AVAILABLE': return <Package className="h-4 w-4" />
      case 'MAINTENANCE': return <Wrench className="h-4 w-4" />
      case 'DAMAGED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEquipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop': return <Laptop className="h-5 w-5" />
      case 'desktop': return <Monitor className="h-5 w-5" />
      case 'printer': return <Printer className="h-5 w-5" />
      case 'scanner': return <Scan className="h-5 w-5" />
      case 'mouse': return <Mouse className="h-5 w-5" />
      case 'keyboard': return <Keyboard className="h-5 w-5" />
      default: return <Monitor className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'ASIGNADO'
      case 'AVAILABLE': return 'DISPONIBLE'
      case 'MAINTENANCE': return 'MANTENIMIENTO'
      case 'DAMAGED': return 'DAÑADO'
      default: return status
    }
  }

  const getMaintenanceStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'COMPLETADO'
      case 'IN_PROGRESS': return 'EN PROGRESO'
      case 'PENDING': return 'PENDIENTE'
      case 'CANCELLED': return 'CANCELADO'
      default: return status
    }
  }

  // Funciones CRUD
  const handleDeleteEquipment = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        const response = await fetch(`/api/equipment/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setEquipos(equipos.filter(eq => eq.id !== id))
          alert('Equipo eliminado exitosamente')
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        alert('Error al eliminar el equipo')
      }
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setUsers(users.filter(user => user.id !== id))
          alert('Usuario eliminado exitosamente')
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        alert('Error al eliminar el usuario')
      }
    }
  }

  const handleDeleteProvider = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        const response = await fetch(`/api/providers/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setProviders(providers.filter(provider => provider.id !== id))
          alert('Proveedor eliminado exitosamente')
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        alert('Error al eliminar el proveedor')
      }
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
      try {
        const response = await fetch(`/api/departments/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setDepartments(departments.filter(dept => dept.id !== id))
          alert('Departamento eliminado exitosamente')
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        alert('Error al eliminar el departamento')
      }
    }
  }

  const handleDeleteMaintenance = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro de mantenimiento?')) {
      try {
        const response = await fetch(`/api/maintenance/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setMaintenance(maintenance.filter(maint => maint.id !== id))
          alert('Registro de mantenimiento eliminado exitosamente')
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        alert('Error al eliminar el registro de mantenimiento')
      }
    }
  }

  const handleDeleteAssignment = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta asignación?')) {
      try {
        const response = await fetch(`/api/assignments/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setAssignments(assignments.filter(assignment => assignment.id !== id))
          alert('Asignación eliminada exitosamente')
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        alert('Error al eliminar la asignación')
      }
    }
  }

  const filteredEquipos = equipos.filter(equipo => {
    const matchesSearch = equipo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (equipo.user && equipo.user.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || equipo.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || equipo.department === departmentFilter
    const matchesType = typeFilter === 'all' || equipo.typeId === typeFilter
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesType
  })

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando sistema de inventario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Sistema de Inventario MDP</h1>
            <p className="text-slate-600 mt-1">Gestión Completa de Equipos de Cómputo</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.name}</span>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Reporte
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEquipos}</div>
              <p className="text-xs text-muted-foreground">
                +2% respecto al mes anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asignados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.asignados}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalEquipos > 0 ? Math.round((stats.asignados / stats.totalEquipos) * 100) : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.disponibles}</div>
              <p className="text-xs text-muted-foreground">
                Listos para asignar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.mantenimiento}</div>
              <p className="text-xs text-muted-foreground">
                {stats.damaged} dañados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="equipment">Equipos</TabsTrigger>
            <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="providers">Proveedores</TabsTrigger>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros y Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por código, marca, modelo o usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="ASSIGNED">Asignado</SelectItem>
                      <SelectItem value="AVAILABLE">Disponible</SelectItem>
                      <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                      <SelectItem value="DAMAGED">Dañado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los departamentos</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      {equipmentTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsAddEquipmentOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Equipo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Equipos</CardTitle>
                <CardDescription>
                  Gestiona todos los equipos de cómputo de la empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Marca/Modelo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Valor Actual</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipos.map((equipo) => (
                      <TableRow key={equipo.id}>
                        <TableCell className="font-medium">{equipo.code}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEquipmentIcon(equipo.type)}
                            {equipo.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{equipo.brand}</div>
                            <div className="text-sm text-muted-foreground">{equipo.model}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(equipo.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(equipo.status)}
                              {getStatusText(equipo.status)}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{equipo.user || '-'}</TableCell>
                        <TableCell>{equipo.department || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {equipo.location || 'Sin ubicación'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${equipo.currentValue}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(equipo)
                                setIsEditEquipmentOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteEquipment(equipo.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Asignaciones de Equipos</CardTitle>
                  <CardDescription>
                    Gestiona las asignaciones de equipos a usuarios
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddAssignmentOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Asignación
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha Asignación</TableHead>
                      <TableHead>Duración (días)</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Notas</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEquipmentIcon(assignment.equipment.type)}
                            <div>
                              <div className="font-medium">{assignment.equipment.code}</div>
                              <div className="text-sm text-muted-foreground">
                                {assignment.equipment.brand} {assignment.equipment.model}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{assignment.user.name}</div>
                            <div className="text-sm text-muted-foreground">{assignment.user.position}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(assignment.assignedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{assignment.duration}</TableCell>
                        <TableCell>
                          <Badge className={assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {assignment.isActive ? 'Activa' : 'Devuelta'}
                          </Badge>
                        </TableCell>
                        <TableCell>{assignment.notes || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteAssignment(assignment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Solicitudes de Mantenimiento</CardTitle>
                  <CardDescription>
                    Gestiona las solicitudes y registros de mantenimiento
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddMaintenanceOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Solicitud
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenance.map((maint) => (
                      <TableRow key={maint.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEquipmentIcon(maint.equipment.type)}
                            <div>
                              <div className="font-medium">{maint.equipment.code}</div>
                              <div className="text-sm text-muted-foreground">
                                {maint.equipment.brand} {maint.equipment.model}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {maint.type === 'PREVENTIVE' ? 'Preventivo' : 'Correctivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{maint.description}</div>
                        </TableCell>
                        <TableCell>
                          {maint.provider ? maint.provider.name : 'Sin asignar'}
                        </TableCell>
                        <TableCell>
                          ${maint.cost || 0}
                        </TableCell>
                        <TableCell>
                          <Badge className={getMaintenanceStatusColor(maint.status)}>
                            {getMaintenanceStatusText(maint.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteMaintenance(maint.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <CardDescription>
                    Administra usuarios, roles y permisos del sistema
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Agregar Usuario
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Equipos Asignados</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.position || '-'}</TableCell>
                        <TableCell>{user.department || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.equipmentCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Proveedores de Servicios</CardTitle>
                  <CardDescription>
                    Gestiona los proveedores de mantenimiento y repuestos
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddProviderOpen(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Proveedor
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Servicios</TableHead>
                      <TableHead>Mantenimientos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">{provider.name}</TableCell>
                        <TableCell>{provider.contact || '-'}</TableCell>
                        <TableCell>{provider.email || '-'}</TableCell>
                        <TableCell>{provider.phone || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {provider.services.slice(0, 2).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {provider.services.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.services.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{provider.maintenanceCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedProvider(provider)
                                setIsEditProviderOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteProvider(provider.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Departamentos</CardTitle>
                  <CardDescription>
                    Gestiona los departamentos de la empresa
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddDepartmentOpen(true)} className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Agregar Departamento
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Usuarios</TableHead>
                      <TableHead>Equipos</TableHead>
                      <TableHead>Equipos Activos</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.description || '-'}</TableCell>
                        <TableCell>{dept.location || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{dept.userCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{dept.equipmentCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {dept.activeEquipmentCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedDepartment(dept)
                                setIsEditDepartmentOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Reporte de Asignaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Genera reporte de equipos asignados por usuario y departamento
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Depreciación de Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reporte de depreciación y valor actual de los equipos
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Equipos Dañados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reporte de equipos en mantenimiento y fuera de servicio
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tool className="h-5 w-5" />
                    Costos de Mantenimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reporte detallado de costos de mantenimiento y repuestos
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Historial de Movimientos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Historial completo de movimientos de equipos
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventario General
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reporte completo del inventario de equipos
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Diálogos para agregar/editar */}
        {/* Add Equipment Dialog */}
        <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
              <DialogDescription>
                Registra un nuevo equipo en el sistema de inventario
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Equipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" placeholder="Ej: Dell, HP, Lenovo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" placeholder="Ej: Latitude 7420" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serial">Número de Serie</Label>
                  <Input id="serial" placeholder="Número de serie del equipo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                  <Input id="purchaseDate" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Precio de Compra</Label>
                  <Input id="purchasePrice" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Valor Actual</Label>
                  <Input id="currentValue" type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Especificaciones Técnicas</Label>
                <Textarea 
                  id="specifications" 
                  placeholder="Ingresa las especificaciones técnicas del equipo..."
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddEquipmentOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddEquipmentOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Equipo
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Registra un nuevo usuario en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" placeholder="Juan Pérez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="juan@empresa.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Input id="position" placeholder="Analista Senior" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddUserOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Usuario
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Provider Dialog */}
        <Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Registra un nuevo proveedor de servicios
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="providerName">Nombre del Proveedor</Label>
                <Input id="providerName" placeholder="Técnico Profesional S.A." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <Input id="contact" placeholder="Juan Rodríguez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="providerEmail">Correo Electrónico</Label>
                <Input id="providerEmail" type="email" placeholder="contacto@proveedor.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="+1-555-0123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Servicios</Label>
                <Textarea 
                  id="services" 
                  placeholder="Lista de servicios ofrecidos (separados por comas)"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddProviderOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddProviderOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Proveedor
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Maintenance Dialog */}
        <Dialog open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Mantenimiento</DialogTitle>
              <DialogDescription>
                Registra una nueva solicitud de mantenimiento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceEquipment">Equipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipos.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.code} - {eq.brand} {eq.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceType">Tipo de Mantenimiento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREVENTIVE">Preventivo</SelectItem>
                      <SelectItem value="CORRECTIVE">Correctivo</SelectItem>
                      <SelectItem value="UPGRADE">Actualización</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Problema</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe detalladamente el problema o el mantenimiento requerido..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maintenanceProvider">Proveedor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {providers.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Costo Estimado</Label>
                  <Input id="estimatedCost" type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceNotes">Notas Adicionales</Label>
                <Textarea 
                  id="maintenanceNotes" 
                  placeholder="Cualquier información adicional relevante..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddMaintenanceOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Crear Solicitud
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Department Dialog */}
        <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Departamento</DialogTitle>
              <DialogDescription>
                Registra un nuevo departamento en la empresa
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deptName">Nombre del Departamento</Label>
                <Input id="deptName" placeholder="Recursos Humanos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deptDescription">Descripción</Label>
                <Textarea 
                  id="deptDescription" 
                  placeholder="Descripción del departamento..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deptLocation">Ubicación</Label>
                <Input id="deptLocation" placeholder="Edificio A, Piso 2" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddDepartmentOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Departamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Assignment Dialog */}
        <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Asignación de Equipo</DialogTitle>
              <DialogDescription>
                Asigna un equipo a un usuario
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentEquipment">Equipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo disponible" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipos.filter(eq => eq.status === 'AVAILABLE').map(eq => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.code} - {eq.brand} {eq.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignmentUser">Usuario</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(user => user.isActive).map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} - {user.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignmentNotes">Notas</Label>
                <Textarea 
                  id="assignmentNotes" 
                  placeholder="Notas sobre la asignación..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddAssignmentOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsAddAssignmentOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Realizar Asignación
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Edit Department Dialog */}
        <Dialog open={isEditDepartmentOpen} onOpenChange={setIsEditDepartmentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Departamento</DialogTitle>
              <DialogDescription>
                Modifica la información del departamento
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editDeptName">Nombre del Departamento</Label>
                <Input 
                  id="editDeptName" 
                  defaultValue={selectedDepartment?.name || ''}
                  placeholder="Recursos Humanos" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDeptDescription">Descripción</Label>
                <Textarea 
                  id="editDeptDescription" 
                  defaultValue={selectedDepartment?.description || ''}
                  placeholder="Descripción del departamento..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDeptLocation">Ubicación</Label>
                <Input 
                  id="editDeptLocation" 
                  defaultValue={selectedDepartment?.location || ''}
                  placeholder="Edificio A, Piso 2" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDepartmentOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsEditDepartmentOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Actualizar Departamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Provider Dialog */}
        <Dialog open={isEditProviderOpen} onOpenChange={setIsEditProviderOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Proveedor</DialogTitle>
              <DialogDescription>
                Modifica la información del proveedor
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editProviderName">Nombre del Proveedor</Label>
                <Input 
                  id="editProviderName" 
                  defaultValue={selectedProvider?.name || ''}
                  placeholder="Técnico Profesional S.A." 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editContact">Contacto</Label>
                <Input 
                  id="editContact" 
                  defaultValue={selectedProvider?.contact || ''}
                  placeholder="Juan Rodríguez" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editProviderEmail">Correo Electrónico</Label>
                <Input 
                  id="editProviderEmail" 
                  type="email"
                  defaultValue={selectedProvider?.email || ''}
                  placeholder="contacto@proveedor.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Teléfono</Label>
                <Input 
                  id="editPhone" 
                  defaultValue={selectedProvider?.phone || ''}
                  placeholder="+1-555-0123" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editServices">Servicios</Label>
                <Textarea 
                  id="editServices" 
                  defaultValue={selectedProvider?.services?.join(', ') || ''}
                  placeholder="Lista de servicios ofrecidos (separados por comas)"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditProviderOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsEditProviderOpen(false)}>
                <Save className="h-4 w-4 mr-2" />
                Actualizar Proveedor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}