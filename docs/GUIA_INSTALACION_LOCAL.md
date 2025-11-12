# 🚀 Guía de Instalación Local - Sistema de Gestión de Restaurante

Esta guía te llevará paso a paso por el proceso de instalación y configuración del proyecto en tu máquina local.

---

## 📋 Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Instalación del Proyecto](#instalación-del-proyecto)
3. [Configuración de Base de Datos (Supabase)](#configuración-de-base-de-datos)
4. [Variables de Entorno](#variables-de-entorno)
5. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
6. [Verificar Instalación](#verificar-instalación)
7. [Solución de Problemas](#solución-de-problemas)

---

## 1️⃣ Prerequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:

### Node.js y npm
- **Node.js**: versión 18.x o superior
- **npm**: versión 9.x o superior (viene incluido con Node.js)

**Verificar instalación:**
\`\`\`bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 9.x.x o superior
\`\`\`

**¿No tienes Node.js?** Descárgalo desde [nodejs.org](https://nodejs.org/)

### Git
- **Git**: versión 2.x o superior

**Verificar instalación:**
\`\`\`bash
git --version  # Debe mostrar git version 2.x.x
\`\`\`

**¿No tienes Git?** Descárgalo desde [git-scm.com](https://git-scm.com/)

### Editor de Código (Recomendado)
- **Visual Studio Code**: [Descargar VS Code](https://code.visualstudio.com/)

---

## 2️⃣ Instalación del Proyecto

### Paso 1: Obtener el Proyecto

Abre tu terminal y navega a la carpeta del proyecto:

\`\`\`bash
# Si descargaste el proyecto, descomprímelo y navega a la carpeta
cd sistema-gestion-restaurante
\`\`\`

### Paso 2: Instalar Dependencias

Una vez dentro de la carpeta del proyecto, instala todas las dependencias:

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

**Nota:** Se usa `--legacy-peer-deps` para resolver conflictos de versiones entre React 19 y algunas dependencias que requieren versiones anteriores.

Este proceso puede tomar 2-5 minutos dependiendo de tu conexión a internet.

**Resultado esperado:**
\`\`\`
added 572 packages, and audited 573 packages
found 0 vulnerabilities
\`\`\`

---

## 3️⃣ Configuración de Base de Datos

El proyecto utiliza **Supabase** como base de datos PostgreSQL. Sigue estos pasos:

### Paso 1: Crear Cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com/)
2. Haz clic en "Start your project" (Iniciar tu proyecto)
3. Crea una cuenta gratuita (puedes usar Google o email)

### Paso 2: Crear un Nuevo Proyecto

1. Una vez dentro del dashboard, haz clic en "New Project"
2. Llena los campos:
   - **Name**: `restaurant-app` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura y **guárdala**
   - **Region**: Selecciona la región más cercana a ti
3. Haz clic en "Create new project"
4. Espera 1-2 minutos mientras Supabase configura tu base de datos

### Paso 3: Obtener Credenciales de Supabase

1. En el dashboard de tu proyecto, ve a **Settings** (⚙️ en la barra lateral)
2. Haz clic en **API** en el menú lateral
3. Encontrarás dos valores importantes:

   - **Project URL**: `https://tuproyecto.supabase.co`
   - **anon public key**: Una llave larga que empieza con `eyJ...`

4. **Copia estos valores** - los necesitarás en el siguiente paso

### Paso 4: Ejecutar Scripts de Base de Datos

Ahora debes crear las tablas y datos iniciales en tu base de datos:

1. En Supabase, ve a **SQL Editor** (icono </> en la barra lateral)
2. Ejecuta los siguientes scripts **EN ORDEN**, uno por uno:

#### Script 1: Crear Tablas Principales
\`\`\`sql
# Copia y pega el contenido de: scripts/001_create_tables.sql
\`\`\`
Haz clic en **RUN** ▶️

#### Script 2: Insertar Datos Iniciales
\`\`\`sql
# Copia y pega el contenido de: scripts/002_seed_data.sql
\`\`\`
Haz clic en **RUN** ▶️

#### Script 3: Vincular Menú con Inventario
\`\`\`sql
# Copia y pega el contenido de: scripts/003_link_menu_to_inventory.sql
\`\`\`
Haz clic en **RUN** ▶️

#### Scripts Adicionales (ejecuta todos en orden):
- `004_update_passwords.sql`
- `005_fix_users.sql`
- `006_create_verify_password_function.sql`
- `007_add_beverages_and_chilean_ingredients.sql`
- `008_update_prices_clp.sql`
- `009_link_beverages_to_inventory.sql`
- `010_add_capacity_to_tables.sql`
- `011_add_insert_policy_to_tables.sql`
- `012_add_password_hash_function.sql`

**Verificar:** Después de ejecutar todos los scripts, ve a **Table Editor** y deberías ver tablas como `users`, `tables`, `orders`, `menu_items`, etc.

---

## 4️⃣ Variables de Entorno

### Paso 1: Crear Archivo .env.local

En la raíz del proyecto (donde está el archivo `package.json`), crea un archivo llamado `.env.local`:

\`\`\`bash
# En Windows (PowerShell)
New-Item .env.local

# En Mac/Linux
touch .env.local
\`\`\`

### Paso 2: Agregar Variables de Entorno

Abre el archivo `.env.local` con tu editor de código y agrega:

\`\`\`bash
# Supabase Configuration
SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Postgres (opcional, para conexiones directas)
SUPABASE_POSTGRES_URL=postgresql://postgres:[PASSWORD]@db.tuproyecto.supabase.co:5432/postgres
\`\`\`

**⚠️ IMPORTANTE:** Reemplaza los valores de ejemplo con tus credenciales reales de Supabase.

### Paso 3: Obtener Service Role Key

1. Ve a Supabase Dashboard → **Settings** → **API**
2. Busca **service_role key** (en la sección "Project API keys")
3. Haz clic en el ícono del ojo 👁️ para revelar la clave
4. Cópiala y pégala en `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ SEGURIDAD:** Nunca compartas ni subas el archivo `.env.local` a repositorios públicos (ya está en `.gitignore`)

---

## 5️⃣ Ejecutar el Proyecto

### Modo Desarrollo

Ejecuta el proyecto en modo desarrollo:

\`\`\`bash
npm run dev
\`\`\`

**Resultado esperado:**
\`\`\`
  ▲ Next.js 15.5.6
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

 ✓ Starting...
 ✓ Ready in 2.3s
\`\`\`

### Abrir en el Navegador

1. Abre tu navegador (Chrome, Firefox, Edge, etc.)
2. Ve a: **http://localhost:3000**
3. Deberías ver la página de login del sistema

---

## 6️⃣ Verificar Instalación

### Paso 1: Probar Login

Credenciales de prueba por defecto:

**Usuario Admin:**
- **Usuario**: `admin`
- **Contraseña**: `admin123`

**Usuario Mesero:**
- **Usuario**: `mesero`
- **Contraseña**: `mesero123`

### Paso 2: Verificar Funcionalidades

Después de iniciar sesión como admin, verifica que funcionan:

✅ Ver mesas disponibles  
✅ Crear un pedido  
✅ Ver inventario  
✅ Ver reportes  
✅ Gestionar usuarios  
✅ Agregar mesas  

### Paso 3: Verificar Base de Datos

1. Ve a Supabase → **Table Editor**
2. Abre la tabla `orders`
3. Deberías ver el pedido que acabas de crear

---

## 7️⃣ Solución de Problemas

### ❌ Error: "Cannot find module 'next'"

**Causa:** Las dependencias no se instalaron correctamente.

**Solución:**
\`\`\`bash
rm -rf node_modules
rm package-lock.json
npm install --legacy-peer-deps
\`\`\`

### ❌ Error: "SUPABASE_URL is not defined"

**Causa:** El archivo `.env.local` no existe o las variables están mal escritas.

**Solución:**
1. Verifica que el archivo `.env.local` esté en la raíz del proyecto
2. Verifica que las variables NO tengan espacios: `SUPABASE_URL=https://...` (sin espacios)
3. Reinicia el servidor: Ctrl+C y luego `npm run dev`

### ❌ Error: "Could not find the 'X' column"

**Causa:** Falta ejecutar algún script de migración de base de datos.

**Solución:**
1. Ve a Supabase → **SQL Editor**
2. Ejecuta todos los scripts en orden (del 001 al 012)
3. Verifica que cada script se ejecute sin errores

### ❌ Error: "Port 3000 is already in use"

**Causa:** Ya hay otro proceso usando el puerto 3000.

**Solución:**

**Opción 1 - Cambiar puerto:**
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

**Opción 2 - Matar proceso en puerto 3000:**
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [número] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
\`\`\`

### ❌ Página en blanco o error 500

**Causa:** Error en el código o configuración incorrecta.

**Solución:**
1. Abre la consola del navegador (F12) y busca errores
2. Revisa la terminal donde corre `npm run dev` para ver errores del servidor
3. Verifica que todas las variables de entorno estén correctas

### ❌ "Authentication failed" al hacer login

**Causa:** Las contraseñas en la base de datos no están hasheadas correctamente.

**Solución:**
1. Ve a Supabase → **SQL Editor**
2. Ejecuta el script `004_update_passwords.sql` de nuevo
3. Verifica que el script `012_add_password_hash_function.sql` se haya ejecutado

---

## 📚 Recursos Adicionales

### Documentación del Proyecto
- [Guía de Debugging](./GUIA_DEBUGGING_Y_ANALISIS.md)
- [Plan de Pruebas](./PLAN_DE_PRUEBAS.md)
- [Informe de Cierre](./INFORME_CIERRE_PROYECTO.md)

### Documentación Externa
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## 🆘 ¿Necesitas Ayuda?

Si encuentras algún problema que no está cubierto en esta guía:

1. **Revisa los logs**: Lee cuidadosamente los mensajes de error
2. **Consulta la documentación**: Busca en las guías mencionadas arriba
3. **Verifica la configuración**: Asegúrate de que todos los pasos se completaron correctamente

---

## ✅ Checklist de Instalación

Usa esta lista para verificar que completaste todos los pasos:

- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Proyecto clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Cuenta de Supabase creada
- [ ] Proyecto de Supabase creado
- [ ] Todos los scripts SQL ejecutados (001-012)
- [ ] Archivo `.env.local` creado
- [ ] Variables de entorno configuradas
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Login exitoso con credenciales de prueba
- [ ] Funcionalidades básicas verificadas

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu proyecto debería estar corriendo correctamente en `http://localhost:3000`.

**¡Felicitaciones! 🚀 Ahora puedes comenzar a desarrollar y probar el sistema.**
