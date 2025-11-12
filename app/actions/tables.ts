"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSession } from "./auth"

export async function getTables() {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: tables, error } = await supabase.from("tables").select("*").order("table_number", { ascending: true })

  console.log("[app] Tables fetched from database:", tables)

  if (error) {
    console.error("Error fetching tables:", error)
    return { success: false, error: "Error al obtener mesas" }
  }

  const transformedTables = tables?.map((table) => ({
    ...table,
    number: table.table_number,
    capacity: table.capacity || 4,
  }))

  console.log("[app] Tables after transformation:", transformedTables)

  return { success: true, tables: transformedTables }
}

export async function updateTableStatus(tableId: string, status: "available" | "occupied" | "reserved") {
  const session = await getSession()
  if (!session) {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()
  const { data: table, error } = await supabase.from("tables").update({ status }).eq("id", tableId).select().single()

  if (error) {
    console.error("Error updating table:", error)
    return { success: false, error: "Error al actualizar mesa" }
  }

  return { success: true, table }
}

export async function releaseTable(tableId: string) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()

  const { data: table, error: tableError } = await supabase.from("tables").select("*").eq("id", tableId).single()

  if (tableError || !table) {
    return { success: false, error: "Mesa no encontrada" }
  }

  // Mark order as paid if exists
  if (table.current_order_id) {
    await supabase
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", table.current_order_id)
  }

  // Release table
  const { data: updatedTable, error: updateError } = await supabase
    .from("tables")
    .update({
      status: "available",
      current_order_id: null,
    })
    .eq("id", tableId)
    .select()
    .single()

  if (updateError) {
    return { success: false, error: "Error al liberar mesa" }
  }

  return { success: true, table: updatedTable }
}

export async function addTables(count: number, capacity = 4) {
  const session = await getSession()
  if (!session || session.user.role !== "admin") {
    return { success: false, error: "No autorizado" }
  }

  const supabase = createAdminClient()

  // Get the highest table number
  const { data: tables, error: fetchError } = await supabase
    .from("tables")
    .select("table_number")
    .order("table_number", { ascending: false })
    .limit(1)

  if (fetchError) {
    console.error("Error fetching tables:", fetchError)
    return { success: false, error: "Error al obtener mesas" }
  }

  const lastTableNumber = tables && tables.length > 0 ? tables[0].table_number : 0

  // Create new tables with consecutive numbers and specified capacity
  const newTables = []
  for (let i = 1; i <= count; i++) {
    newTables.push({
      table_number: lastTableNumber + i,
      status: "available",
      capacity: capacity,
      current_order_id: null,
    })
  }

  const { data: insertedTables, error: insertError } = await supabase.from("tables").insert(newTables).select()

  if (insertError) {
    console.error("Error adding tables:", insertError)
    return { success: false, error: "Error al agregar mesas" }
  }

  return { success: true, tables: insertedTables }
}
