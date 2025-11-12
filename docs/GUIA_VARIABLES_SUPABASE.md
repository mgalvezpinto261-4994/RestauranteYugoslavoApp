# 🔑 Guía Completa: Variables de Supabase

Esta guía te muestra exactamente qué variables necesitas de Supabase y dónde encontrarlas.

---

## 📋 Variables Necesarias

El proyecto necesita las siguientes variables de entorno en el archivo `.env.local`:

1. **SUPABASE_URL** - URL del proyecto
2. **NEXT_PUBLIC_SUPABASE_URL** - URL del proyecto (para cliente)
3. **SUPABASE_ANON_KEY** - Clave pública anónima
4. **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Clave pública anónima (para cliente)
5. **SUPABASE_SERVICE_ROLE_KEY** - Clave de servicio (opcional, para operaciones admin)
6. **SUPABASE_POSTGRES_URL** - URL de conexión directa a PostgreSQL (opcional)

---

## 🗺️ Dónde Encontrar Cada Variable

### 1️⃣ Project URL (SUPABASE_URL)

**Ubicación:** Settings → Data API

**Pasos:**
1. Ve a Supabase Dashboard
2. Haz clic en **Settings** (⚙️) en el sidebar izquierdo
3. Haz clic en **Data API** (bajo "PROJECT SETTINGS")
4. Busca la sección **"Project URL"**
5. Copia la URL completa (ejemplo: `https://ivwgwbgjusztvrtefeyl.supabase.co`)

**Cómo se ve:**
```
Project URL
URL: https://tu-proyecto-id.supabase.co
[Botón Copy]
```

**En .env.local:**
```bash
SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
```

---

### 2️⃣ Anon Public Key (SUPABASE_ANON_KEY)

**Ubicación:** Settings → API Keys

**Pasos:**
1. Ve a Supabase Dashboard
2. Haz clic en **Settings** (⚙️) en el sidebar izquierdo
3. Haz clic en **API Keys** (bajo "PROJECT SETTINGS")
4. Busca la sección **"Project API keys"**
5. Encuentra **"anon public"** key
6. Copia la clave completa (es una cadena larga que empieza con `eyJ...`)

**Cómo se ve:**
```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d2d3YmdqdXN6dHZydGVmZXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDMxNTcsImV4cCI6MjA3Nzg3OTE1N30.LZbCfHb__LTjr9XHn8-tSBPsle3JFxK0sIt2djzlLHY
[Botón Copy]
```

**En .env.local:**
```bash
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Nota:** Esta clave es segura para usar en el navegador si tienes Row Level Security (RLS) habilitado.

---

### 3️⃣ Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

**Ubicación:** Settings → API Keys

**Pasos:**
1. Ve a Supabase Dashboard
2. Haz clic en **Settings** (⚙️) en el sidebar izquierdo
3. Haz clic en **API Keys** (bajo "PROJECT SETTINGS")
4. Busca la sección **"Project API keys"**
5. Encuentra **"service_role"** key (tiene un tag rojo "secret")
6. Haz clic en el botón **"Reveal"** (👁️) para mostrar la clave
7. Copia la clave completa

**Cómo se ve:**
```
Project API keys

service_role [tag: secret]
**** **** **** ****
[Botón Reveal] 👁️
```

**Después de hacer clic en Reveal:**
```
service_role [tag: secret]
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d2d3YmdqdXN6dHZydGVmZXlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMwMzE1NywiZXhwIjoyMDc3ODc5MTU3fQ.mb9LNj8LdtCwreSuB2C3wqReJOZdRI6yMRqgXt9457U
[Botón Copy]
```

**En .env.local:**
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE:** 
- Esta clave puede bypassear Row Level Security
- **NUNCA** la compartas públicamente
- **NUNCA** la subas a repositorios públicos
- Solo úsala en el servidor (no en el cliente)

---

### 4️⃣ PostgreSQL Connection String (SUPABASE_POSTGRES_URL) - Opcional

**Ubicación:** Settings → Database

**Pasos:**
1. Ve a Supabase Dashboard
2. Haz clic en **Settings** (⚙️) en el sidebar izquierdo
3. Haz clic en **Database** (bajo "CONFIGURATION")
4. Busca la sección **"Connection string"**
5. Selecciona la pestaña **"URI"** (no "Connection Pooling")
6. Copia la URL (formato: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
7. Reemplaza `[PASSWORD]` con tu contraseña de base de datos

**Cómo se ve:**
```
Connection string

URI | Connection Pooling | Session

postgresql://postgres:[PASSWORD]@db.tu-proyecto-id.supabase.co:5432/postgres
[Botón Copy]
```

**En .env.local:**
```bash
SUPABASE_POSTGRES_URL=postgresql://postgres:TU_PASSWORD@db.tu-proyecto-id.supabase.co:5432/postgres
```

**⚠️ Nota:** 
- Necesitas la contraseña que configuraste al crear el proyecto
- Si no la recuerdas, puedes resetearla en Settings → Database → Database Password

---

## 📝 Archivo .env.local Completo

Tu archivo `.env.local` debería verse así:

```bash
# Supabase Configuration
SUPABASE_URL=https://ivwgwbgjusztvrtefeyl.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://ivwgwbgjusztvrtefeyl.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d2d3YmdqdXN6dHZydGVmZXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDMxNTcsImV4cCI6MjA3Nzg3OTE1N30.LZbCfHb__LTjr9XHn8-tSBPsle3JFxK0sIt2djzlLHY
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d2d3YmdqdXN6dHZydGVmZXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMDMxNTcsImV4cCI6MjA3Nzg3OTE1N30.LZbCfHb__LTjr9XHn8-tSBPsle3JFxK0sIt2djzlLHY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d2d3YmdqdXN6dHZydGVmZXlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMwMzE1NywiZXhwIjoyMDc3ODc5MTU3fQ.mb9LNj8LdtCwreSuB2C3wqReJOZdRI6yMRqgXt9457U

# Supabase Postgres (opcional, para conexiones directas)
# SUPABASE_POSTGRES_URL=postgresql://postgres:TU_PASSWORD@db.ivwgwbgjusztvrtefeyl.supabase.co:5432/postgres
```

---

## ✅ Checklist de Verificación

Usa esta lista para verificar que tienes todo:

- [ ] **SUPABASE_URL** - Copiada de Settings → Data API → Project URL
- [ ] **NEXT_PUBLIC_SUPABASE_URL** - Misma que SUPABASE_URL
- [ ] **SUPABASE_ANON_KEY** - Copiada de Settings → API Keys → anon public
- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Misma que SUPABASE_ANON_KEY
- [ ] **SUPABASE_SERVICE_ROLE_KEY** - Copiada de Settings → API Keys → service_role (después de hacer clic en Reveal)
- [ ] **SUPABASE_POSTGRES_URL** - (Opcional) Copiada de Settings → Database → Connection string → URI

---

## 🔍 Cómo Verificar que las Variables Están Correctas

### Verificar desde el código:

```bash
# Ejecuta este script para probar la conexión
npx tsx scripts/test_connection.ts
```

### Verificar manualmente:

1. Abre http://localhost:3000/login
2. Intenta iniciar sesión con `admin` / `admin123`
3. Si funciona, las variables están correctas ✅
4. Si no funciona, revisa los logs del servidor para ver errores

---

## 🆘 Problemas Comunes

### ❌ Error: "SUPABASE_URL is not defined"

**Causa:** El archivo `.env.local` no existe o las variables están mal escritas.

**Solución:**
1. Verifica que el archivo `.env.local` esté en la raíz del proyecto
2. Verifica que las variables NO tengan espacios: `SUPABASE_URL=https://...` (sin espacios)
3. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### ❌ Error: "requested path is invalid"

**Causa:** Intentaste acceder directamente a la URL de Supabase en el navegador.

**Solución:** 
- No accedas a `https://tu-proyecto.supabase.co` directamente
- Usa http://localhost:3000 para acceder a la aplicación

### ❌ Error: "TypeError: fetch failed"

**Causa:** La URL de Supabase es incorrecta o el proyecto está pausado.

**Solución:**
1. Verifica que la URL en `.env.local` sea correcta
2. Verifica que el proyecto de Supabase esté activo (no pausado)
3. Verifica que el Project ID sea correcto (puedes decodificarlo desde la anon key)

---

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Instalación Local](./GUIA_INSTALACION_LOCAL.md)
- [Guía de Debugging](./GUIA_DEBUGGING_Y_ANALISIS.md)

---

## 🎯 Resumen Rápido

| Variable | Dónde Encontrarla | Requerida |
|----------|-------------------|-----------|
| SUPABASE_URL | Settings → Data API → Project URL | ✅ Sí |
| SUPABASE_ANON_KEY | Settings → API Keys → anon public | ✅ Sí |
| SUPABASE_SERVICE_ROLE_KEY | Settings → API Keys → service_role (Reveal) | ⚠️ Opcional |
| SUPABASE_POSTGRES_URL | Settings → Database → Connection string → URI | ⚠️ Opcional |

---

**¡Listo!** Con esta guía deberías poder encontrar todas las variables necesarias de Supabase. 🚀

