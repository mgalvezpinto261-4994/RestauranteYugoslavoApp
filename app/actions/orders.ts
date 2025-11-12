"use server"

import { createClient } from "@/lib/supabase/server"
import { getSession } from "./auth"

interface OrderItem {
  menuItemId: string
  menuItemName: string
  quantity: number
  price: number
  notes?: string
}

export async function getActiveOrderForTable(tableId: string) {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(*))")
    .eq("table_id", tableId)
    .neq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("[app] Error fetching active order for table:", error)
    return { success: false, error: "Error al obtener orden activa" }
  }

  if (!orders || orders.length === 0) {
    return { success: true, order: null }
  }

  const order = orders[0]

  // Transform to match expected structure
  const transformedOrder = {
    id: order.id,
    tableId: order.table_id,
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
    items:
      order.order_items?.map((item: any) => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        menuItemName: item.menu_items?.name || "Item desconocido",
        quantity: item.quantity,
        price: item.price,
        notes: item.notes,
      })) || [],
  }

  return { success: true, order: transformedOrder }
}

export async function createOrder(tableId: string, items: OrderItem[]) {
  console.log("[app] createOrder called for table:", tableId)

  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const existingOrderResult = await getActiveOrderForTable(tableId)
  if (existingOrderResult.success && existingOrderResult.order) {
    console.log("[app] Found existing order for table, adding items to it:", existingOrderResult.order.id)
    return addItemsToOrder(existingOrderResult.order.id, items)
  }

  const supabase = await createClient()

  const menuItemIds = items.map((item) => item.menuItemId)
  const { data: allIngredients } = await supabase
    .from("menu_item_ingredients")
    .select("*, inventory_items(*)")
    .in("menu_item_id", menuItemIds)

  // Group ingredients by menu item
  const ingredientsByMenuItem = new Map<string, any[]>()
  allIngredients?.forEach((ing) => {
    if (!ingredientsByMenuItem.has(ing.menu_item_id)) {
      ingredientsByMenuItem.set(ing.menu_item_id, [])
    }
    ingredientsByMenuItem.get(ing.menu_item_id)?.push(ing)
  })

  // Validate stock for all items
  const stockIssues: string[] = []
  const inventoryUpdates = new Map<string, number>()

  for (const item of items) {
    const ingredients = ingredientsByMenuItem.get(item.menuItemId) || []
    console.log("[app] Ingredients for", item.menuItemName, ":", ingredients.length)

    for (const ing of ingredients) {
      const required = ing.quantity * item.quantity
      const currentQty = inventoryUpdates.get(ing.inventory_item_id) ?? ing.inventory_items.quantity
      const newQty = currentQty - required

      if (newQty < 0) {
        stockIssues.push(`${item.menuItemName}: falta ${ing.inventory_items.name}`)
      } else {
        inventoryUpdates.set(ing.inventory_item_id, newQty)
      }
    }
  }

  if (stockIssues.length > 0) {
    return {
      success: false,
      error: `Stock insuficiente para:\n${stockIssues.join("\n")}`,
    }
  }

  const updatePromises = Array.from(inventoryUpdates.entries()).map(([inventoryId, newQuantity]) =>
    supabase
      .from("inventory_items")
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq("id", inventoryId),
  )

  await Promise.all(updatePromises)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      table_id: tableId,
      total,
      status: "pending",
      created_by: session.user.id,
    })
    .select()
    .single()

  if (orderError) {
    console.error("Error creating order:", orderError)
    return { success: false, error: "Error al crear orden" }
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    price: item.price,
    notes: item.notes || null,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error creating order items:", itemsError)
    return { success: false, error: "Error al crear items de orden" }
  }

  // Update table status
  await supabase
    .from("tables")
    .update({
      status: "occupied",
      current_order_id: order.id,
    })
    .eq("id", tableId)

  return { success: true, order }
}

export async function addItemsToOrder(orderId: string, newItems: OrderItem[]) {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()

  const menuItemIds = newItems.map((item) => item.menuItemId)
  const { data: allIngredients } = await supabase
    .from("menu_item_ingredients")
    .select("*, inventory_items(*)")
    .in("menu_item_id", menuItemIds)

  const ingredientsByMenuItem = new Map<string, any[]>()
  allIngredients?.forEach((ing) => {
    if (!ingredientsByMenuItem.has(ing.menu_item_id)) {
      ingredientsByMenuItem.set(ing.menu_item_id, [])
    }
    ingredientsByMenuItem.get(ing.menu_item_id)?.push(ing)
  })

  const stockIssues: string[] = []
  const inventoryUpdates = new Map<string, number>()

  for (const item of newItems) {
    const ingredients = ingredientsByMenuItem.get(item.menuItemId) || []

    for (const ing of ingredients) {
      const required = ing.quantity * item.quantity
      const currentQty = inventoryUpdates.get(ing.inventory_item_id) ?? ing.inventory_items.quantity
      const newQty = currentQty - required

      if (newQty < 0) {
        stockIssues.push(`${item.menuItemName}: falta ${ing.inventory_items.name}`)
      } else {
        inventoryUpdates.set(ing.inventory_item_id, newQty)
      }
    }
  }

  if (stockIssues.length > 0) {
    return {
      success: false,
      error: `Stock insuficiente para:\n${stockIssues.join("\n")}`,
    }
  }

  const updatePromises = Array.from(inventoryUpdates.entries()).map(([inventoryId, newQuantity]) =>
    supabase
      .from("inventory_items")
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq("id", inventoryId),
  )

  await Promise.all(updatePromises)

  const orderItems = newItems.map((item) => ({
    order_id: orderId,
    menu_item_id: item.menuItemId,
    quantity: item.quantity,
    price: item.price,
    notes: item.notes || null,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    console.error("Error adding items to order:", itemsError)
    return { success: false, error: "Error al agregar items" }
  }

  // Update order total
  const { data: allItems } = await supabase.from("order_items").select("*").eq("order_id", orderId)

  if (allItems) {
    const total = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    await supabase.from("orders").update({ total, updated_at: new Date().toISOString() }).eq("id", orderId)
  }

  // Get updated order
  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single()

  return { success: true, order }
}

export async function getOrder(orderId: string) {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(*))")
    .eq("id", orderId)
    .single()

  if (error) {
    return { success: false, error: "Orden no encontrada" }
  }

  return { success: true, order }
}

export async function getAllOrders() {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(*)), tables!table_id(*), users!created_by(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return { success: false, error: "Error al obtener órdenes" }
  }

  return { success: true, orders }
}

export async function getActiveOrders() {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  console.log("[app] getActiveOrders called by user:", session.user.username)

  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_items(*)), tables!table_id(*), users!created_by(*)")
    .neq("status", "paid")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[app] Error fetching active orders:", error)
    return { success: false, error: "Error al obtener órdenes activas" }
  }

  console.log("[app] Raw orders from database:", orders?.length || 0)
  console.log("[app] Orders data:", JSON.stringify(orders, null, 2))

  const transformedOrders =
    orders?.map((order: any) => ({
      id: order.id,
      tableId: order.table_id,
      tableNumber: order.tables?.number || 0,
      waiterName: order.users?.username || "Desconocido",
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      items:
        order.order_items?.map((item: any) => ({
          id: item.id,
          menuItemId: item.menu_item_id,
          menuItemName: item.menu_items?.name || "Item desconocido",
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
        })) || [],
    })) || []

  console.log("[app] Transformed orders:", transformedOrders.length)
  console.log("[app] Transformed data:", JSON.stringify(transformedOrders, null, 2))

  return { success: true, orders: transformedOrders }
}

export async function payOrder(orderId: string) {
  console.log("[app] payOrder called with orderId:", orderId)

  const session = await getSession()
  console.log("[app] Session:", session ? { user: session.user?.id, role: session.user?.role } : null)

  if (!session || session.user.role !== "admin") {
    console.log("[app] Authorization failed - not admin or no session")
    return { success: false, error: "Solo administradores pueden marcar pedidos como pagados" }
  }

  const supabase = await createClient()

  console.log("[app] Looking up order with ID:", orderId)

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, tables!table_id(*)")
    .eq("id", orderId)
    .single()

  console.log("[app] Order lookup result:", {
    found: !!order,
    orderId: order?.id,
    tableId: order?.table_id,
    currentStatus: order?.status,
    error: orderError,
  })

  if (orderError || !order) {
    console.log("[app] Order not found - error:", orderError)
    return { success: false, error: "Orden no encontrada" }
  }

  if (order.status === "paid") {
    console.log("[app] Order already marked as paid")
    return { success: true, message: "Orden ya estaba pagada" }
  }

  console.log("[app] Marking order as paid:", order.id)

  // Mark order as paid
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "paid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (updateError) {
    console.error("[app] Error marking order as paid:", updateError)
    return { success: false, error: "Error al marcar orden como pagada" }
  }

  console.log("[app] Order marked as paid successfully, releasing table:", order.table_id)

  // Release table
  const { error: tableError } = await supabase
    .from("tables")
    .update({
      status: "available",
      current_order_id: null,
    })
    .eq("id", order.table_id)

  if (tableError) {
    console.error("[app] Error releasing table:", tableError)
    // Don't return error, table release is not critical
  }

  console.log("[app] Payment completed successfully")

  return { success: true }
}
