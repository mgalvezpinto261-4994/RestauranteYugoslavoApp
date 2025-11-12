# Guía Completa de Debugging y Análisis del Proyecto
## Sistema de Gestión de Restaurante

Esta guía está diseñada para estudiantes y desarrolladores que quieran entender, analizar y debuguear este proyecto paso a paso.

---

## 📋 Tabla de Contenidos

1. [Introducción a la Arquitectura](#1-introducción-a-la-arquitectura)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [Dependencias y Packages](#3-dependencias-y-packages)
4. [Archivos de Configuración](#4-archivos-de-configuración)
5. [Flujo de Datos](#5-flujo-de-datos)
6. [Cómo Debuguear](#6-cómo-debuguear)
7. [Problemas Comunes y Soluciones](#7-problemas-comunes-y-soluciones)
8. [Herramientas de Debugging](#8-herramientas-de-debugging)

---

## 1. Introducción a la Arquitectura

### 1.1 Patrón Arquitectónico
Este proyecto utiliza una **arquitectura Three-Tier**:

\`\`\`
┌─────────────────────────────────────┐
│    CAPA DE PRESENTACIÓN (UI)       │
│  - Componentes React (components/)  │
│  - Páginas Next.js (app/)          │
└─────────────────────────────────────┘
              ↓↑
┌─────────────────────────────────────┐
│   CAPA DE LÓGICA DE NEGOCIO        │
│  - Server Actions (app/actions/)    │
│  - Middleware (middleware.ts)       │
│  - Utilidades (lib/)                │
└─────────────────────────────────────┘
              ↓↑
┌─────────────────────────────────────┐
│    CAPA DE DATOS                    │
│  - Supabase (PostgreSQL)            │
│  - Scripts SQL (scripts/)           │
└─────────────────────────────────────┘
\`\`\`

### 1.2 Tecnologías Core
- **Next.js 15.5.6**: Framework React con App Router
- **React 19.2**: Biblioteca UI con Server Components
- **Supabase**: Base de datos PostgreSQL + Auth
- **TypeScript 5**: Tipado estático
- **Tailwind CSS v4**: Estilos utility-first

---

## 2. Estructura de Archivos

### 2.1 Mapa del Proyecto

\`\`\`
restaurant-app/
│
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions (Backend Logic)
│   │   ├── auth.ts              # Autenticación
│   │   ├── orders.ts            # Lógica de pedidos
│   │   ├── inventory.ts         # Gestión de inventario
│   │   ├── tables.ts            # Gestión de mesas
│   │   ├── menu.ts              # Gestión de menú
│   │   ├── reports.ts           # Reportes de ventas
│   │   └── users.ts             # Gestión de usuarios
│   │
│   ├── admin/                    # Ruta del administrador
│   │   └── page.tsx             # Página de admin
│   │
│   ├── waiter/                   # Ruta del mesero
│   │   └── page.tsx             # Página de mesero
│   │
│   ├── login/                    # Ruta de login
│   │   └── page.tsx             # Página de login
│   │
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio (redirect)
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes de shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (57 componentes)
│   │
│   ├── admin-dashboard.tsx      # Dashboard de admin
│   ├── waiter-dashboard.tsx     # Dashboard de mesero
│   ├── order-form.tsx           # Formulario de pedidos
│   ├── table-grid.tsx           # Grid de mesas
│   ├── active-orders-list.tsx   # Lista de pedidos activos
│   ├── inventory-management.tsx # Gestión de inventario
│   ├── sales-reports.tsx        # Reportes de ventas
│   ├── user-management.tsx      # Gestión de usuarios
│   ├── table-management.tsx     # Gestión de mesas
│   └── header.tsx               # Header de la app
│
├── lib/                          # Librerías y utilidades
│   ├── supabase/                # Clientes de Supabase
│   │   ├── server.ts            # Cliente servidor
│   │   ├── client.ts            # Cliente navegador
│   │   ├── middleware.ts        # Cliente middleware
│   │   └── admin.ts             # Cliente admin (service role)
│   │
│   ├── db.ts                    # Tipos de base de datos
│   ├── auth.ts                  # Utilidades de auth
│   ├── utils.ts                 # Utilidades generales (cn, etc)
│   └── cva.ts                   # Class Variance Authority
│
├── scripts/                      # Scripts SQL
│   ├── 001_create_tables.sql    # Creación de tablas
│   ├── 002_seed_data.sql        # Datos iniciales
│   ├── 003_link_menu_to_inventory.sql
│   ├── 004_update_passwords.sql
│   ├── 005_fix_users.sql
│   ├── 006_create_verify_password_function.sql
│   ├── 007_add_beverages_and_chilean_ingredients.sql
│   ├── 008_update_prices_clp.sql
│   ├── 009_link_beverages_to_inventory.sql
│   ├── 010_add_capacity_to_tables.sql
│   ├── 011_add_insert_policy_to_tables.sql
│   └── 012_add_password_hash_function.sql
│
├── __tests__/                    # Tests automatizados
│   ├── auth.test.ts
│   ├── orders.test.ts
│   ├── inventory.test.ts
│   └── ...
│
├── hooks/                        # Custom React Hooks
│   ├── use-toast.ts             # Hook para notificaciones
│   └── use-mobile.ts            # Hook para detección mobile
│
├── middleware.ts                 # Middleware de Next.js
├── next.config.mjs              # Configuración de Next.js
├── package.json                 # Dependencias
├── tsconfig.json                # Configuración TypeScript
└── postcss.config.mjs           # Configuración PostCSS
\`\`\`

---

## 3. Dependencias y Packages

### 3.1 Framework Core

#### Next.js (15.5.6)
\`\`\`json
"next": "15.5.6"
\`\`\`
**¿Qué hace?** Framework React que provee:
- Server Components (renderizado en servidor)
- App Router (sistema de rutas basado en archivos)
- Server Actions (funciones backend sin API routes)
- Optimización automática

**Dónde se usa:**
- `app/` - Todas las páginas y rutas
- `app/actions/` - Server Actions

#### React (19.2.0)
\`\`\`json
"react": "19.2.0",
"react-dom": "19.2.0"
\`\`\`
**¿Qué hace?** Biblioteca para construir interfaces de usuario
**Características usadas:**
- Server Components (componentes que se ejecutan en el servidor)
- Client Components (componentes interactivos)
- Hooks (useState, useEffect, etc.)

### 3.2 Base de Datos y Backend

#### Supabase
\`\`\`json
"@supabase/ssr": "0.7.0",
"@supabase/supabase-js": "2.80.0"
\`\`\`
**¿Qué hace?** Backend-as-a-Service que provee:
- PostgreSQL database
- Row Level Security (RLS)
- Autenticación
- APIs REST automáticas

**Dónde se usa:**
- `lib/supabase/` - Clientes de Supabase
- `app/actions/` - Todas las operaciones de base de datos

#### Variables de entorno necesarias:
\`\`\`env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
\`\`\`

### 3.3 UI y Estilos

#### Tailwind CSS (v4)
\`\`\`json
"@tailwindcss/postcss": "^4.1.9",
"tailwindcss": "^4.1.9"
\`\`\`
**¿Qué hace?** Framework CSS utility-first
**Archivo principal:** `app/globals.css`

#### shadcn/ui (Componentes)
Biblioteca de componentes basada en Radix UI:
\`\`\`json
"@radix-ui/react-dialog": "1.1.4",
"@radix-ui/react-dropdown-menu": "2.1.4",
// ... más de 20 componentes Radix UI
\`\`\`
**Dónde están:** `components/ui/`

#### Lucide React (Iconos)
\`\`\`json
"lucide-react": "^0.454.0"
\`\`\`
**¿Qué hace?** Biblioteca de iconos
**Ejemplo de uso:**
\`\`\`tsx
import { User, ShoppingCart } from 'lucide-react'
\`\`\`

### 3.4 Formularios y Validación

#### React Hook Form
\`\`\`json
"react-hook-form": "^7.60.0",
"@hookform/resolvers": "^3.10.0"
\`\`\`
**¿Qué hace?** Manejo de formularios con validación
**Dónde se usa:**
- `components/order-form.tsx`
- `components/login-form.tsx`
- `components/user-management.tsx`

#### Zod
\`\`\`json
"zod": "3.25.76"
\`\`\`
**¿Qué hace?** Validación de schemas TypeScript
**Ejemplo:**
\`\`\`typescript
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})
\`\`\`

### 3.5 Utilidades

#### date-fns
\`\`\`json
"date-fns": "4.1.0"
\`\`\`
**¿Qué hace?** Manejo de fechas
**Dónde se usa:**
- `components/sales-reports.tsx` - Formateo de fechas
- `app/actions/reports.ts` - Cálculo de rangos

#### SWR
\`\`\`json
"swr": "2.3.6"
\`\`\`
**¿Qué hace?** Data fetching con caché
**Dónde se usa:**
- `components/inventory-management.tsx`
- Cualquier componente que necesite revalidación automática

#### class-variance-authority
\`\`\`json
"class-variance-authority": "^0.7.1"
\`\`\`
**¿Qué hace?** Manejo de variantes de componentes
**Ejemplo:**
\`\`\`typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary",
      destructive: "bg-red-500"
    }
  }
})
\`\`\`

### 3.6 Gráficos

#### Recharts
\`\`\`json
"recharts": "2.15.4"
\`\`\`
**¿Qué hace?** Biblioteca de gráficos
**Dónde se usa:**
- `components/sales-reports.tsx` - Gráficos de ventas

---

## 4. Archivos de Configuración

### 4.1 next.config.mjs

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Ignora errores de ESLint en build
  },
  typescript: {
    ignoreBuildErrors: true,    // Ignora errores de TypeScript en build
  },
  images: {
    unoptimized: true,          // No optimiza imágenes (para v0)
  },
}
\`\`\`

**¿Para qué sirve?**
- Configura el comportamiento de Next.js durante el build
- En producción, deberías habilitar las validaciones

### 4.2 tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2017",              // JavaScript target
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,                  // Permite archivos .js
    "skipLibCheck": true,             // No revisa tipos de node_modules
    "strict": true,                   // Modo estricto de TypeScript
    "noEmit": true,                   // No genera archivos .js
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",                // Preserva JSX para Next.js
    "incremental": true,
    "plugins": [
      {
        "name": "next"                // Plugin de Next.js
      }
    ],
    "paths": {
      "@/*": ["./*"]                  // Alias @ para imports
    }
  }
}
\`\`\`

**¿Para qué sirve?**
- Define cómo TypeScript compila el código
- Configura paths para imports limpios: `import { Button } from '@/components/ui/button'`

### 4.3 package.json - Scripts

\`\`\`json
{
  "scripts": {
    "dev": "next dev",              // Inicia servidor de desarrollo
    "build": "next build",          // Construye para producción
    "start": "next start",          // Inicia servidor de producción
    "lint": "eslint .",             // Revisa código
    "test": "jest",                 // Ejecuta tests
    "test:watch": "jest --watch"    // Tests en modo watch
  }
}
\`\`\`

**Cómo usarlos:**
\`\`\`bash
npm run dev        # Desarrollo local
npm run build      # Build de producción
npm run test       # Ejecutar tests
\`\`\`

### 4.4 postcss.config.mjs

\`\`\`javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},     // Plugin de Tailwind CSS v4
  },
}
\`\`\`

**¿Para qué sirve?**
- Configura PostCSS para procesar Tailwind CSS
- Tailwind v4 usa este sistema para compilar estilos

### 4.5 components.json

\`\`\`json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
\`\`\`

**¿Para qué sirve?**
- Configuración de shadcn/ui CLI
- Define dónde se instalan los componentes

---

## 5. Flujo de Datos

### 5.1 Arquitectura de Datos

\`\`\`
┌──────────────┐
│   Browser    │
│  (Cliente)   │
└──────────────┘
       ↓↑
┌──────────────────────────────────────┐
│   React Components                   │
│   - useState (estado local)          │
│   - useEffect (efectos)              │
│   - Formularios (react-hook-form)    │
└──────────────────────────────────────┘
       ↓↑
┌──────────────────────────────────────┐
│   Server Actions                     │
│   (app/actions/*.ts)                 │
│   - 'use server'                     │
│   - Valida autenticación             │
│   - Valida permisos                  │
└──────────────────────────────────────┘
       ↓↑
┌──────────────────────────────────────┐
│   Supabase Client                    │
│   (lib/supabase/server.ts)           │
│   - Maneja sesiones                  │
│   - Ejecuta queries                  │
└──────────────────────────────────────┘
       ↓↑
┌──────────────────────────────────────┐
│   Supabase (PostgreSQL)              │
│   - Row Level Security               │
│   - Triggers                         │
│   - Functions                        │
└──────────────────────────────────────┘
\`\`\`

### 5.2 Ejemplo: Crear un Pedido

**Paso 1: Usuario interactúa con UI**
\`\`\`tsx
// components/order-form.tsx
const handleSubmit = async (data) => {
  const result = await createOrder(data)  // ← Llama a Server Action
}
\`\`\`

**Paso 2: Server Action procesa**
\`\`\`typescript
// app/actions/orders.ts
'use server'

export async function createOrder(data) {
  // 1. Verifica autenticación
  const user = await getCurrentUser()
  if (!user) return { error: 'No autenticado' }
  
  // 2. Crea cliente Supabase
  const supabase = createClient()
  
  // 3. Verifica pedido existente
  const existing = await getActiveOrderForTable(tableId)
  
  // 4. Inserta o actualiza en BD
  if (existing) {
    await addItemsToOrder(existing.id, items)
  } else {
    // Inserta nuevo pedido
    const { data: order } = await supabase
      .from('orders')
      .insert({ ... })
    
    // Descuenta inventario
    await deductInventory(items)
  }
  
  return { success: true }
}
\`\`\`

**Paso 3: Supabase ejecuta**
\`\`\`sql
-- Supabase verifica RLS policies
-- Ejecuta INSERT
-- Dispara triggers (si existen)
-- Retorna resultado
\`\`\`

### 5.3 Flujo de Autenticación

\`\`\`
1. Usuario ingresa credenciales
   ↓
2. login(username, password)
   [app/actions/auth.ts]
   ↓
3. Busca usuario en BD
   SELECT * FROM users WHERE username = ?
   ↓
4. Verifica contraseña con función SQL
   SELECT verify_password_for_user(?, ?)
   ↓
5. Si es correcto, crea sesión
   Guarda en cookies (Supabase SSR)
   ↓
6. Middleware verifica sesión
   [middleware.ts]
   ↓
7. Usuario accede a ruta protegida
\`\`\`

### 5.4 Row Level Security (RLS)

Supabase usa políticas RLS para seguridad:

\`\`\`sql
-- Ejemplo: Solo meseros y admins pueden ver pedidos
CREATE POLICY "Users can view orders"
  ON orders FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE role IN ('waiter', 'admin')
    )
  );
\`\`\`

**¿Por qué importa?**
- Aunque se llame desde el código, la BD verifica permisos
- No se puede bypassear desde el cliente

---

## 6. Cómo Debuguear

### 6.1 Debugging de Server Actions

**Técnica 1: Console Logs**

\`\`\`typescript
// app/actions/orders.ts
export async function createOrder(data: OrderData) {
  console.log('[v0] createOrder called with:', data)
  
  const user = await getCurrentUser()
  console.log('[v0] Current user:', user)
  
  try {
    const result = await supabase.from('orders').insert(...)
    console.log('[v0] Insert result:', result)
    
    if (result.error) {
      console.error('[v0] Database error:', result.error)
    }
    
    return result
  } catch (error) {
    console.error('[v0] Exception caught:', error)
    throw error
  }
}
\`\`\`

**¿Dónde ver los logs?**
- Server Actions: Terminal donde corre `npm run dev`
- Client Components: Consola del navegador (F12)

**Técnica 2: Manejo de Errores**

\`\`\`typescript
export async function createOrder(data: OrderData) {
  try {
    // ... código
  } catch (error) {
    // Loguea el error completo
    console.error('[v0] Full error object:', JSON.stringify(error, null, 2))
    
    // Si es error de Supabase
    if (error instanceof Error) {
      console.error('[v0] Error message:', error.message)
      console.error('[v0] Error stack:', error.stack)
    }
    
    // Retorna error amigable al usuario
    return {
      error: 'Error al crear pedido',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }
  }
}
\`\`\`

### 6.2 Debugging de Componentes React

**Técnica 1: React DevTools**

\`\`\`bash
# Instala extensión en Chrome/Firefox
React Developer Tools
\`\`\`

**¿Qué puedes ver?**
- Árbol de componentes
- Props de cada componente
- State actual
- Context values

**Técnica 2: Console Logs Estratégicos**

\`\`\`tsx
// components/order-form.tsx
export function OrderForm() {
  const [cart, setCart] = useState([])
  
  // Debug: Log cuando cambia el cart
  useEffect(() => {
    console.log('[v0] Cart updated:', cart)
  }, [cart])
  
  const handleAddToCart = (item) => {
    console.log('[v0] Adding item to cart:', item)
    setCart(prev => [...prev, item])
  }
  
  const handleSubmit = async (data) => {
    console.log('[v0] Form submitted with data:', data)
    console.log('[v0] Current cart:', cart)
    
    const result = await createOrder(data)
    console.log('[v0] Order result:', result)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  )
}
\`\`\`

**Técnica 3: Breakpoints**

En Chrome DevTools:
1. Abre Sources tab
2. Busca tu archivo (Cmd/Ctrl + P)
3. Click en número de línea para agregar breakpoint
4. Ejecuta la acción
5. Inspecciona variables cuando pause

### 6.3 Debugging de Base de Datos

**Técnica 1: Supabase Studio**

\`\`\`
1. Ir a https://supabase.com/dashboard
2. Seleccionar tu proyecto
3. Ir a "SQL Editor"
4. Ejecutar queries manualmente
\`\`\`

**Técnica 2: Logs en Supabase Queries**

\`\`\`typescript
// app/actions/orders.ts
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('table_id', tableId)

// Loguea la query completa
console.log('[v0] Supabase query executed')
console.log('[v0] Table:', 'orders')
console.log('[v0] Filter:', { table_id: tableId })
console.log('[v0] Result:', { data, error })

// Si hay error, loguea detalles
if (error) {
  console.error('[v0] Supabase error code:', error.code)
  console.error('[v0] Supabase error message:', error.message)
  console.error('[v0] Supabase error details:', error.details)
  console.error('[v0] Supabase error hint:', error.hint)
}
\`\`\`

**Técnica 3: Revisar Políticas RLS**

\`\`\`sql
-- En Supabase SQL Editor, verifica políticas
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Deshabilita RLS temporalmente para debugging (¡SOLO EN DESARROLLO!)
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Vuelve a habilitar
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
\`\`\`

### 6.4 Debugging de Autenticación

**Técnica 1: Verificar Sesión**

\`\`\`typescript
// app/actions/auth.ts
export async function debugSession() {
  'use server'
  
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('[v0] Session exists:', !!session)
  console.log('[v0] Session user:', session?.user)
  console.log('[v0] Session expires at:', session?.expires_at)
  
  return session
}
\`\`\`

**Técnica 2: Verificar Cookies**

\`\`\`typescript
// middleware.ts
import { NextResponse } from 'next/server'

export async function middleware(req) {
  console.log('[v0] Middleware: Path:', req.nextUrl.pathname)
  console.log('[v0] Middleware: Cookies:', req.cookies.getAll())
  
  // ... resto del middleware
}
\`\`\`

**Técnica 3: Revisar Variables de Entorno**

\`\`\`typescript
// app/actions/debug.ts
'use server'

export async function debugEnvVars() {
  return {
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV
  }
}
\`\`\`

### 6.5 Debugging de Rendimiento

**Técnica 1: Medir Tiempo de Operaciones**

\`\`\`typescript
export async function createOrder(data: OrderData) {
  const startTime = Date.now()
  console.log('[v0] createOrder started')
  
  // ... operaciones
  
  const endTime = Date.now()
  console.log(`[v0] createOrder completed in ${endTime - startTime}ms`)
}
\`\`\`

**Técnica 2: React Profiler**

\`\`\`tsx
import { Profiler } from 'react'

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration
) {
  console.log(`[v0] ${id} took ${actualDuration}ms`)
}

<Profiler id="OrderForm" onRender={onRenderCallback}>
  <OrderForm />
</Profiler>
\`\`\`

**Técnica 3: Network Tab**

En Chrome DevTools > Network:
1. Ve cuando se hacen requests
2. Revisa tiempos de respuesta
3. Inspecciona payloads

---

## 7. Problemas Comunes y Soluciones

### 7.1 Error: "Cannot read properties of undefined"

**Síntoma:**
\`\`\`
Cannot read properties of undefined (reading 'map')
\`\`\`

**Causa:**
Intentando acceder a una propiedad de un objeto que es `undefined` o `null`

**Solución:**

\`\`\`typescript
// ❌ Malo
function OrdersList({ orders }) {
  return orders.map(order => <OrderCard order={order} />)
}

// ✅ Bueno
function OrdersList({ orders }) {
  // Maneja caso cuando orders es undefined
  if (!orders || orders.length === 0) {
    return <p>No hay pedidos</p>
  }
  
  return orders.map(order => <OrderCard order={order} />)
}
\`\`\`

**Debugging:**
\`\`\`typescript
function OrdersList({ orders }) {
  console.log('[v0] Orders received:', orders)
  console.log('[v0] Orders is array:', Array.isArray(orders))
  console.log('[v0] Orders length:', orders?.length)
  
  // ... resto del código
}
\`\`\`

### 7.2 Error: "Supabase URL and Key required"

**Síntoma:**
\`\`\`
Your project's URL and Key are required to create a Supabase client!
\`\`\`

**Causa:**
Variables de entorno de Supabase no están disponibles

**Solución:**

1. Verifica que existen las variables:
\`\`\`typescript
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY)
\`\`\`

2. Asegúrate de usar las variables correctas:
\`\`\`typescript
// lib/supabase/server.ts
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
\`\`\`

3. Si estás en cliente, usa `NEXT_PUBLIC_`:
\`\`\`typescript
// lib/supabase/client.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
\`\`\`

### 7.3 Error: "Row violates row-level security policy"

**Síntoma:**
\`\`\`
new row violates row-level security policy for table "orders"
\`\`\`

**Causa:**
Intentando insertar/actualizar sin permisos RLS

**Solución:**

1. Revisa las políticas RLS en Supabase:
\`\`\`sql
SELECT * FROM pg_policies WHERE tablename = 'orders';
\`\`\`

2. Agrega política de INSERT:
\`\`\`sql
CREATE POLICY "Users can insert orders"
  ON orders FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('waiter', 'admin')
    )
  );
\`\`\`

3. O usa service role para operaciones admin:
\`\`\`typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Bypasea RLS
  )
}
\`\`\`

### 7.4 Error: "Hydration failed"

**Síntoma:**
\`\`\`
Hydration failed because the initial UI does not match 
what was rendered on the server
\`\`\`

**Causa:**
Diferencia entre HTML renderizado en servidor vs cliente

**Causas comunes:**
- Usar `Date.now()` o `Math.random()` en render
- Acceder a `window` o `localStorage` en Server Component
- Diferencias de formato (ej: fechas)

**Solución:**

\`\`\`tsx
// ❌ Malo - genera HTML diferente en servidor y cliente
function Component() {
  return <div>{Date.now()}</div>
}

// ✅ Bueno - usa useEffect para cliente
'use client'
function Component() {
  const [time, setTime] = useState(null)
  
  useEffect(() => {
    setTime(Date.now())
  }, [])
  
  if (!time) return <div>Cargando...</div>
  return <div>{time}</div>
}
\`\`\`

### 7.5 Performance: Pedidos lentos

**Síntoma:**
Crear pedido toma 3+ segundos

**Causa:**
Múltiples queries secuenciales

**Solución:**

\`\`\`typescript
// ❌ Malo - queries en bucle (secuenciales)
for (const item of items) {
  await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', item.id)
    .single()
}

// ✅ Bueno - query única batch
const itemIds = items.map(i => i.id)
const { data: inventoryItems } = await supabase
  .from('inventory_items')
  .select('*')
  .in('id', itemIds) // ← Una sola query
\`\`\`

\`\`\`typescript
// ❌ Malo - actualizaciones secuenciales
for (const update of updates) {
  await supabase
    .from('inventory_items')
    .update({ quantity: update.quantity })
    .eq('id', update.id)
}

// ✅ Bueno - actualizaciones paralelas
await Promise.all(
  updates.map(update =>
    supabase
      .from('inventory_items')
      .update({ quantity: update.quantity })
      .eq('id', update.id)
  )
)
\`\`\`

---

## 8. Herramientas de Debugging

### 8.1 Chrome DevTools

**Acceso:** F12 o Click derecho > Inspeccionar

**Tabs importantes:**

1. **Console**
   - Ver console.logs
   - Ejecutar JavaScript
   - Ver errores

2. **Sources**
   - Agregar breakpoints
   - Step through code
   - Watch variables

3. **Network**
   - Ver requests HTTP
   - Inspeccionar payloads
   - Revisar tiempos

4. **Application**
   - Ver cookies
   - LocalStorage
   - Session Storage

### 8.2 React Developer Tools

**Instalación:**
- Chrome: https://chrome.google.com/webstore
- Firefox: https://addons.mozilla.org

**Funciones:**
1. **Components Tab**
   - Ver árbol de componentes
   - Inspeccionar props
   - Ver hooks state

2. **Profiler Tab**
   - Medir rendimiento
   - Ver re-renders
   - Identificar componentes lentos

### 8.3 Supabase Dashboard

**URL:** https://supabase.com/dashboard

**Herramientas:**

1. **SQL Editor**
   - Ejecutar queries manualmente
   - Probar funciones SQL
   - Ver resultados directamente

2. **Table Editor**
   - Ver datos en tablas
   - Editar rows manualmente
   - Ver estructura

3. **Authentication**
   - Ver usuarios
   - Gestionar sesiones
   - Ver políticas

4. **Database > Roles and Policies**
   - Ver RLS policies
   - Editar permisos

5. **Logs**
   - Ver queries ejecutadas
   - Ver errores de base de datos

### 8.4 VSCode Debugger

**Configuración:** `.vscode/launch.json`

\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
\`\`\`

**Uso:**
1. Pon breakpoints en VSCode (click en número de línea)
2. Presiona F5 o ve a Run > Start Debugging
3. Ejecuta la acción
4. VSCode pausará en breakpoints

### 8.5 Postman / Thunder Client

Para probar APIs manualmente:

**Ejemplo: Probar createOrder**

\`\`\`
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "tableId": "uuid-here",
  "items": [
    { "menuItemId": "uuid", "quantity": 2 }
  ]
}
\`\`\`

---

## 9. Mejores Prácticas de Debugging

### 9.1 Logging Estructurado

\`\`\`typescript
// ✅ Bueno - logging estructurado
console.log('[v0] Component:', 'OrderForm')
console.log('[v0] Action:', 'handleSubmit')
console.log('[v0] Data:', { cart, tableId })

// ❌ Malo - logging no estructurado
console.log('submitting')
console.log(cart)
\`\`\`

### 9.2 Try-Catch en Server Actions

\`\`\`typescript
export async function createOrder(data: OrderData) {
  try {
    // ... lógica
    return { success: true }
  } catch (error) {
    console.error('[v0] Error in createOrder:', error)
    
    // Retorna error estructurado
    return {
      error: 'Error al crear pedido',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}
\`\`\`

### 9.3 Validación de Entrada

\`\`\`typescript
export async function createOrder(data: OrderData) {
  // Valida entrada primero
  if (!data.tableId) {
    console.error('[v0] Missing tableId')
    return { error: 'tableId es requerido' }
  }
  
  if (!data.items || data.items.length === 0) {
    console.error('[v0] Empty items')
    return { error: 'items no puede estar vacío' }
  }
  
  // ... resto de la lógica
}
\`\`\`

### 9.4 Manejo de Estado Async

\`\`\`tsx
function OrderForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const handleSubmit = async (data) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await createOrder(data)
      
      if (result.error) {
        setError(result.error)
        console.error('[v0] Order creation failed:', result.error)
      } else {
        console.log('[v0] Order created successfully')
      }
    } catch (err) {
      setError('Error inesperado')
      console.error('[v0] Exception:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <Alert>{error}</Alert>}
      <Button disabled={loading}>
        {loading ? 'Procesando...' : 'Crear Pedido'}
      </Button>
    </form>
  )
}
\`\`\`

---

## 10. Checklist de Debugging

Cuando encuentres un bug, sigue este checklist:

### 10.1 Identificación

- [ ] ¿En qué página/componente ocurre?
- [ ] ¿Qué acción lo dispara?
- [ ] ¿Es reproducible consistentemente?
- [ ] ¿Aparece en consola algún error?

### 10.2 Aislamiento

- [ ] ¿Ocurre solo en un componente o en múltiples?
- [ ] ¿Es problema de frontend o backend?
- [ ] ¿Está relacionado con autenticación?
- [ ] ¿Está relacionado con base de datos?

### 10.3 Investigación

- [ ] Agrega console.logs estratégicos
- [ ] Revisa Network tab para requests
- [ ] Verifica datos en Supabase
- [ ] Revisa políticas RLS
- [ ] Inspecciona props y state en React DevTools

### 10.4 Solución

- [ ] Identifica la causa raíz
- [ ] Implementa fix
- [ ] Prueba manualmente
- [ ] Agrega test automatizado (si aplica)
- [ ] Limpia console.logs de debugging

### 10.5 Documentación

- [ ] Documenta el problema encontrado
- [ ] Documenta la solución aplicada
- [ ] Actualiza tests si es necesario

---

## 11. Recursos Adicionales

### 11.1 Documentación Oficial

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### 11.2 Herramientas Online

- **TypeScript Playground**: https://www.typescriptlang.org/play
- **Tailwind Play**: https://play.tailwindcss.com
- **React DevTools**: Extensión de navegador

### 11.3 Comunidades

- **Stack Overflow**: Para preguntas específicas
- **Discord de Next.js**: Comunidad oficial
- **Discord de Supabase**: Comunidad oficial

---

## 12. Ejercicios Prácticos

### Ejercicio 1: Agregar Logging

**Objetivo:** Agregar logs estratégicos en `createOrder`

**Pasos:**
1. Abre `app/actions/orders.ts`
2. Agrega logs al inicio, medio y fin de la función
3. Ejecuta la función y observa logs en terminal
4. Identifica cuánto tiempo toma cada paso

### Ejercicio 2: Debuguear con Breakpoints

**Objetivo:** Usar breakpoints para inspeccionar flujo

**Pasos:**
1. Abre Chrome DevTools > Sources
2. Busca `order-form.tsx` (Cmd+P)
3. Pon breakpoint en `handleSubmit`
4. Crea un pedido
5. Inspecciona variables cuando pause

### Ejercicio 3: Analizar Query Performance

**Objetivo:** Identificar queries lentas

**Pasos:**
1. Abre Network tab en DevTools
2. Filtra por "Fetch/XHR"
3. Crea un pedido
4. Observa cuántos requests se hacen
5. Identifica cuál es el más lento

### Ejercicio 4: Revisar RLS Policies

**Objetivo:** Entender políticas de seguridad

**Pasos:**
1. Ve a Supabase Dashboard > Database > Policies
2. Revisa políticas de la tabla `orders`
3. Intenta crear una política nueva de prueba
4. Prueba insertando datos manualmente

---

## Conclusión

Esta guía te proporciona las herramientas y conocimientos necesarios para:

1. **Entender** la arquitectura del proyecto
2. **Navegar** el código de manera efectiva
3. **Debuguear** problemas comunes
4. **Optimizar** rendimiento
5. **Mantener** y extender la aplicación

Recuerda: el debugging es un proceso iterativo. No te frustres si no encuentras el problema inmediatamente. Usa las herramientas, sigue el flujo de datos, y eventualmente identificarás la causa raíz.

**¡Buena suerte debugueando!** 🚀
