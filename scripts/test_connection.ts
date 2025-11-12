/**
 * Script para probar la conexión a Supabase
 */

import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join } from "path"

function loadEnv() {
  try {
    const envContent = readFileSync(join(process.cwd(), ".env.local"), "utf-8")
    const env: Record<string, string> = {}
    
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...values] = trimmed.split("=")
        if (key && values.length > 0) {
          env[key.trim()] = values.join("=").trim()
        }
      }
    })
    
    return env
  } catch (error) {
    console.error("❌ Error leyendo .env.local:", error)
    process.exit(1)
  }
}

const env = loadEnv()
const SUPABASE_URL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("🔍 Verificando conexión a Supabase...\n")
console.log("─".repeat(60))
console.log(`📍 URL: ${SUPABASE_URL}`)
console.log(`🔑 Anon Key: ${SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 20) + "..." : "NO ENCONTRADA"}`)
console.log("─".repeat(60))
console.log("")

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Error: Variables de Supabase no encontradas en .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  console.log("1️⃣ Probando conexión básica...")
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    
    if (error) {
      console.error(`   ❌ Error de conexión: ${error.message}`)
      console.error(`   Código: ${error.code || "N/A"}`)
      console.error(`   Detalles: ${error.details || "N/A"}`)
      return false
    }
    
    console.log("   ✅ Conexión exitosa a Supabase")
    return true
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function testUsersTable() {
  console.log("\n2️⃣ Verificando tabla 'users'...")
  try {
    const { data, error, count } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .limit(5)

    if (error) {
      console.error(`   ❌ Error: ${error.message}`)
      return false
    }

    console.log(`   ✅ Tabla 'users' accesible`)
    console.log(`   📊 Usuarios encontrados: ${count || 0}`)
    
    if (data && data.length > 0) {
      console.log("\n   Usuarios en la base de datos:")
      data.forEach((user: any) => {
        console.log(`   - ${user.username} (${user.role})`)
      })
    } else {
      console.log("   ⚠️  No hay usuarios en la base de datos")
    }
    
    return true
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function testVerifyPasswordFunction() {
  console.log("\n3️⃣ Verificando función 'verify_password'...")
  try {
    const { data, error } = await supabase.rpc("verify_password", {
      username_input: "admin",
      password_input: "admin123",
    })

    if (error) {
      console.error(`   ❌ Error: ${error.message}`)
      console.error(`   💡 La función verify_password no existe o no está accesible`)
      console.error(`   💡 Ejecuta el script fix_login.sql en Supabase SQL Editor`)
      return false
    }

    console.log(`   ✅ Función 'verify_password' funciona`)
    console.log(`   📊 Resultado: ${data ? "Contraseña correcta" : "Contraseña incorrecta"}`)
    return true
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.log("\n❌ No se pudo conectar a Supabase. Verifica:")
    console.log("   1. Que la URL sea correcta")
    console.log("   2. Que la anon key sea correcta")
    console.log("   3. Que tu proyecto de Supabase esté activo")
    process.exit(1)
  }

  await testUsersTable()
  await testVerifyPasswordFunction()

  console.log("\n" + "─".repeat(60))
  console.log("✅ Pruebas completadas")
}

runTests().catch((error) => {
  console.error("\n❌ Error fatal:", error)
  process.exit(1)
})

