import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getTables } from "../actions/tables"
import { getActiveOrders } from "../actions/orders"
import { getAllInventoryItems } from "../actions/inventory"
import { getMenuItems } from "../actions/menu"
import { Header } from "@/components/header"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/login")
  }

  let session
  try {
    session = JSON.parse(sessionCookie.value)
  } catch {
    redirect("/login")
  }

  if (session.user.role !== "admin") {
    redirect("/waiter")
  }

  console.log("[app] Admin page loading for user:", session.user.username)

  const [tablesResult, ordersResult, inventoryResult, menuResult] = await Promise.all([
    getTables(),
    getActiveOrders(),
    getAllInventoryItems(),
    getMenuItems(),
  ])

  console.log("[app] Tables result:", tablesResult.success, tablesResult.tables?.length || 0)
  console.log("[app] Orders result:", ordersResult.success, ordersResult.orders?.length || 0)
  console.log("[app] Inventory result:", inventoryResult.success, inventoryResult.items?.length || 0)
  console.log("[app] Menu result:", menuResult.success, menuResult.items?.length || 0)

  const tables = tablesResult.success ? tablesResult.tables : []
  const orders = ordersResult.success ? ordersResult.orders : []
  const inventoryItems = inventoryResult.success ? inventoryResult.items : []
  const menuItems = menuResult.success ? menuResult.items : []

  console.log("[app] Passing to AdminDashboard - orders:", orders?.length || 0)

  return (
    <div className="min-h-screen bg-background">
      <Header userName={session.user.name} userRole={session.user.role} />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard
          tables={tables || []}
          orders={orders || []}
          inventoryItems={inventoryItems || []}
          menuItems={menuItems || []}
        />
      </main>
    </div>
  )
}
