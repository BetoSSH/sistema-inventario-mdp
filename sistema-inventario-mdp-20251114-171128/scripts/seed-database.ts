import { db } from '../src/lib/db'

async function seedDatabase() {
  console.log('🌱 Iniciando siembra de base de datos...')

  try {
    // Crear roles
    console.log('📋 Creando roles...')
    const adminRole = await db.role.upsert({
      where: { name: 'Administrador' },
      update: {},
      create: {
        name: 'Administrador',
        description: 'Acceso completo a todas las funciones del sistema',
        permissions: JSON.stringify({
          canManageUsers: true,
          canManageEquipment: true,
          canAssignEquipment: true,
          canManageMaintenance: true,
          canViewReports: true,
          canManageSystem: true
        })
      }
    })

    const supervisorRole = await db.role.upsert({
      where: { name: 'Supervisor' },
      update: {},
      create: {
        name: 'Supervisor',
        description: 'Puede asignar equipos y gestionar mantenimiento',
        permissions: JSON.stringify({
          canManageUsers: false,
          canManageEquipment: true,
          canAssignEquipment: true,
          canManageMaintenance: true,
          canViewReports: true,
          canManageSystem: false
        })
      }
    })

    const userRole = await db.role.upsert({
      where: { name: 'Usuario' },
      update: {},
      create: {
        name: 'Usuario',
        description: 'Puede aceptar equipos asignados y solicitar devoluciones',
        permissions: JSON.stringify({
          canManageUsers: false,
          canManageEquipment: false,
          canAssignEquipment: false,
          canManageMaintenance: false,
          canViewReports: false,
          canManageSystem: false
        })
      }
    })

    // Crear departamentos
    console.log('🏢 Creando departamentos...')
    const departments = await Promise.all([
      db.department.upsert({
        where: { name: 'Auditoría' },
        update: {},
        create: {
          name: 'Auditoría',
          description: 'Departamento de auditoría interna',
          location: 'Edificio A, Piso 2'
        }
      }),
      db.department.upsert({
        where: { name: 'Contabilidad' },
        update: {},
        create: {
          name: 'Contabilidad',
          description: 'Departamento de contabilidad',
          location: 'Edificio A, Piso 1'
        }
      }),
      db.department.upsert({
        where: { name: 'Gerencia' },
        update: {},
        create: {
          name: 'Gerencia',
          description: 'Oficinas de gerencia',
          location: 'Edificio B, Piso 3'
        }
      }),
      db.department.upsert({
        where: { name: 'Sistemas' },
        update: {},
        create: {
          name: 'Sistemas',
          description: 'Departamento de tecnología',
          location: 'Edificio A, Piso 3'
        }
      }),
      db.department.upsert({
        where: { name: 'Ventas' },
        update: {},
        create: {
          name: 'Ventas',
          description: 'Departamento de ventas',
          location: 'Edificio B, Piso 1'
        }
      })
    ])

    // Crear tipos de equipos
    console.log('💻 Creando tipos de equipos...')
    const laptopType = await db.equipmentType.upsert({
      where: { code: 'L' },
      update: {},
      create: {
        name: 'Laptop',
        code: 'L',
        description: 'Computadoras portátiles',
        hasSpecifications: true,
        fields: JSON.stringify({
          processor: { type: 'select', label: 'Procesador', required: true, options: ['Intel i3', 'Intel i5', 'Intel i7', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
          memory: { type: 'number', label: 'Memoria RAM (GB)', required: true },
          storage: { type: 'text', label: 'Almacenamiento', required: true },
          storageType: { type: 'select', label: 'Tipo de Almacenamiento', required: true, options: ['SSD', 'HDD', 'NVMe'] },
          lanMac: { type: 'text', label: 'MAC LAN', required: false },
          wifiMac: { type: 'text', label: 'MAC WiFi', required: false },
          operatingSystem: { type: 'select', label: 'Sistema Operativo', required: true, options: ['Windows 10', 'Windows 11', 'Linux', 'macOS'] }
        })
      }
    })

    const desktopType = await db.equipmentType.upsert({
      where: { code: 'PC' },
      update: {},
      create: {
        name: 'Desktop',
        code: 'PC',
        description: 'Computadoras de escritorio',
        hasSpecifications: true,
        fields: JSON.stringify({
          processor: { type: 'select', label: 'Procesador', required: true, options: ['Intel i3', 'Intel i5', 'Intel i7', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
          memory: { type: 'number', label: 'Memoria RAM (GB)', required: true },
          storage: { type: 'text', label: 'Almacenamiento', required: true },
          storageType: { type: 'select', label: 'Tipo de Almacenamiento', required: true, options: ['SSD', 'HDD', 'NVMe'] },
          lanMac: { type: 'text', label: 'MAC LAN', required: false },
          operatingSystem: { type: 'select', label: 'Sistema Operativo', required: true, options: ['Windows 10', 'Windows 11', 'Linux'] },
          graphicsCard: { type: 'text', label: 'Tarjeta Gráfica', required: false }
        })
      }
    })

    const monitorType = await db.equipmentType.upsert({
      where: { code: 'M' },
      update: {},
      create: {
        name: 'Monitor',
        code: 'M',
        description: 'Monitores de computadora',
        hasSpecifications: true,
        fields: JSON.stringify({
          size: { type: 'number', label: 'Tamaño (pulgadas)', required: true },
          resolution: { type: 'select', label: 'Resolución', required: true, options: ['HD', 'Full HD', '2K', '4K'] },
          panelType: { type: 'select', label: 'Tipo de Panel', required: false, options: ['TN', 'IPS', 'VA'] },
          refreshRate: { type: 'number', label: 'Tasa de Refresco (Hz)', required: false },
          inputs: { type: 'multiselect', label: 'Entradas', required: true, options: ['VGA', 'HDMI', 'DisplayPort', 'USB-C'] }
        })
      }
    })

    const printerType = await db.equipmentType.upsert({
      where: { code: 'I' },
      update: {},
      create: {
        name: 'Impresora',
        code: 'I',
        description: 'Impresoras y multifuncionales',
        hasSpecifications: true,
        fields: JSON.stringify({
          type: { type: 'select', label: 'Tipo', required: true, options: ['Láser', 'Inkjet', 'Matriz'] },
          function: { type: 'select', label: 'Función', required: true, options: ['Impresora', 'Multifuncional'] },
          color: { type: 'select', label: 'Color', required: true, options: ['Blanco y Negro', 'Color'] },
          connectivity: { type: 'multiselect', label: 'Conectividad', required: true, options: ['USB', 'Red', 'WiFi', 'Bluetooth'] },
          paperSize: { type: 'multiselect', label: 'Tamaños de Papel', required: true, options: ['Carta', 'Oficio', 'A4', 'Legal'] }
        })
      }
    })

    const scannerType = await db.equipmentType.upsert({
      where: { code: 'S' },
      update: {},
      create: {
        name: 'Escáner',
        code: 'S',
        description: 'Escáneres de documentos',
        hasSpecifications: true,
        fields: JSON.stringify({
          type: { type: 'select', label: 'Tipo', required: true, options: ['Cama Plana', 'ADF', 'Portátil'] },
          resolution: { type: 'number', label: 'Resolución (DPI)', required: true },
          colorDepth: { type: 'number', label: 'Profundidad de Color (bits)', required: false },
          connectivity: { type: 'multiselect', label: 'Conectividad', required: true, options: ['USB', 'Red', 'WiFi'] },
          duplex: { type: 'boolean', label: 'Dúplex Automático', required: false }
        })
      }
    })

    // Crear ubicaciones
    console.log('📍 Creando ubicaciones...')
    const locations = await Promise.all([
      db.location.upsert({
        where: { id: 'loc-main-office' },
        update: {},
        create: {
          id: 'loc-main-office',
          building: 'Edificio A',
          floor: 'Piso 1',
          office: 'Recepción',
          description: 'Área de recepción principal'
        }
      }),
      db.location.upsert({
        where: { id: 'loc-warehouse' },
        update: {},
        create: {
          id: 'loc-warehouse',
          building: 'Edificio C',
          floor: 'Planta Baja',
          office: 'Bodega',
          description: 'Bodega de sistemas - almacenamiento de equipos'
        }
      }),
      db.location.upsert({
        where: { id: 'loc-it-dept' },
        update: {},
        create: {
          id: 'loc-it-dept',
          building: 'Edificio A',
          floor: 'Piso 3',
          office: '301-305',
          description: 'Departamento de tecnología'
        }
      })
    ])

    // Crear usuarios de ejemplo
    console.log('👤 Creando usuarios de ejemplo...')
    const adminUser = await db.user.upsert({
      where: { email: 'admin@mdp.com' },
      update: {},
      create: {
        email: 'admin@mdp.com',
        password: 'admin123', // En producción, esto debe estar hasheado
        name: 'Administrador del Sistema',
        position: 'Administrador de TI',
        departmentId: departments[3].id, // Sistemas
        roleId: adminRole.id
      }
    })

    const supervisorUser = await db.user.upsert({
      where: { email: 'supervisor@mdp.com' },
      update: {},
      create: {
        email: 'supervisor@mdp.com',
        password: 'supervisor123', // En producción, esto debe estar hasheado
        name: 'Supervisor de TI',
        position: 'Supervisor de Soporte',
        departmentId: departments[3].id, // Sistemas
        roleId: supervisorRole.id
      }
    })

    // Crear proveedor de ejemplo
    console.log('🔧 Creando proveedor...')
    const provider = await db.provider.upsert({
      where: { id: 'provider-tech-support' },
      update: {},
      create: {
        id: 'provider-tech-support',
        name: 'Soporte Técnico Profesional',
        contact: 'Juan Rodríguez',
        email: 'contacto@soportetecnico.com',
        phone: '+1-555-0123',
        services: JSON.stringify(['Reparación de laptops', 'Mantenimiento de PCs', 'Recuperación de datos'])
      }
    })

    // Crear configuración del sistema
    console.log('⚙️ Creando configuración del sistema...')
    await Promise.all([
      db.systemConfig.upsert({
        where: { key: 'company_name' },
        update: {},
        create: {
          key: 'company_name',
          value: 'MDP',
          description: 'Nombre de la empresa para generación de códigos'
        }
      }),
      db.systemConfig.upsert({
        where: { key: 'depreciation_rate' },
        update: {},
        create: {
          key: 'depreciation_rate',
          value: '0.1',
          description: 'Tasa de depreciación anual (10%)'
        }
      }),
      db.systemConfig.upsert({
        where: { key: 'notification_email' },
        update: {},
        create: {
          key: 'notification_email',
          value: 'sistemas@mdp.com',
          description: 'Correo electrónico para notificaciones del sistema'
        }
      })
    ])

    console.log('✅ Base de datos inicializada exitosamente!')
    console.log('')
    console.log('📊 Resumen:')
    console.log(`   - Roles: 3 (Administrador, Supervisor, Usuario)`)
    console.log(`   - Departamentos: ${departments.length}`)
    console.log(`   - Tipos de equipos: 5`)
    console.log(`   - Ubicaciones: ${locations.length}`)
    console.log(`   - Usuarios: 2`)
    console.log(`   - Proveedores: 1`)
    console.log('')
    console.log('🔑 Credenciales de ejemplo:')
    console.log('   Administrador: admin@mdp.com / admin123')
    console.log('   Supervisor: supervisor@mdp.com / supervisor123')
    console.log('')
    console.log('🚀 El sistema está listo para usar!')

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error)
    process.exit(1)
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))