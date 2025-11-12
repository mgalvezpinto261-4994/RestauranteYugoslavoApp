# El Yugoslavo - Sistema de Gestión de Restaurante

Sistema completo de gestión para restaurantes con control de mesas, pedidos, inventario y reportes de ventas.

## 📋 Características

### Autenticación y Roles
- **Administrador**: Control total del sistema
- **Mesero**: Gestión de pedidos y mesas

### Usuarios de Prueba
- **Admin**: `admin` / `admin123`
- **Mesero**: `mesero` / `mesero123`

### Funcionalidades Principales

#### Para Meseros
- ✅ Visualización de mesas disponibles/ocupadas
- ✅ Creación de pedidos para mesas
- ✅ Agregar items a pedidos existentes
- ✅ Ver estado de inventario en tiempo real
- ✅ Alertas de stock bajo en menús

#### Para Administradores
- ✅ Todas las funcionalidades del mesero
- ✅ Liberar mesas (marcar como pagadas)
- ✅ Ver todos los pedidos activos
- ✅ Reportes de ventas (diario, semanal, mensual, anual)
- ✅ Gestión de inventario
- ✅ Ajuste de stock de ingredientes
- ✅ Alertas de stock bajo
- ✅ Gestión de usuarios

### Sistema de Inventario
- ✅ Ingredientes organizados por categorías
- ✅ Descuento automático de inventario al crear pedidos
- ✅ Validación de stock antes de procesar pedidos
- ✅ Alertas visuales de stock bajo
- ✅ Tracking de stock mínimo y máximo

### Menú
- ✅ Platos típicos chilenos
- ✅ Cada plato asociado a ingredientes del inventario
- ✅ Precios en pesos chilenos (CLP)
- ✅ Categorías: Entradas, Platos Principales, Acompañamientos, Postres, Bebidas

### Base de Datos
- ✅ Base de datos PostgreSQL en Supabase
- ✅ Persistencia permanente de datos
- ✅ Row Level Security (RLS) para seguridad
- ✅ Funciones SQL personalizadas

## 🚀 Instalación

Consulta la [Guía de Instalación Local](./docs/GUIA_INSTALACION_LOCAL.md) para instrucciones detalladas.

### Resumen Rápido

\`\`\`bash
# Instalar dependencias
npm install --legacy-peer-deps

# Configurar variables de entorno
# Crea un archivo .env.local con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev

# Ejecutar pruebas
npm test

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
├── app/                    # Aplicación Next.js (App Router)
│   ├── actions/           # Server Actions (lógica del servidor)
│   │   ├── auth.ts        # Autenticación de usuarios
│   │   ├── inventory.ts   # Gestión de inventario
│   │   ├── menu.ts        # Gestión de menú
│   │   ├── orders.ts      # Gestión de pedidos
│   │   ├── reports.ts     # Reportes de ventas
│   │   ├── tables.ts      # Gestión de mesas
│   │   └── users.ts       # Gestión de usuarios
│   ├── admin/             # Página de administrador
│   ├── waiter/            # Página de mesero
│   ├── login/             # Página de login
│   ├── api/               # API Routes
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/            # Componentes React
│   ├── ui/                # Componentes de UI base (shadcn/ui)
│   ├── admin-dashboard.tsx
│   ├── waiter-dashboard.tsx
│   ├── order-form.tsx
│   ├── inventory-management.tsx
│   ├── sales-reports.tsx
│   └── ...
├── lib/                   # Utilidades y configuraciones
│   ├── supabase/          # Clientes de Supabase
│   ├── auth.ts            # Helpers de autenticación
│   └── utils.ts           # Utilidades generales
├── scripts/               # Scripts SQL para base de datos
├── docs/                  # Documentación del proyecto
└── __tests__/             # Pruebas automatizadas
\`\`\`

## 📖 Documentación

- [Guía de Instalación Local](./docs/GUIA_INSTALACION_LOCAL.md) - Instrucciones paso a paso
- [Guía de Variables de Supabase](./docs/GUIA_VARIABLES_SUPABASE.md) - Configuración de credenciales
- [Guía de Debugging](./docs/GUIA_DEBUGGING_Y_ANALISIS.md) - Solución de problemas
- [Documentación de Archivos](./docs/DOCUMENTACION_ARCHIVOS.md) - Explicación detallada de cada archivo

## 🔄 Flujo de Trabajo

### Como Mesero

1. **Iniciar sesión** con `mesero` / `mesero123`
2. **Seleccionar una mesa** disponible
3. **Agregar items** del menú al pedido
4. **Crear pedido** - La mesa cambia a estado "ocupado"
5. **Agregar más items** seleccionando la misma mesa nuevamente
6. El sistema descuenta automáticamente del inventario

### Como Administrador

1. **Iniciar sesión** con `admin` / `admin123`
2. **Ver dashboard** con estadísticas en tiempo real
3. **Tomar pedidos** igual que un mesero
4. **Ver pedidos activos** de todos los meseros
5. **Liberar mesas** cuando los clientes paguen
6. **Gestionar inventario** ajustando stock
7. **Ver reportes** de ventas por período
8. **Gestionar usuarios** (crear, editar, eliminar)

## 🧪 Pruebas Automatizadas

El sistema incluye pruebas automatizadas que validan:

- ✅ Gestión de usuarios
- ✅ Gestión de mesas
- ✅ Creación y actualización de pedidos
- ✅ Sistema de inventario
- ✅ Descuento automático de stock
- ✅ Validación de stock disponible

Ejecutar pruebas:
\`\`\`bash
npm test
\`\`\`

## 🛠️ Tecnologías

- **Next.js 15** - Framework React con App Router
- **React 19** - Librería UI
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **Radix UI** - Componentes accesibles
- **Supabase** - Base de datos PostgreSQL
- **Jest** - Testing
- **Server Actions** - Lógica del servidor

## 📝 Notas Importantes

### Base de Datos
- Los datos se almacenan permanentemente en Supabase
- Se requiere configuración de variables de entorno
- Consulta la guía de instalación para configurar Supabase

### Inventario
- El inventario se descuenta automáticamente al crear pedidos
- Si no hay suficiente stock, el sistema muestra una alerta
- Los items sin stock aparecen con un badge "Sin stock"
- El admin puede ajustar el stock en cualquier momento

### Reportes
- Los reportes muestran solo pedidos pagados (no activos)
- Períodos disponibles: Día, Semana, Mes, Año
- Los totales se muestran en pesos chilenos (CLP)

## 🔮 Próximas Mejoras Sugeridas

- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Impresión de recibos
- [ ] División de cuentas
- [ ] Sistema de propinas
- [ ] Múltiples meseros con tracking
- [ ] Reservas de mesas
- [ ] Gestión de turnos
- [ ] Exportación de reportes a PDF/Excel
- [ ] Aplicación móvil

## 📄 Licencia

Este proyecto es privado y de uso interno.
