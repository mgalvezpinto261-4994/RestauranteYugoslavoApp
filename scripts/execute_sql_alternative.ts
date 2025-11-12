/**
 * Script alternativo para ejecutar SQL usando Supabase Management API
 * Si no funciona, genera un archivo único con todos los scripts
 */

import { readFileSync, writeFileSync } from "fs"
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
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error("❌ Error: SUPABASE_URL no encontrada")
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

async function generateCombinedSQL() {
  console.log("📝 Generando archivo SQL combinado...")
  
  const scriptsDir = join(process.cwd(), "scripts")
  let combinedSQL = `-- ============================================
-- Script SQL Combinado para Supabase
-- Ejecuta este archivo completo en Supabase SQL Editor
-- ============================================\n\n`

  for (const scriptName of scripts) {
    try {
      const scriptPath = join(scriptsDir, scriptName)
      const sql = readFileSync(scriptPath, "utf-8")
      combinedSQL += `-- ============================================\n`
      combinedSQL += `-- ${scriptName}\n`
      combinedSQL += `-- ============================================\n\n`
      combinedSQL += sql
      combinedSQL += `\n\n`
    } catch (error: any) {
      console.error(`❌ Error leyendo ${scriptName}:`, error.message)
    }
  }

  const outputPath = join(process.cwd(), "scripts", "ALL_SCRIPTS_COMBINED.sql")
  writeFileSync(outputPath, combinedSQL, "utf-8")
  
  console.log(`✅ Archivo generado: ${outputPath}`)
  console.log(`\n📋 Instrucciones:`)
  console.log(`   1. Abre Supabase Dashboard → SQL Editor`)
  console.log(`   2. Copia el contenido de: scripts/ALL_SCRIPTS_COMBINED.sql`)
  console.log(`   3. Pégalo en el SQL Editor`)
  console.log(`   4. Haz clic en "RUN" ▶️`)
  console.log(`\n✨ ¡Listo! Todos los scripts se ejecutarán en orden.`)
}

// Ejecutar
generateCombinedSQL().catch((error) => {
  console.error("\n❌ Error:", error)
  process.exit(1)
})

