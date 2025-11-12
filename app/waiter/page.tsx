import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getTables } from "../actions/tables"
import { getMenuItems } from "../actions/menu"
import { Header } from "@/components/header"
import { WaiterDashboard } from "@/components/waiter-dashboard"

export default async function WaiterPage() {
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

  if (session.user.role !== "waiter") {
    redirect("/admin")
  }

  const tablesResult = await getTables()
  const tables = tablesResult.success ? tablesResult.tables : []

  const menuResult = await getMenuItems()
  const menuItems = menuResult.success ? menuResult.items : []

  return (
    <div className="min-h-screen bg-background">
      <Header userName={session.user.name} userRole={session.user.role} />
      <main className="container mx-auto px-4 py-8">
        <WaiterDashboard tables={tables || []} menuItems={menuItems || []} />
      </main>
    </div>
  )
}
