"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import type { InventoryItem } from "@/lib/db"

export async function getAllInventoryItems() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== "admin") {
      return { success: false, error: "Solo administradores pueden ver el inventario" }
    }

    const supabase = await createClient()
    const { data: items, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("category", { ascending: true })

    if (error) {
      console.error("Error fetching inventory:", error)
      return { success: false, error: "Error al obtener inventario" }
    }

    return { success: true, items }
  } catch (error) {
    console.error("Error getting inventory items:", error)
    return { success: false, error: "Error al obtener items del inventario" }
  }
}

export async function getLowStockItems() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== "admin") {
      return { success: false, error: "Solo administradores pueden ver el inventario" }
    }

    const supabase = await createClient()
    const { data: items, error } = await supabase.rpc("get_low_stock_items")

    if (error) {
      // Fallback to manual filtering if RPC doesn't exist
      const { data: allItems } = await supabase.from("inventory_items").select("*")
      const lowStock = allItems?.filter((item) => item.quantity <= item.min_quantity) || []
      return { success: true, items: lowStock }
    }

    return { success: true, items }
  } catch (error) {
    console.error("Error getting low stock items:", error)
    return { success: false, error: "Error al obtener items con stock bajo" }
  }
}

export async function updateInventoryItem(id: string, updates: { quantity?: number; min_quantity?: number }) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== "admin") {
      return { success: false, error: "Solo administradores pueden actualizar el inventario" }
    }

    const supabase = await createClient()
    const { data: updated, error } = await supabase
      .from("inventory_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating inventory:", error)
      return { success: false, error: "Item no encontrado" }
    }

    return { success: true, item: updated }
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return { success: false, error: "Error al actualizar item del inventario" }
  }
}

export async function createInventoryItem(item: Omit<InventoryItem, "id" | "lastRestocked">) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== "admin") {
      return { success: false, error: "Solo administradores pueden crear items de inventario" }
    }

    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      lastRestocked: new Date(),
    }

    const supabase = await createClient()
    const { data: created, error } = await supabase.from("inventory_items").insert([newItem]).select().single()

    if (error) {
      console.error("Error creating inventory item:", error)
      return { success: false, error: "Error al crear item del inventario" }
    }

    return { success: true, item: created }
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return { success: false, error: "Error al crear item del inventario" }
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")

    if (!session) {
      return { success: false, error: "No autorizado" }
    }

    const sessionData = JSON.parse(session.value)
    if (sessionData.role !== "admin") {
      return { success: false, error: "Solo administradores pueden eliminar items de inventario" }
    }

    const supabase = await createClient()
    const { error } = await supabase.from("inventory_items").delete().eq("id", id)

    if (error) {
      console.error("Error deleting inventory item:", error)
      return { success: false, error: "Item no encontrado" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return { success: false, error: "Error al eliminar item del inventario" }
  }
}

export async function getInventory() {
  return getAllInventoryItems()
}

export async function getInventoryDirect() {
  const supabase = await createClient()
  const { data: items } = await supabase.from("inventory_items").select("*")
  return items || []
}

export async function updateInventoryItemDirect(id: string, quantity: number) {
  const supabase = await createClient()
  const { data: updated, error } = await supabase
    .from("inventory_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, error: "Item no encontrado" }
  }

  return { success: true, item: updated }
}
