/**
 * Script para verificar si la base de datos ya está configurada
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

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Error: Variables de Supabase no encontradas en .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const tablesToCheck = [
  "users",
  "tables",
  "menu_items",
  "inventory_items",
  "orders",
  "order_items",
  "menu_item_ingredients",
]

async function verifyDatabase() {
  console.log("🔍 Verificando estado de la base de datos...")
  console.log(`📍 URL: ${SUPABASE_URL}\n`)
  console.log("─".repeat(60))

  let allTablesExist = true
  const results: Record<string, { exists: boolean; count?: number; error?: string }> = {}

  for (const tableName of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true })

      if (error) {
        results[tableName] = { exists: false, error: error.message }
        allTablesExist = false
        console.log(`❌ ${tableName}: No existe o error - ${error.message}`)
      } else {
        results[tableName] = { exists: true, count: count || 0 }
        console.log(`✅ ${tableName}: Existe (${count || 0} registros)`)
      }
    } catch (error: any) {
      results[tableName] = { exists: false, error: error.message }
      allTablesExist = false
      console.log(`❌ ${tableName}: Error - ${error.message}`)
    }
  }

  console.log("\n" + "─".repeat(60))

  // Verificar datos específicos
  console.log("\n📊 Verificando datos iniciales...\n")

  // Verificar usuarios
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("username, role")
      .limit(5)

    if (!error && users && users.length > 0) {
      console.log("✅ Usuarios encontrados:")
      users.forEach((user) => {
        console.log(`   - ${user.username} (${user.role})`)
      })
    } else {
      console.log("⚠️  No se encontraron usuarios")
    }
  } catch (error: any) {
    console.log("⚠️  Error verificando usuarios:", error.message)
  }

  // Verificar mesas
  try {
    const { data: tables, error } = await supabase
      .from("tables")
      .select("table_number, status")
      .limit(5)

    if (!error && tables && tables.length > 0) {
      console.log(`\n✅ Mesas encontradas: ${tables.length} (mostrando primeras 5)`)
      tables.forEach((table) => {
        console.log(`   - Mesa ${table.table_number}: ${table.status}`)
      })
    } else {
      console.log("\n⚠️  No se encontraron mesas")
    }
  } catch (error: any) {
    console.log("\n⚠️  Error verificando mesas:", error.message)
  }

  // Verificar items del menú
  try {
    const { data: menuItems, error } = await supabase
      .from("menu_items")
      .select("name, category")
      .limit(5)

    if (!error && menuItems && menuItems.length > 0) {
      console.log(`\n✅ Items del menú encontrados: ${menuItems.length} (mostrando primeros 5)`)
      menuItems.forEach((item) => {
        console.log(`   - ${item.name} (${item.category})`)
      })
    } else {
      console.log("\n⚠️  No se encontraron items del menú")
    }
  } catch (error: any) {
    console.log("\n⚠️  Error verificando menú:", error.message)
  }

  console.log("\n" + "─".repeat(60))
  
  if (allTablesExist) {
    console.log("\n✅ ¡Base de datos configurada correctamente!")
    console.log("   Todas las tablas existen y están accesibles.")
  } else {
    console.log("\n⚠️  Algunas tablas faltan o hay errores.")
    console.log("   Ejecuta los scripts SQL en Supabase SQL Editor si es necesario.")
  }

  return { allTablesExist, results }
}

// Ejecutar
verifyDatabase().catch((error) => {
  console.error("\n❌ Error fatal:", error)
  process.exit(1)
})

