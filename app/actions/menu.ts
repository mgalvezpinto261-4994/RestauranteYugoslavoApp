"use server"

import { createClient } from "@/lib/supabase/server"
import { getSession } from "./auth"

export async function getMenuItems() {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: items, error } = await supabase.from("menu_items").select("*").order("category", { ascending: true })

  if (error) {
    console.error("Error fetching menu items:", error)
    return { success: false, error: "Error al obtener items del menú" }
  }

  return { success: true, items }
}

export async function checkMenuItemsStock() {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: menuItems } = await supabase.from("menu_items").select("*")

  if (!menuItems) {
    return { success: false, error: "Error al obtener items del menú" }
  }

  const stockStatus: Record<string, { available: boolean; missingItems: string[] }> = {}

  for (const item of menuItems) {
    const { data: ingredients } = await supabase
      .from("menu_item_ingredients")
      .select("*, inventory_items(*)")
      .eq("menu_item_id", item.id)

    let available = true
    const missingItems: string[] = []

    if (ingredients) {
      for (const ing of ingredients) {
        if (ing.inventory_items.quantity < ing.quantity) {
          available = false
          missingItems.push(ing.inventory_items.name)
        }
      }
    }

    stockStatus[item.id] = { available, missingItems }
  }

  return { success: true, stockStatus }
}
