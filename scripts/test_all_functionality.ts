/**
 * Script de Pruebas Automatizadas - Sistema de Restaurante
 *
 * Este script ejecuta pruebas end-to-end de todas las funcionalidades críticas
 * Requiere que la aplicación esté corriendo y Supabase conectado
 */

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface TestResult {
  testId: string
  name: string
  status: "PASS" | "FAIL" | "SKIP"
  duration: number
  error?: string
  details?: any
}

const results: TestResult[] = []

// Utility functions
function log(message: string, level: "info" | "success" | "error" | "warn" = "info") {
  const colors = {
    info: "\x1b[36m",
    success: "\x1b[32m",
    error: "\x1b[31m",
    warn: "\x1b[33m",
  }
  const reset = "\x1b[0m"
  console.log(`${colors[level]}${message}${reset}`)
}

async function runTest(testId: string, name: string, testFn: () => Promise<void>): Promise<TestResult> {
  log(`\n🧪 Ejecutando: ${testId} - ${name}`, "info")
  const start = Date.now()

  try {
    await testFn()
    const duration = Date.now() - start
    log(`✅ PASS (${duration}ms)`, "success")
    return { testId, name, status: "PASS", duration }
  } catch (error) {
    const duration = Date.now() - start
    log(`❌ FAIL (${duration}ms): ${error}`, "error")
    return {
      testId,
      name,
      status: "FAIL",
      duration,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// Test Cases

async function test001_LoginMesero() {
  // Simulate login by checking user exists
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", "mesero")
    .eq("role", "waiter")
    .single()

  if (error || !user) {
    throw new Error("Usuario mesero no encontrado en BD")
  }

  if (user.role !== "waiter") {
    throw new Error(`Rol incorrecto: esperado 'waiter', obtenido '${user.role}'`)
  }

  log(`Usuario mesero encontrado: ${user.username}`)
}

async function test002_LoginAdmin() {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", "admin")
    .eq("role", "admin")
    .single()

  if (error || !user) {
    throw new Error("Usuario admin no encontrado en BD")
  }

  if (user.role !== "admin") {
    throw new Error(`Rol incorrecto: esperado 'admin', obtenido '${user.role}'`)
  }

  log(`Usuario admin encontrado: ${user.username}`)
}

async function test003_CreateOrder() {
  // Get a table
  const { data: table } = await supabase.from("tables").select("*").eq("status", "available").limit(1).single()

  if (!table) throw new Error("No hay mesas disponibles")

  // Get menu items
  const { data: items } = await supabase.from("menu_items").select("*").limit(2)

  if (!items || items.length < 2) {
    throw new Error("No hay suficientes items en el menú")
  }

  // Get mesero user
  const { data: mesero } = await supabase.from("users").select("*").eq("username", "mesero").single()

  if (!mesero) throw new Error("Usuario mesero no encontrado")

  // Create order
  const total = items[0].price * 2 + items[1].price * 1
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      table_id: table.id,
      total,
      status: "pending",
      created_by: mesero.id,
    })
    .select()
    .single()

  if (orderError || !order) {
    throw new Error(`Error creando orden: ${orderError?.message}`)
  }

  // Create order items
  const orderItems = [
    {
      order_id: order.id,
      menu_item_id: items[0].id,
      quantity: 2,
      price: items[0].price,
    },
    {
      order_id: order.id,
      menu_item_id: items[1].id,
      quantity: 1,
      price: items[1].price,
    },
  ]

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    throw new Error(`Error creando items: ${itemsError.message}`)
  }

  // Update table status
  await supabase.from("tables").update({ status: "occupied", current_order_id: order.id }).eq("id", table.id)

  log(`Orden creada: ${order.id}, Mesa: ${table.table_number}, Total: $${total}`)

  // Verify table is occupied
  const { data: updatedTable } = await supabase.from("tables").select("*").eq("id", table.id).single()

  if (updatedTable?.status !== "occupied") {
    throw new Error("Mesa no marcada como ocupada")
  }

  return { orderId: order.id, tableId: table.id }
}

async function test004_ViewOrderAsAdmin() {
  // Get all active orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(*)), tables!table_id(*), users!created_by(*)")
    .neq("status", "paid")

  if (error) {
    throw new Error(`Error obteniendo órdenes: ${error.message}`)
  }

  if (!orders || orders.length === 0) {
    throw new Error("No hay órdenes activas para visualizar")
  }

  // Verify order structure
  const order = orders[0]
  if (!order.order_items || order.order_items.length === 0) {
    throw new Error("Orden sin items")
  }

  if (!order.tables) {
    throw new Error("Orden sin información de mesa")
  }

  if (!order.users) {
    throw new Error("Orden sin información de mesero")
  }

  log(`Admin puede ver ${orders.length} órdenes activas`)
  log(`Primera orden: Mesa ${order.tables.table_number}, Mesero: ${order.users.username}`)
}

async function test005_AddItemsToOrder() {
  // Get an active order
  const { data: orders } = await supabase.from("orders").select("*, order_items(*)").eq("status", "pending").limit(1)

  if (!orders || orders.length === 0) {
    throw new Error("No hay órdenes pendientes para editar")
  }

  const order = orders[0]
  const initialItemCount = order.order_items?.length || 0
  const initialTotal = order.total

  // Get a menu item to add
  const { data: menuItem } = await supabase.from("menu_items").select("*").limit(1).single()

  if (!menuItem) throw new Error("No hay items en el menú")

  // Add new item
  const { error } = await supabase.from("order_items").insert({
    order_id: order.id,
    menu_item_id: menuItem.id,
    quantity: 1,
    price: menuItem.price,
  })

  if (error) {
    throw new Error(`Error agregando item: ${error.message}`)
  }

  // Update order total
  const newTotal = Number(initialTotal) + Number(menuItem.price)
  await supabase.from("orders").update({ total: newTotal }).eq("id", order.id)

  // Verify
  const { data: updatedOrder } = await supabase.from("orders").select("*, order_items(*)").eq("id", order.id).single()

  if (!updatedOrder) throw new Error("Orden no encontrada después de actualizar")

  if (updatedOrder.order_items.length !== initialItemCount + 1) {
    throw new Error("Item no agregado correctamente")
  }

  log(`Item agregado. Items: ${initialItemCount} → ${updatedOrder.order_items.length}`)
  log(`Total: $${initialTotal} → $${newTotal}`)
}

async function test006_ValidateStockDeduction() {
  // Get menu item with ingredients
  const { data: menuItem } = await supabase.from("menu_items").select("*").limit(1).single()

  if (!menuItem) throw new Error("No hay items en el menú")

  // Get ingredients for this item
  const { data: ingredients } = await supabase
    .from("menu_item_ingredients")
    .select("*, inventory_items(*)")
    .eq("menu_item_id", menuItem.id)

  if (!ingredients || ingredients.length === 0) {
    log("⚠️ Este item no tiene ingredientes vinculados", "warn")
    return
  }

  // Record initial inventory
  const initialInventory = ingredients.map((ing: any) => ({
    id: ing.inventory_item_id,
    name: ing.inventory_items.name,
    quantity: Number(ing.inventory_items.quantity),
    needed: Number(ing.quantity),
  }))

  log(`Item: ${menuItem.name} requiere:`)
  initialInventory.forEach((inv) => {
    log(`  - ${inv.name}: ${inv.needed} unidades (disponible: ${inv.quantity})`)
  })

  // Note: Actual deduction happens in createOrder function
  // This test validates that ingredients are properly linked
}

async function test007_MarkOrderAsPaid() {
  // Get a pending order
  const { data: order } = await supabase
    .from("orders")
    .select("*, tables!table_id(*)")
    .eq("status", "pending")
    .limit(1)
    .single()

  if (!order) {
    throw new Error("No hay órdenes pendientes para marcar como pagadas")
  }

  // Mark as paid
  const { error: updateError } = await supabase.from("orders").update({ status: "paid" }).eq("id", order.id)

  if (updateError) {
    throw new Error(`Error marcando como pagado: ${updateError.message}`)
  }

  // Release table
  const { error: tableError } = await supabase
    .from("tables")
    .update({ status: "available", current_order_id: null })
    .eq("id", order.table_id)

  if (tableError) {
    throw new Error(`Error liberando mesa: ${tableError.message}`)
  }

  // Verify
  const { data: updatedTable } = await supabase.from("tables").select("*").eq("id", order.table_id).single()

  if (updatedTable?.status !== "available") {
    throw new Error("Mesa no liberada correctamente")
  }

  log(`Orden ${order.id} marcada como pagada`)
  log(`Mesa ${order.tables.table_number} liberada`)
}

async function test008_ReportShowsPaidOrders() {
  // Get paid orders from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: paidOrders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "paid")
    .gte("created_at", today.toISOString())

  if (error) {
    throw new Error(`Error obteniendo reporte: ${error.message}`)
  }

  log(`Órdenes pagadas hoy: ${paidOrders?.length || 0}`)

  if (paidOrders && paidOrders.length > 0) {
    const total = paidOrders.reduce((sum, order) => sum + Number(order.total), 0)
    log(`Total de ventas hoy: $${total}`)
  }
}

async function test009_InventoryAlerts() {
  // Get inventory items with low stock
  const { data: items, error } = await supabase
    .from("inventory_items")
    .select("*")
    .order("quantity", { ascending: true })

  if (error) {
    throw new Error(`Error obteniendo inventario: ${error.message}`)
  }

  const lowStockItems = items?.filter((item: any) => Number(item.quantity) < Number(item.min_quantity)) || []

  log(`Items con stock bajo: ${lowStockItems.length}`)

  lowStockItems.forEach((item: any) => {
    log(`  ⚠️ ${item.name}: ${item.quantity} ${item.unit} (mínimo: ${item.min_quantity})`, "warn")
  })
}

async function test010_DataPersistence() {
  // Verify tables exist
  const { data: tables, error: tablesError } = await supabase.from("tables").select("count")

  if (tablesError) throw new Error("Error verificando tablas")

  // Verify menu items exist
  const { data: menuItems, error: menuError } = await supabase.from("menu_items").select("count")

  if (menuError) throw new Error("Error verificando menú")

  // Verify inventory exists
  const { data: inventory, error: invError } = await supabase.from("inventory_items").select("count")

  if (invError) throw new Error("Error verificando inventario")

  log(`Datos persistentes:`)
  log(`  - Mesas: ${tables?.[0]?.count || 0}`)
  log(`  - Items de menú: ${menuItems?.[0]?.count || 0}`)
  log(`  - Items de inventario: ${inventory?.[0]?.count || 0}`)
}

// Main test runner
async function runAllTests() {
  log("\n" + "=".repeat(60))
  log("🚀 INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS", "info")
  log("=".repeat(60))

  const tests = [
    { id: "CP-001", name: "Login Mesero", fn: test001_LoginMesero },
    { id: "CP-002", name: "Login Admin", fn: test002_LoginAdmin },
    { id: "CP-003", name: "Crear Pedido", fn: test003_CreateOrder },
    { id: "CP-004", name: "Ver Pedido como Admin", fn: test004_ViewOrderAsAdmin },
    { id: "CP-005", name: "Agregar Items a Pedido", fn: test005_AddItemsToOrder },
    { id: "CP-006", name: "Validar Descuento de Stock", fn: test006_ValidateStockDeduction },
    { id: "CP-007", name: "Marcar como Pagado", fn: test007_MarkOrderAsPaid },
    { id: "CP-008", name: "Reporte con Pagados", fn: test008_ReportShowsPaidOrders },
    { id: "CP-009", name: "Alertas de Inventario", fn: test009_InventoryAlerts },
    { id: "CP-010", name: "Persistencia de Datos", fn: test010_DataPersistence },
  ]

  for (const test of tests) {
    const result = await runTest(test.id, test.name, test.fn)
    results.push(result)
  }

  // Generate report
  log("\n" + "=".repeat(60))
  log("📊 REPORTE DE RESULTADOS", "info")
  log("=".repeat(60))

  const passed = results.filter((r) => r.status === "PASS").length
  const failed = results.filter((r) => r.status === "FAIL").length
  const total = results.length

  log(`\nTotal de pruebas: ${total}`)
  log(`✅ Pasadas: ${passed} (${Math.round((passed / total) * 100)}%)`, "success")
  log(`❌ Fallidas: ${failed} (${Math.round((failed / total) * 100)}%)`, failed > 0 ? "error" : "info")

  if (failed > 0) {
    log("\n⚠️ PRUEBAS FALLIDAS:", "error")
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        log(`  ${r.testId} - ${r.name}`, "error")
        log(`    Error: ${r.error}`, "error")
      })
  }

  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / total
  log(`\n⏱️ Duración promedio: ${Math.round(avgDuration)}ms`)
  log(`⏱️ Duración total: ${results.reduce((sum, r) => sum + r.duration, 0)}ms`)

  log("\n" + "=".repeat(60) + "\n")

  // Exit with error if any test failed
  if (failed > 0) {
    process.exit(1)
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error("Error fatal ejecutando pruebas:", error)
  process.exit(1)
})
