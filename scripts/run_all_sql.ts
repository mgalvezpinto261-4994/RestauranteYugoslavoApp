/**
 * Script para ejecutar todos los scripts SQL en Supabase
 * Requiere SUPABASE_POSTGRES_URL en .env.local (conexión directa a PostgreSQL)
 * O puedes proporcionar la URL cuando se ejecute el script
 */

import { readFileSync } from "fs"
import { join } from "path"
import { Client } from "pg"

// Leer variables de entorno desde .env.local manualmente
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
const POSTGRES_URL = env.SUPABASE_POSTGRES_URL

if (!POSTGRES_URL) {
  console.error("❌ Error: SUPABASE_POSTGRES_URL no encontrada en .env.local")
  console.error("")
  console.error("Para obtener la URL de conexión directa:")
  console.error("1. Ve a Supabase Dashboard → Settings → Database")
  console.error("2. Busca 'Connection string' → 'URI'")
  console.error("3. Copia la URL que se ve así:")
  console.error("   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres")
  console.error("4. Reemplaza [PASSWORD] con tu contraseña de base de datos")
  console.error("5. Agrega esta línea a .env.local:")
  console.error("   SUPABASE_POSTGRES_URL=postgresql://postgres:TU_PASSWORD@db.xxxxx.supabase.co:5432/postgres")
  console.error("")
  console.error("Alternativamente, puedes ejecutar los scripts manualmente en Supabase SQL Editor")
  process.exit(1)
}

const scripts = [
  "001_create_tables.sql",
  "002_seed_data.sql",
  "003_link_menu_to_inventory.sql",
  "004_update_passwords.sql",
  "005_fix_users.sql",
  "006_create_verify_password_function.sql",
  "007_add_beverages_and_chilean_ingredients.sql",
  "008_update_prices_clp.sql",
  "009_link_beverages_to_inventory.sql",
  "010_add_capacity_to_tables.sql",
  "011_add_insert_policy_to_tables.sql",
  "012_add_password_hash_function.sql",
]

async function executeSQL(client: Client, sql: string, scriptName: string): Promise<void> {
  console.log(`\n📄 Ejecutando: ${scriptName}...`)
  
  try {
    // Ejecutar el SQL completo
    await client.query(sql)
    console.log(`   ✅ ${scriptName} completado`)
  } catch (error: any) {
    // Algunos errores son esperados (como "already exists"), así que los manejamos
    if (error.message.includes("already exists") || error.message.includes("duplicate")) {
      console.log(`   ⚠️  ${scriptName}: Algunos elementos ya existen (esto es normal)`)
    } else {
      console.error(`   ❌ Error en ${scriptName}:`, error.message)
      throw error
    }
  }
}

async function runAllScripts() {
  console.log("🚀 Iniciando ejecución de scripts SQL...")
  console.log(`📍 Conectando a PostgreSQL...`)
  console.log("─".repeat(60))

  const client = new Client({
    connectionString: POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    await client.connect()
    console.log("✅ Conectado a la base de datos\n")

    const scriptsDir = join(process.cwd(), "scripts")

    for (const scriptName of scripts) {
      try {
        const scriptPath = join(scriptsDir, scriptName)
        const sql = readFileSync(scriptPath, "utf-8")
        await executeSQL(client, sql, scriptName)
        // Pequeña pausa entre scripts
        await new Promise((resolve) => setTimeout(resolve, 300))
      } catch (error: any) {
        console.error(`❌ Error procesando ${scriptName}:`, error.message)
        // Continuar con el siguiente script
      }
    }

    console.log("\n" + "─".repeat(60))
    console.log("✅ Todos los scripts se ejecutaron!")
  } catch (error: any) {
    console.error("❌ Error de conexión:", error.message)
    console.error("\n💡 Verifica que:")
    console.error("   1. La URL de conexión en .env.local sea correcta")
    console.error("   2. La contraseña de la base de datos sea correcta")
    console.error("   3. Tu IP esté permitida en Supabase (Settings → Database → Connection Pooling)")
    throw error
  } finally {
    await client.end()
    console.log("🔌 Desconectado de la base de datos")
  }
}

// Ejecutar
runAllScripts().catch((error) => {
  console.error("\n❌ Error fatal:", error)
  process.exit(1)
})

