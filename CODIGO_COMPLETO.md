# 📦 CÓDIGO COMPLETO DEL SISTEMA DE INVENTARIO MDP

## 1️⃣ package.json
```json
{
  "name": "sistema-inventario-mdp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "tsx scripts/seed-database.ts"
  },
  "dependencies": {
    "next": "15.1.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "typescript": "5.7.2",
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "lucide-react": "^0.454.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "react-hook-form": "^7.53.2",
    "@hookform/resolvers": "^3.9.1",
    "zod": "^3.23.8",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "tsx": "^4.19.2"
  }
}
```

## 2️⃣ prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  SUPERVISOR
  USER
}

enum EquipmentStatus {
  AVAILABLE
  ASSIGNED
  MAINTENANCE
  RETIRED
}

enum AssignmentStatus {
  ACTIVE
  RETURNED
  TRANSFERRED
}

enum LoanStatus {
  ACTIVE
  RETURNED
  OVERDUE
}

enum MaintenanceType {
  PREVENTIVE
  CORRECTIVE
  UPGRADE
}

enum NotificationType {
  ASSIGNMENT
  MAINTENANCE
  LOAN
  RETURN
}

model Role {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  permissions String?
  users       User[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Department {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  code        String?  @unique
  managerId   String?
  manager     User?    @relation("DepartmentManager", fields: [managerId], references: [id])
  users       User[]
  equipment   Equipment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id           String     @id @default(cuid())
  email        String     @unique
  username     String     @unique
  password     String
  firstName    String
  lastName     String
  phone        String?
  departmentId String?
  department   Department? @relation(fields: [departmentId], references: [id])
  role         UserRole   @default(USER)
  roleId       String?
  roleRef      Role?      @relation(fields: [roleId], references: [id])
  isActive     Boolean    @default(true)
  lastLogin    DateTime?
  assignments  Assignment[]
  loans        Loan[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model EquipmentType {
  id          String           @id @default(cuid())
  name        String           @unique
  description String?
  fields      Json
  prefix      String
  equipment   Equipment[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model Location {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  building    String?
  floor       String?
  area        String?
  equipment   Equipment[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Provider {
  id          String     @id @default(cuid())
  name        String     @unique
  nit         String?    @unique
  phone       String?
  email       String?
  address     String?
  contact     String?
  services    String?
  equipment   Equipment[]
  maintenance Maintenance[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Equipment {
  id              String           @id @default(cuid())
  code            String           @unique
  serialNumber    String?          @unique
  model           String?
  brand           String?
  type            EquipmentType    @relation(fields: [typeId], references: [id])
  typeId          String
  status          EquipmentStatus  @default(AVAILABLE)
  location        Location?        @relation(fields: [locationId], references: [id])
  locationId      String?
  department      Department?      @relation(fields: [departmentId], references: [id])
  departmentId    String?
  provider        Provider?        @relation(fields: [providerId], references: [id])
  providerId      String?
  purchaseDate    DateTime?
  purchasePrice   Float?
  warrantyExpiry  DateTime?
  specifications  Json?
  notes           String?
  assignments     Assignment[]
  loans           Loan[]
  maintenance     Maintenance[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model Assignment {
  id           String           @id @default(cuid())
  equipment    Equipment        @relation(fields: [equipmentId], references: [id])
  equipmentId  String
  user         User             @relation(fields: [userId], references: [id])
  userId       String
  assignedBy   User             @relation("AssignmentBy", fields: [assignedById], references: [id])
  assignedById String
  assignedAt   DateTime         @default(now())
  returnedAt   DateTime?
  status       AssignmentStatus @default(ACTIVE)
  notes        String?
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
}

model Loan {
  id           String       @id @default(cuid())
  equipment    Equipment    @relation(fields: [equipmentId], references: [id])
  equipmentId  String
  user         User         @relation(fields: [userId], references: [id])
  userId       String
  authorizedBy User         @relation("LoanBy", fields: [authorizedById], references: [id])
  authorizedById String
  loanDate     DateTime     @default(now())
  expectedReturn DateTime?
  actualReturn DateTime?
  status       LoanStatus   @default(ACTIVE)
  purpose      String?
  notes        String?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Maintenance {
  id           String           @id @default(cuid())
  equipment    Equipment        @relation(fields: [equipmentId], references: [id])
  equipmentId  String
  type         MaintenanceType
  description  String
  cost         Float?
  provider     Provider?        @relation(fields: [providerId], references: [id])
  providerId   String?
  performedBy  String?
  performedAt  DateTime         @default(now())
  nextMaintenance DateTime?
  parts        String?
  laborHours   Float?
  notes        String?
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
}

model Notification {
  id        String           @id @default(cuid())
  title     String
  message   String
  type      NotificationType
  userId    String?
  read      Boolean          @default(false)
  data      Json?
  createdAt DateTime         @default(now())
}

model SystemConfig {
  id    String @id @default(cuid())
  key   String @unique
  value Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 3️⃣ src/app/layout.tsx
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de Inventario MDP',
  description: 'Sistema completo de gestión de inventario de equipos de cómputo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## 4️⃣ src/app/page.tsx
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, Edit, Trash2, Search, Filter, Download, 
  Monitor, Laptop, Printer, Scan, HardDrive, Wifi,
  Users, Settings, Wrench, Calendar, AlertCircle,
  CheckCircle, Clock, DollarSign, TrendingUp, Package
} from 'lucide-react'

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  role: string
  department?: string
  isActive: boolean
}

interface Department {
  id: string
  name: string
  description?: string
  code?: string
}

interface Provider {
  id: string
  name: string
  nit?: string
  phone?: string
  email?: string
  address?: string
  contact?: string
  services?: string
}

interface Equipment {
  id: string
  code: string
  serialNumber?: string
  model?: string
  brand?: string
  type: string
  status: string
  location?: string
  department?: string
  provider?: string
  purchaseDate?: string
  purchasePrice?: number
  warrantyExpiry?: string
  specifications?: any
  notes?: string
}

interface Assignment {
  id: string
  equipment: string
  user: string
  assignedBy: string
  assignedAt: string
  returnedAt?: string
  status: string
  notes?: string
}

interface Maintenance {
  id: string
  equipment: string
  type: string
  description: string
  cost?: number
  provider?: string
  performedBy?: string
  performedAt: string
  nextMaintenance?: string
  parts?: string
  laborHours?: number
  notes?: string
}

export default function Home() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('equipment')
  
  // States for each entity
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  
  // Dialog states
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false)
  const [providerDialogOpen, setProviderDialogOpen] = useState(false)
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false)
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false)
  
  // Edit states
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)

  // Form states
  const [equipmentForm, setEquipmentForm] = useState({
    serialNumber: '',
    model: '',
    brand: '',
    type: '',
    location: '',
    department: '',
    provider: '',
    purchaseDate: '',
    purchasePrice: '',
    warrantyExpiry: '',
    specifications: '',
    notes: ''
  })

  const [userForm, setUserForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    role: 'USER'
  })

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
    code: ''
  })

  const [providerForm, setProviderForm] = useState({
    name: '',
    nit: '',
    phone: '',
    email: '',
    address: '',
    contact: '',
    services: ''
  })

  const [assignmentForm, setAssignmentForm] = useState({
    equipment: '',
    user: '',
    notes: ''
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    equipment: '',
    type: 'CORRECTIVE',
    description: '',
    cost: '',
    provider: '',
    performedBy: '',
    performedAt: '',
    nextMaintenance: '',
    parts: '',
    laborHours: '',
    notes: ''
  })

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = () => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      window.location.href = '/login'
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }

  const loadData = async () => {
    try {
      const [equipRes, usersRes, deptRes, provRes, assignRes, maintRes] = await Promise.all([
        fetch('/api/equipment'),
        fetch('/api/users'),
        fetch('/api/departments'),
        fetch('/api/providers'),
        fetch('/api/assignments'),
        fetch('/api/maintenance')
      ])

      if (equipRes.ok) setEquipment(await equipRes.json())
      if (usersRes.ok) setUsers(await usersRes.json())
      if (deptRes.ok) setDepartments(await deptRes.json())
      if (provRes.ok) setProviders(await provRes.json())
      if (assignRes.ok) setAssignments(await assignRes.json())
      if (maintRes.ok) setMaintenance(await maintRes.json())
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const generateEquipmentCode = (type: string) => {
    const typePrefix = type.substring(0, 3).toUpperCase()
    const deptCode = departmentForm.code?.substring(0, 3).toUpperCase() || 'GEN'
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `M${typePrefix}-${deptCode}${random}`
  }

  const handleSaveEquipment = async () => {
    try {
      const code = editingEquipment ? editingEquipment.code : generateEquipmentCode(equipmentForm.type)
      const payload = {
        ...equipmentForm,
        code,
        purchasePrice: equipmentForm.purchasePrice ? parseFloat(equipmentForm.purchasePrice) : null
      }

      const url = editingEquipment ? `/api/equipment/${editingEquipment.id}` : '/api/equipment'
      const method = editingEquipment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Equipo ${editingEquipment ? 'actualizado' : 'creado'} correctamente`,
        })
        setEquipmentDialogOpen(false)
        setEditingEquipment(null)
        setEquipmentForm({
          serialNumber: '',
          model: '',
          brand: '',
          type: '',
          location: '',
          department: '',
          provider: '',
          purchaseDate: '',
          purchasePrice: '',
          warrantyExpiry: '',
          specifications: '',
          notes: ''
        })
        loadData()
      } else {
        throw new Error('Error al guardar equipo')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el equipo",
        variant: "destructive",
      })
    }
  }

  const handleSaveUser = async () => {
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Usuario ${editingUser ? 'actualizado' : 'creado'} correctamente`,
        })
        setUserDialogOpen(false)
        setEditingUser(null)
        setUserForm({
          email: '',
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          department: '',
          role: 'USER'
        })
        loadData()
      } else {
        throw new Error('Error al guardar usuario')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el usuario",
        variant: "destructive",
      })
    }
  }

  const handleSaveDepartment = async () => {
    try {
      const url = editingDepartment ? `/api/departments/${editingDepartment.id}` : '/api/departments'
      const method = editingDepartment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentForm)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Departamento ${editingDepartment ? 'actualizado' : 'creado'} correctamente`,
        })
        setDepartmentDialogOpen(false)
        setEditingDepartment(null)
        setDepartmentForm({ name: '', description: '', code: '' })
        loadData()
      } else {
        throw new Error('Error al guardar departamento')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el departamento",
        variant: "destructive",
      })
    }
  }

  const handleSaveProvider = async () => {
    try {
      const url = editingProvider ? `/api/providers/${editingProvider.id}` : '/api/providers'
      const method = editingProvider ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerForm)
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Proveedor ${editingProvider ? 'actualizado' : 'creado'} correctamente`,
        })
        setProviderDialogOpen(false)
        setEditingProvider(null)
        setProviderForm({
          name: '',
          nit: '',
          phone: '',
          email: '',
          address: '',
          contact: '',
          services: ''
        })
        loadData()
      } else {
        throw new Error('Error al guardar proveedor')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el proveedor",
        variant: "destructive",
      })
    }
  }

  const handleEditEquipment = (item: Equipment) => {
    setEditingEquipment(item)
    setEquipmentForm({
      serialNumber: item.serialNumber || '',
      model: item.model || '',
      brand: item.brand || '',
      type: item.type,
      location: item.location || '',
      department: item.department || '',
      provider: item.provider || '',
      purchaseDate: item.purchaseDate || '',
      purchasePrice: item.purchasePrice?.toString() || '',
      warrantyExpiry: item.warrantyExpiry || '',
      specifications: JSON.stringify(item.specifications || {}),
      notes: item.notes || ''
    })
    setEquipmentDialogOpen(true)
  }

  const handleEditUser = (item: User) => {
    setEditingUser(item)
    setUserForm({
      email: item.email,
      username: item.username,
      password: '',
      firstName: item.firstName,
      lastName: item.lastName,
      phone: '',
      department: item.department || '',
      role: item.role
    })
    setUserDialogOpen(true)
  }

  const handleEditDepartment = (item: Department) => {
    setEditingDepartment(item)
    setDepartmentForm({
      name: item.name,
      description: item.description || '',
      code: item.code || ''
    })
    setDepartmentDialogOpen(true)
  }

  const handleEditProvider = (item: Provider) => {
    setEditingProvider(item)
    setProviderForm({
      name: item.name,
      nit: item.nit || '',
      phone: item.phone || '',
      email: item.email || '',
      address: item.address || '',
      contact: item.contact || '',
      services: item.services || ''
    })
    setProviderDialogOpen(true)
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return

    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Registro eliminado correctamente",
        })
        loadData()
      } else {
        throw new Error('Error al eliminar')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      AVAILABLE: { variant: "default", label: "Disponible" },
      ASSIGNED: { variant: "secondary", label: "Asignado" },
      MAINTENANCE: { variant: "destructive", label: "Mantenimiento" },
      RETIRED: { variant: "outline", label: "Retirado" },
      ACTIVE: { variant: "default", label: "Activo" },
      RETURNED: { variant: "secondary", label: "Devuelto" },
      TRANSFERRED: { variant: "outline", label: "Transferido" },
      PREVENTIVE: { variant: "default", label: "Preventivo" },
      CORRECTIVE: { variant: "destructive", label: "Correctivo" },
      UPGRADE: { variant: "secondary", label: "Actualización" }
    }
    const config = variants[status] || { variant: "outline", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Cargando sistema...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider>
        <div className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sistema de Inventario MDP</h1>
                  <p className="text-sm text-gray-500">Gestión de Equipos de Cómputo</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bienvenido, {user?.firstName} {user?.lastName}
                </span>
                <Badge variant="outline">{user?.role}</Badge>
                <Button variant="outline" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
            <TabsContent value="equipment" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gestión de Equipos</CardTitle>
                      <CardDescription>Administra el inventario de equipos de cómputo</CardDescription>
                    </div>
                    <Dialog open={equipmentDialogOpen} onOpenChange={setEquipmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingEquipment(null)
                          setEquipmentForm({
                            serialNumber: '',
                            model: '',
                            brand: '',
                            type: '',
                            location: '',
                            department: '',
                            provider: '',
                            purchaseDate: '',
                            purchasePrice: '',
                            warrantyExpiry: '',
                            specifications: '',
                            notes: ''
                          })
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Equipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingEquipment ? 'Editar Equipo' : 'Nuevo Equipo'}</DialogTitle>
                          <DialogDescription>
                            {editingEquipment ? 'Edita la información del equipo' : 'Registra un nuevo equipo en el inventario'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="serialNumber">Número de Serie</Label>
                            <Input
                              id="serialNumber"
                              value={equipmentForm.serialNumber}
                              onChange={(e) => setEquipmentForm({...equipmentForm, serialNumber: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="model">Modelo</Label>
                            <Input
                              id="model"
                              value={equipmentForm.model}
                              onChange={(e) => setEquipmentForm({...equipmentForm, model: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="brand">Marca</Label>
                            <Input
                              id="brand"
                              value={equipmentForm.brand}
                              onChange={(e) => setEquipmentForm({...equipmentForm, brand: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Tipo</Label>
                            <Select value={equipmentForm.type} onValueChange={(value) => setEquipmentForm({...equipmentForm, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Laptop">Laptop</SelectItem>
                                <SelectItem value="Desktop">Desktop</SelectItem>
                                <SelectItem value="Monitor">Monitor</SelectItem>
                                <SelectItem value="Printer">Impresora</SelectItem>
                                <SelectItem value="Scanner">Escáner</SelectItem>
                                <SelectItem value="Server">Servidor</SelectItem>
                                <SelectItem value="Router">Router</SelectItem>
                                <SelectItem value="Switch">Switch</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="location">Ubicación</Label>
                            <Input
                              id="location"
                              value={equipmentForm.location}
                              onChange={(e) => setEquipmentForm({...equipmentForm, location: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="department">Departamento</Label>
                            <Select value={equipmentForm.department} onValueChange={(value) => setEquipmentForm({...equipmentForm, department: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona departamento" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="provider">Proveedor</Label>
                            <Select value={equipmentForm.provider} onValueChange={(value) => setEquipmentForm({...equipmentForm, provider: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona proveedor" />
                              </SelectTrigger>
                              <SelectContent>
                                {providers.map((provider) => (
                                  <SelectItem key={provider.id} value={provider.name}>{provider.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                            <Input
                              id="purchaseDate"
                              type="date"
                              value={equipmentForm.purchaseDate}
                              onChange={(e) => setEquipmentForm({...equipmentForm, purchaseDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="purchasePrice">Precio de Compra</Label>
                            <Input
                              id="purchasePrice"
                              type="number"
                              value={equipmentForm.purchasePrice}
                              onChange={(e) => setEquipmentForm({...equipmentForm, purchasePrice: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="warrantyExpiry">Vencimiento de Garantía</Label>
                            <Input
                              id="warrantyExpiry"
                              type="date"
                              value={equipmentForm.warrantyExpiry}
                              onChange={(e) => setEquipmentForm({...equipmentForm, warrantyExpiry: e.target.value})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="notes">Notas</Label>
                            <Textarea
                              id="notes"
                              value={equipmentForm.notes}
                              onChange={(e) => setEquipmentForm({...equipmentForm, notes: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEquipmentDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveEquipment}>
                            {editingEquipment ? 'Actualizar' : 'Guardar'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Marca/Modelo</TableHead>
                        <TableHead>Número de Serie</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.brand} {item.model}</TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditEquipment(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete('equipment', item.id)}>
                                <Trash2 className="h-4 w-4" />
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
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gestión de Usuarios</CardTitle>
                      <CardDescription>Administra los usuarios del sistema</CardDescription>
                    </div>
                    <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingUser(null)
                          setUserForm({
                            email: '',
                            username: '',
                            password: '',
                            firstName: '',
                            lastName: '',
                            phone: '',
                            department: '',
                            role: 'USER'
                          })
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Usuario
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
                          <DialogDescription>
                            {editingUser ? 'Edita la información del usuario' : 'Registra un nuevo usuario en el sistema'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userForm.email}
                              onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                              id="username"
                              value={userForm.username}
                              onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                              id="password"
                              type="password"
                              value={userForm.password}
                              onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                              placeholder={editingUser ? "Dejar en blanco para mantener" : ""}
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Rol</Label>
                            <Select value={userForm.role} onValueChange={(value) => setUserForm({...userForm, role: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona rol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ADMIN">Administrador</SelectItem>
                                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                                <SelectItem value="USER">Usuario</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input
                              id="firstName"
                              value={userForm.firstName}
                              onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input
                              id="lastName"
                              value={userForm.lastName}
                              onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                              id="phone"
                              value={userForm.phone}
                              onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="department">Departamento</Label>
                            <Select value={userForm.department} onValueChange={(value) => setUserForm({...userForm, department: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona departamento" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveUser}>
                            {editingUser ? 'Actualizar' : 'Guardar'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.username}</TableCell>
                          <TableCell>{item.firstName} {item.lastName}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{getStatusBadge(item.role)}</TableCell>
                          <TableCell>
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                              {item.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete('users', item.id)}>
                                <Trash2 className="h-4 w-4" />
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
            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gestión de Departamentos</CardTitle>
                      <CardDescription>Administra los departamentos de la organización</CardDescription>
                    </div>
                    <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingDepartment(null)
                          setDepartmentForm({ name: '', description: '', code: '' })
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Departamento
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingDepartment ? 'Editar Departamento' : 'Nuevo Departamento'}</DialogTitle>
                          <DialogDescription>
                            {editingDepartment ? 'Edita la información del departamento' : 'Registra un nuevo departamento'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="deptName">Nombre</Label>
                            <Input
                              id="deptName"
                              value={departmentForm.name}
                              onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="deptCode">Código</Label>
                            <Input
                              id="deptCode"
                              value={departmentForm.code}
                              onChange={(e) => setDepartmentForm({...departmentForm, code: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="deptDescription">Descripción</Label>
                            <Textarea
                              id="deptDescription"
                              value={departmentForm.description}
                              onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDepartmentDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveDepartment}>
                            {editingDepartment ? 'Actualizar' : 'Guardar'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditDepartment(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete('departments', item.id)}>
                                <Trash2 className="h-4 w-4" />
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
            <TabsContent value="providers" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Gestión de Proveedores</CardTitle>
                      <CardDescription>Administra los proveedores de equipos y servicios</CardDescription>
                    </div>
                    <Dialog open={providerDialogOpen} onOpenChange={setProviderDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingProvider(null)
                          setProviderForm({
                            name: '',
                            nit: '',
                            phone: '',
                            email: '',
                            address: '',
                            contact: '',
                            services: ''
                          })
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Nuevo Proveedor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}</DialogTitle>
                          <DialogDescription>
                            {editingProvider ? 'Edita la información del proveedor' : 'Registra un nuevo proveedor'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="providerName">Nombre</Label>
                            <Input
                              id="providerName"
                              value={providerForm.name}
                              onChange={(e) => setProviderForm({...providerForm, name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="providerNit">NIT</Label>
                            <Input
                              id="providerNit"
                              value={providerForm.nit}
                              onChange={(e) => setProviderForm({...providerForm, nit: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="providerPhone">Teléfono</Label>
                            <Input
                              id="providerPhone"
                              value={providerForm.phone}
                              onChange={(e) => setProviderForm({...providerForm, phone: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="providerEmail">Email</Label>
                            <Input
                              id="providerEmail"
                              type="email"
                              value={providerForm.email}
                              onChange={(e) => setProviderForm({...providerForm, email: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="providerContact">Contacto</Label>
                            <Input
                              id="providerContact"
                              value={providerForm.contact}
                              onChange={(e) => setProviderForm({...providerForm, contact: e.target.value})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="providerAddress">Dirección</Label>
                            <Input
                              id="providerAddress"
                              value={providerForm.address}
                              onChange={(e) => setProviderForm({...providerForm, address: e.target.value})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="providerServices">Servicios</Label>
                            <Textarea
                              id="providerServices"
                              value={providerForm.services}
                              onChange={(e) => setProviderForm({...providerForm, services: e.target.value})}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setProviderDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveProvider}>
                            {editingProvider ? 'Actualizar' : 'Guardar'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>NIT</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {providers.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.nit}</TableCell>
                          <TableCell>{item.phone}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.contact}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditProvider(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete('providers', item.id)}>
                                <Trash2 className="h-4 w-4" />
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
            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Asignaciones</CardTitle>
                  <CardDescription>Administra la asignación de equipos a usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Asignado por</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.equipment}</TableCell>
                          <TableCell>{item.user}</TableCell>
                          <TableCell>{item.assignedBy}</TableCell>
                          <TableCell>{new Date(item.assignedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{item.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Mantenimiento</CardTitle>
                  <CardDescription>Administra el mantenimiento de los equipos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Costo</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenance.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.equipment}</TableCell>
                          <TableCell>{getStatusBadge(item.type)}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>${item.cost}</TableCell>
                          <TableCell>{item.provider}</TableCell>
                          <TableCell>{new Date(item.performedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Completado</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{equipment.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Activos en el sistema
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Registrados en el sistema
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{departments.length}</div>
                    <p className="text-xs text-muted-foreground">
                      En la organización
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mantenimientos</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{maintenance.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Realizados este mes
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Reportes Generales</CardTitle>
                  <CardDescription>Genera reportes detallados del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-20 flex-col">
                      <Download className="h-6 w-6 mb-2" />
                      Reporte de Equipos
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Reporte de Usuarios
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Wrench className="h-6 w-6 mb-2" />
                      Reporte de Mantenimiento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
```

## 5️⃣ src/app/login/page.tsx
```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Monitor, Users, Wrench, Package, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const demoUsers = [
    { email: 'admin@mdp.com', password: 'admin123', role: 'Administrador', description: 'Acceso completo al sistema' },
    { email: 'supervisor@mdp.com', password: 'supervisor123', role: 'Supervisor', description: 'Gestión de equipos y usuarios' },
    { email: 'user@mdp.com', password: 'user123', role: 'Usuario', description: 'Acceso básico de consulta' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
      } else {
        setError(data.message || 'Error al iniciar sesión')
      }
    } catch (error) {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel Izquierdo - Login */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sistema de Inventario MDP
              </CardTitle>
              <CardDescription>
                Inicia sesión para acceder al sistema de gestión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Panel Derecho - Demo y Estadísticas */}
        <div className="space-y-6">
          {/* Tarjeta de Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cuentas de Demostración
              </CardTitle>
              <CardDescription>
                Haz clic en una cuenta para autocompletar el formulario
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoUsers.map((user, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fillDemoCredentials(user.email, user.password)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.password}</p>
                    </div>
                    <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{user.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">150+</p>
                    <p className="text-xs text-gray-500">Equipos Registrados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">50+</p>
                    <p className="text-xs text-gray-500">Usuarios Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Wrench className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">25+</p>
                    <p className="text-xs text-gray-500">Mantenimientos/Mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-gray-500">Departamentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle>Características Principales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gestión completa de inventario</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Asignación y seguimiento de equipos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sistema de mantenimiento preventivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Control de usuarios y permisos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Reportes y estadísticas en tiempo real</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

[Continúa en el siguiente archivo...]