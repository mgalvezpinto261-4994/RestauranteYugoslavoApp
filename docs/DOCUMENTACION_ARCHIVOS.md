# 📚 Documentación Completa de Archivos del Proyecto

Esta guía explica cada archivo del proyecto de manera detallada para facilitar el entendimiento, especialmente para estudiantes en práctica.

---

## 📁 Estructura General del Proyecto

Este es un proyecto **Next.js 15** que usa el **App Router**. Next.js es un framework de React que permite crear aplicaciones web completas con servidor y cliente.

---

## 🔧 Archivos de Configuración

### `package.json`
**¿Qué es?** Archivo que define el proyecto, sus dependencias y scripts.

**Contenido importante:**
- **name**: Nombre del proyecto (`sistema-gestion-restaurante`)
- **scripts**: Comandos que puedes ejecutar:
  - `npm run dev`: Inicia el servidor de desarrollo
  - `npm run build`: Compila el proyecto para producción
  - `npm start`: Ejecuta el proyecto compilado
  - `npm test`: Ejecuta las pruebas
- **dependencies**: Librerías que el proyecto necesita para funcionar
- **devDependencies**: Librerías solo para desarrollo

**Para el alumno:** Este archivo es como la "receta" del proyecto. Define qué herramientas usa.

---

### `tsconfig.json`
**¿Qué es?** Configuración de TypeScript (lenguaje que añade tipos a JavaScript).

**Para el alumno:** TypeScript ayuda a encontrar errores antes de ejecutar el código. Este archivo le dice a TypeScript cómo trabajar con este proyecto.

---

### `next.config.mjs`
**¿Qué es?** Configuración específica de Next.js.

**Para el alumno:** Aquí se configuran opciones especiales de Next.js. Por ahora no necesitas modificarlo.

---

### `jest.config.js`
**¿Qué es?** Configuración para las pruebas automatizadas.

**Para el alumno:** Jest es la herramienta que ejecuta las pruebas. Este archivo le dice cómo ejecutarlas.

---

### `components.json`
**¿Qué es?** Configuración de shadcn/ui (componentes de UI).

**Para el alumno:** shadcn/ui es una librería de componentes bonitos y reutilizables. Este archivo configura dónde se guardan.

---

### `.env.local`
**¿Qué es?** Variables de entorno (credenciales y configuraciones secretas).

**Contenido:**
- Credenciales de Supabase (base de datos)
- URLs y claves de API

**⚠️ IMPORTANTE:** Este archivo NO se sube a repositorios públicos (está en `.gitignore`). Contiene información sensible.

**Para el alumno:** Aquí guardas las "llaves" para conectarte a servicios externos como la base de datos.

---

## 📂 Carpeta `app/` - Aplicación Principal

En Next.js 15, la carpeta `app/` define las rutas y páginas de tu aplicación.

### `app/layout.tsx`
**¿Qué hace?** Define el layout (estructura) principal de todas las páginas.

**Contenido:**
- Configuración de metadatos (título, descripción)
- Fuentes (tipografía)
- Componentes globales como `<Toaster />` (para mostrar notificaciones)

**Para el alumno:** Es como el "marco" de todas las páginas. Todo lo que pongas aquí aparecerá en todas las páginas.

---

### `app/page.tsx`
**¿Qué hace?** Página de inicio (`/`). Redirige al login si no estás autenticado.

**Para el alumno:** Es la primera página que ve el usuario cuando entra a la aplicación.

---

### `app/login/page.tsx`
**¿Qué hace?** Página de inicio de sesión (`/login`).

**Contenido:**
- Renderiza el componente `<LoginForm />`
- Maneja la redirección si ya estás logueado

**Para el alumno:** Aquí el usuario ingresa su usuario y contraseña.

---

### `app/admin/page.tsx`
**¿Qué hace?** Página del panel de administrador (`/admin`).

**Contenido:**
- Verifica que el usuario sea admin
- Renderiza el componente `<AdminDashboard />`
- Redirige al login si no está autenticado

**Para el alumno:** Solo los administradores pueden ver esta página.

---

### `app/waiter/page.tsx`
**¿Qué hace?** Página del panel de mesero (`/waiter`).

**Contenido:**
- Verifica que el usuario esté autenticado
- Renderiza el componente `<WaiterDashboard />`
- Redirige al login si no está autenticado

**Para el alumno:** Los meseros y administradores pueden ver esta página.

---

## 📂 Carpeta `app/actions/` - Server Actions

Los **Server Actions** son funciones que se ejecutan en el servidor. Son la forma moderna de manejar formularios y operaciones en Next.js.

### `app/actions/auth.ts`
**¿Qué hace?** Maneja toda la autenticación (login, logout, verificación de sesión).

**Funciones principales:**
- `login(username, password)`: Verifica credenciales y crea sesión
- `logout()`: Cierra la sesión
- `getSession()`: Obtiene la sesión actual
- `getCurrentUser()`: Obtiene el usuario actual

**Cómo funciona:**
1. El usuario ingresa usuario y contraseña
2. Se busca el usuario en la base de datos
3. Se verifica la contraseña usando la función SQL `verify_password`
4. Si es correcta, se crea una cookie de sesión
5. Se redirige al usuario según su rol (admin o waiter)

**Para el alumno:** Este archivo es el "portero" de la aplicación. Decide quién puede entrar.

---

### `app/actions/orders.ts`
**¿Qué hace?** Maneja todas las operaciones relacionadas con pedidos.

**Funciones principales:**
- `createOrder()`: Crea un nuevo pedido
- `addItemsToOrder()`: Agrega items a un pedido existente
- `getActiveOrders()`: Obtiene todos los pedidos activos
- `payOrder()`: Marca un pedido como pagado
- `getOrderById()`: Obtiene un pedido específico

**Cómo funciona:**
1. Se valida que haya stock suficiente
2. Se crea el pedido en la base de datos
3. Se descuenta el inventario automáticamente
4. Se actualiza el estado de la mesa

**Para el alumno:** Este es el "corazón" del sistema. Aquí se procesan todos los pedidos.

---

### `app/actions/tables.ts`
**¿Qué hace?** Maneja las mesas del restaurante.

**Funciones principales:**
- `getTables()`: Obtiene todas las mesas
- `updateTableStatus()`: Actualiza el estado de una mesa
- `createTable()`: Crea una nueva mesa
- `deleteTable()`: Elimina una mesa

**Estados de mesa:**
- `available`: Disponible (verde)
- `occupied`: Ocupada (rojo)
- `reserved`: Reservada (amarillo)

**Para el alumno:** Las mesas son como "lugares" donde se sientan los clientes. Este archivo las gestiona.

---

### `app/actions/menu.ts`
**¿Qué hace?** Maneja el menú del restaurante.

**Funciones principales:**
- `getMenuItems()`: Obtiene todos los items del menú
- `getMenuItemsByCategory()`: Obtiene items por categoría
- `createMenuItem()`: Crea un nuevo item
- `updateMenuItem()`: Actualiza un item
- `deleteMenuItem()`: Elimina un item

**Para el alumno:** El menú es la "carta" del restaurante. Aquí se gestionan los platos disponibles.

---

### `app/actions/inventory.ts`
**¿Qué hace?** Maneja el inventario (ingredientes).

**Funciones principales:**
- `getInventoryItems()`: Obtiene todos los ingredientes
- `updateInventoryItem()`: Actualiza la cantidad de un ingrediente
- `checkStock()`: Verifica si hay stock suficiente
- `deductInventory()`: Descuenta inventario (se hace automáticamente)

**Para el alumno:** El inventario es como el "almacén". Aquí se guardan los ingredientes y se descuentan cuando se hacen pedidos.

---

### `app/actions/reports.ts`
**¿Qué hace?** Genera reportes de ventas.

**Funciones principales:**
- `getSalesReport(period)`: Obtiene reporte de ventas por período
- Períodos: `day`, `week`, `month`, `year`

**Para el alumno:** Los reportes muestran cuánto se ha vendido en un período de tiempo.

---

### `app/actions/users.ts`
**¿Qué hace?** Maneja los usuarios del sistema (solo admin).

**Funciones principales:**
- `getAllUsers()`: Obtiene todos los usuarios
- `createUser()`: Crea un nuevo usuario
- `updateUserPassword()`: Cambia la contraseña de un usuario
- `deleteUser()`: Elimina un usuario

**Para el alumno:** Solo los administradores pueden gestionar usuarios.

---

## 📂 Carpeta `app/api/` - API Routes

Son endpoints HTTP que puedes llamar desde el cliente o desde otros servicios.

### `app/api/orders/[id]/route.ts`
**¿Qué hace?** Endpoint para obtener un pedido por ID.

**Ruta:** `GET /api/orders/[id]`

**Para el alumno:** Es una forma alternativa de obtener datos usando HTTP en lugar de Server Actions.

---

### `app/api/reports/route.ts`
**¿Qué hace?** Endpoint para obtener reportes.

**Ruta:** `GET /api/reports`

**Para el alumno:** Similar al anterior, pero para reportes.

---

## 📂 Carpeta `components/` - Componentes React

Los componentes son "piezas" reutilizables de la interfaz de usuario.

### `components/login-form.tsx`
**¿Qué hace?** Formulario de inicio de sesión.

**Contenido:**
- Campos de usuario y contraseña
- Botón de "Iniciar Sesión"
- Manejo de errores
- Muestra usuarios de prueba

**Para el alumno:** Es la "pantalla" donde el usuario ingresa sus credenciales.

---

### `components/admin-dashboard.tsx`
**¿Qué hace?** Panel principal del administrador.

**Contenido:**
- Tabs (pestañas) para diferentes secciones:
  - Tomar Pedidos
  - Pedidos Activos
  - Inventario
  - Reportes
  - Usuarios
  - Mesas
- Estadísticas en tiempo real

**Para el alumno:** Es el "tablero de control" del administrador. Desde aquí puede hacer todo.

---

### `components/waiter-dashboard.tsx`
**¿Qué hace?** Panel principal del mesero.

**Contenido:**
- Visualización de mesas
- Formulario para crear pedidos
- Lista de pedidos activos

**Para el alumno:** Es el "tablero de control" del mesero. Desde aquí toma pedidos.

---

### `components/order-form.tsx`
**¿Qué hace?** Formulario para crear y editar pedidos.

**Contenido:**
- Selector de mesa
- Lista de items del menú
- Cantidades
- Botón para crear/actualizar pedido
- Validación de stock

**Para el alumno:** Es el "formulario" donde el mesero selecciona qué quiere el cliente.

---

### `components/table-grid.tsx`
**¿Qué hace?** Muestra las mesas en una cuadrícula visual.

**Contenido:**
- Cada mesa es un "card" con color según su estado:
  - Verde: Disponible
  - Rojo: Ocupada
  - Amarillo: Reservada
- Al hacer clic, se puede seleccionar para crear pedido

**Para el alumno:** Es la "vista" visual de las mesas del restaurante.

---

### `components/inventory-management.tsx`
**¿Qué hace?** Panel para gestionar el inventario (solo admin).

**Contenido:**
- Lista de ingredientes
- Cantidad actual
- Botón para actualizar stock
- Alertas de stock bajo

**Para el alumno:** Es la "pantalla" donde el admin ajusta las cantidades de ingredientes.

---

### `components/sales-reports.tsx`
**¿Qué hace?** Muestra reportes de ventas con gráficos.

**Contenido:**
- Selector de período (día, semana, mes, año)
- Gráficos de ventas
- Tabla con detalles
- Total en CLP

**Para el alumno:** Muestra "cuánto se ha vendido" de forma visual.

---

### `components/user-management.tsx`
**¿Qué hace?** Panel para gestionar usuarios (solo admin).

**Contenido:**
- Lista de usuarios
- Formulario para crear usuario
- Botón para cambiar contraseña
- Botón para eliminar usuario

**Para el alumno:** Es donde el admin crea y gestiona usuarios del sistema.

---

### `components/table-management.tsx`
**¿Qué hace?** Panel para gestionar mesas (solo admin).

**Contenido:**
- Lista de mesas
- Formulario para crear mesa
- Botón para eliminar mesa
- Configuración de capacidad

**Para el alumno:** Es donde el admin crea y gestiona las mesas del restaurante.

---

### `components/active-orders-list.tsx`
**¿Qué hace?** Lista de pedidos activos.

**Contenido:**
- Muestra todos los pedidos que no están pagados
- Información de mesa, items, total
- Botón para marcar como pagado (solo admin)

**Para el alumno:** Muestra todos los pedidos que están "en curso".

---

### `components/header.tsx`
**¿Qué hace?** Barra superior (header) de la aplicación.

**Contenido:**
- Logo y nombre del restaurante
- Información del usuario
- Botón de logout
- Toggle de tema (claro/oscuro)

**Para el alumno:** Es la "barra superior" que aparece en todas las páginas.

---

### `components/icons.tsx`
**¿Qué hace?** Define iconos personalizados usando Lucide React.

**Para el alumno:** Es un "catálogo" de iconos que se usan en toda la aplicación.

---

### `components/theme-provider.tsx`
**¿Qué hace?** Maneja el tema claro/oscuro de la aplicación.

**Para el alumno:** Permite cambiar entre modo claro y oscuro.

---

## 📂 Carpeta `components/ui/` - Componentes Base

Estos son componentes reutilizables de shadcn/ui. Son como "piezas de LEGO" que puedes usar en cualquier parte.

**Componentes principales:**
- `button.tsx`: Botones
- `input.tsx`: Campos de texto
- `card.tsx`: Tarjetas/contenedores
- `dialog.tsx`: Ventanas modales
- `toast.tsx`: Notificaciones
- `tabs.tsx`: Pestañas
- `select.tsx`: Selectores desplegables
- `badge.tsx`: Etiquetas/chips
- `label.tsx`: Etiquetas de formulario
- `scroll-area.tsx`: Áreas con scroll
- `separator.tsx`: Separadores visuales
- `alert-dialog.tsx`: Diálogos de confirmación

**Para el alumno:** Estos son componentes "base" que se usan para construir las pantallas más complejas. No necesitas modificarlos, solo usarlos.

---

## 📂 Carpeta `lib/` - Utilidades y Configuraciones

### `lib/supabase/server.ts`
**¿Qué hace?** Crea un cliente de Supabase para usar en el servidor.

**Para el alumno:** Es la "conexión" a la base de datos cuando el código se ejecuta en el servidor.

---

### `lib/supabase/client.ts`
**¿Qué hace?** Crea un cliente de Supabase para usar en el navegador.

**Para el alumno:** Es la "conexión" a la base de datos cuando el código se ejecuta en el navegador.

---

### `lib/supabase/admin.ts`
**¿Qué hace?** Crea un cliente de Supabase con permisos de administrador.

**Para el alumno:** Este cliente puede hacer TODO, incluso saltarse las reglas de seguridad. Solo se usa en operaciones especiales.

---

### `lib/supabase/middleware.ts`
**¿Qué hace?** Middleware para manejar sesiones de Supabase.

**Para el alumno:** Se ejecuta en cada petición para verificar y actualizar la sesión del usuario.

---

### `lib/auth.ts`
**¿Qué hace?** Funciones auxiliares para autenticación (legacy, puede no usarse).

**Para el alumno:** Código antiguo de autenticación. La autenticación real está en `app/actions/auth.ts`.

---

### `lib/utils.ts`
**¿Qué hace?** Funciones de utilidad general.

**Contenido:**
- `cn()`: Función para combinar clases de CSS
- Otras utilidades

**Para el alumno:** Funciones "helper" que se usan en varios lugares.

---

### `lib/cva.ts`
**¿Qué hace?** Configuración de class-variance-authority (para variantes de componentes).

**Para el alumno:** Herramienta para crear componentes con diferentes "estilos" (variantes).

---

### `lib/db.ts`
**¿Qué hace?** Código legacy de base de datos en memoria (ya no se usa).

**Para el alumno:** Código antiguo. Ahora usamos Supabase en su lugar.

---

## 📂 Carpeta `scripts/` - Scripts SQL

Estos archivos SQL se ejecutan en Supabase para crear la base de datos.

### `scripts/001_create_tables.sql`
**¿Qué hace?** Crea todas las tablas de la base de datos.

**Tablas creadas:**
- `users`: Usuarios del sistema
- `tables`: Mesas del restaurante
- `menu_items`: Items del menú
- `inventory_items`: Ingredientes
- `orders`: Pedidos
- `order_items`: Items de cada pedido
- `menu_item_ingredients`: Relación entre platos e ingredientes

**Para el alumno:** Este script "construye" la estructura de la base de datos.

---

### `scripts/002_seed_data.sql`
**¿Qué hace?** Inserta datos iniciales (usuarios, mesas, menú, inventario).

**Para el alumno:** Este script "llena" la base de datos con datos de ejemplo.

---

### `scripts/003_link_menu_to_inventory.sql`
**¿Qué hace?** Vincula los platos del menú con los ingredientes necesarios.

**Para el alumno:** Define qué ingredientes necesita cada plato.

---

### `scripts/004_update_passwords.sql` hasta `scripts/012_add_password_hash_function.sql`
**¿Qué hace?** Scripts adicionales para:
- Actualizar contraseñas
- Crear funciones SQL
- Agregar políticas de seguridad
- Etc.

**Para el alumno:** Scripts de mantenimiento y configuración avanzada.

---

### `scripts/ALL_SCRIPTS_COMBINED.sql`
**¿Qué hace?** Todos los scripts combinados en un solo archivo.

**Para el alumno:** Útil si quieres ejecutar todos los scripts de una vez.

---

### `scripts/fix_login.sql`
**¿Qué hace?** Script para corregir problemas de login.

**Para el alumno:** Si el login no funciona, ejecuta este script.

---

### Scripts TypeScript (`*.ts`)
**¿Qué hacen?** Scripts de Node.js para:
- Verificar conexión a Supabase
- Ejecutar scripts SQL automáticamente
- Probar funcionalidades

**Para el alumno:** Herramientas de desarrollo y testing.

---

## 📂 Carpeta `__tests__/` - Pruebas

Archivos de prueba que validan que todo funcione correctamente.

**Archivos:**
- `auth.test.ts`: Pruebas de autenticación
- `orders.test.ts`: Pruebas de pedidos
- `inventory.test.ts`: Pruebas de inventario
- `tables.test.ts`: Pruebas de mesas
- `reports.test.ts`: Pruebas de reportes
- `database.test.ts`: Pruebas de base de datos
- `integration.test.ts`: Pruebas de integración

**Para el alumno:** Estos archivos verifican que el código funcione bien. Ejecuta `npm test` para correrlas.

---

## 📂 Carpeta `docs/` - Documentación

Documentación del proyecto.

**Archivos:**
- `GUIA_INSTALACION_LOCAL.md`: Cómo instalar el proyecto
- `GUIA_VARIABLES_SUPABASE.md`: Cómo configurar Supabase
- `GUIA_DEBUGGING_Y_ANALISIS.md`: Cómo debuguear problemas
- `DOCUMENTACION_ARCHIVOS.md`: Este archivo
- `PLAN_DE_PRUEBAS.md`: Plan de testing
- `INFORME_CIERRE_PROYECTO.md`: Informe del proyecto

---

## 📂 Carpeta `public/` - Archivos Estáticos

Imágenes y archivos que se sirven directamente.

**Contenido:**
- `icon.svg`: Icono de la aplicación
- `placeholder-*.png/jpg/svg`: Imágenes de ejemplo

**Para el alumno:** Aquí pones imágenes que quieres mostrar directamente (logos, fotos, etc.).

---

## 📂 Carpeta `hooks/` - Custom Hooks

### `hooks/use-toast.ts`
**¿Qué hace?** Hook personalizado para mostrar notificaciones (toasts).

**Para el alumno:** Un "hook" es una función especial de React que puedes usar en componentes.

---

## 🔄 Flujo de Datos en la Aplicación

### 1. Usuario hace una acción (ej: crear pedido)
```
Componente (cliente) 
  ↓
Server Action (servidor)
  ↓
Supabase (base de datos)
  ↓
Respuesta
  ↓
Componente actualiza
```

### 2. Autenticación
```
Usuario ingresa credenciales
  ↓
login() en app/actions/auth.ts
  ↓
Verifica en base de datos
  ↓
Crea cookie de sesión
  ↓
Redirige según rol
```

### 3. Crear Pedido
```
Usuario selecciona mesa e items
  ↓
createOrder() en app/actions/orders.ts
  ↓
Valida stock
  ↓
Crea pedido en BD
  ↓
Descuenta inventario
  ↓
Actualiza estado de mesa
```

---

## 🎓 Conceptos Importantes para el Alumno

### Server Actions
Son funciones que se ejecutan en el servidor. Se definen con `"use server"` al inicio.

**Ejemplo:**
```typescript
"use server"

export async function createOrder(data) {
  // Este código se ejecuta en el servidor
  // Puede acceder a la base de datos directamente
}
```

### Componentes React
Son funciones que retornan JSX (HTML con JavaScript).

**Ejemplo:**
```typescript
export function Button() {
  return <button>Click me</button>
}
```

### TypeScript
JavaScript con tipos. Ayuda a encontrar errores.

**Ejemplo:**
```typescript
function sum(a: number, b: number): number {
  return a + b
}
```

### Supabase
Base de datos PostgreSQL en la nube. Se accede mediante clientes.

**Ejemplo:**
```typescript
const supabase = createClient()
const { data } = await supabase.from('users').select('*')
```

---

## 📝 Notas Finales

- **No modifiques** los archivos en `components/ui/` a menos que sepas lo que haces
- **Siempre** verifica que las variables de entorno estén configuradas
- **Ejecuta** `npm test` antes de hacer cambios grandes
- **Consulta** la documentación en `docs/` si tienes dudas

---

## 🆘 ¿Dónde Buscar Ayuda?

1. **Documentación de Next.js**: https://nextjs.org/docs
2. **Documentación de React**: https://react.dev
3. **Documentación de Supabase**: https://supabase.com/docs
4. **Guías del proyecto**: Carpeta `docs/`

---

**¡Éxito con el proyecto! 🚀**

