"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "./auth"

export async function getSalesReport(period: "day" | "week" | "month" | "year") {
  console.log("[app] Getting sales report for period:", period)

  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    console.log("[app] Unauthorized access to reports")
    return { success: false, error: "No autorizado" }
  }

  const supabase = await createClient()

  const { data: paidOrders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(*, menu_items(*)),
      tables!table_id(*),
      users(username)
    `)
    .eq("status", "paid")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[app] Error fetching paid orders:", error)
    return { success: false, error: "Error al obtener reportes" }
  }

  console.log("[app] Found paid orders:", paidOrders?.length || 0)

  const now = new Date()
  let filteredOrders = paidOrders || []

  if (period === "day") {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.updated_at)
      return orderDate.toDateString() === now.toDateString()
    })
  } else if (period === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.updated_at)
      return orderDate >= weekAgo
    })
  } else if (period === "month") {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.updated_at)
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
    })
  } else if (period === "year") {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.updated_at)
      return orderDate.getFullYear() === now.getFullYear()
    })
  }

  console.log("[app] Filtered orders for period:", filteredOrders.length)

  const transformedOrders = filteredOrders.map((order) => ({
    id: order.id,
    tableNumber: order.tables?.table_number || 0,
    waiterName: order.users?.username || "Desconocido",
    total: order.total,
    createdAt: order.created_at,
    paidAt: order.updated_at,
    items:
      order.order_items?.map((item: any) => ({
        id: item.id,
        menuItemName: item.menu_items?.name || "Desconocido",
        quantity: item.quantity,
        price: item.price,
      })) || [],
  }))

  const totalSales = transformedOrders.reduce((sum, order) => sum + order.total, 0)
  const orderCount = transformedOrders.length

  console.log("[app] Report summary:", { totalSales, orderCount })

  return {
    success: true,
    report: {
      period,
      totalSales,
      orderCount,
      orders: transformedOrders,
    },
  }
}
