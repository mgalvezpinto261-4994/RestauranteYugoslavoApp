import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/actions/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  const session = await getSession()

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const period = (searchParams.get("period") as "day" | "week" | "month" | "year") || "day"

  const now = new Date()
  let startDate: Date

  switch (period) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case "week":
      const dayOfWeek = now.getDay()
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
      break
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  const paidOrders = db.getPaidOrders().filter((order) => {
    const orderDate = order.paidAt || order.createdAt
    return new Date(orderDate) >= startDate
  })

  const totalSales = paidOrders.reduce((sum, order) => sum + order.total, 0)

  const report = {
    period,
    totalSales,
    orderCount: paidOrders.length,
    orders: paidOrders.sort((a, b) => {
      const dateA = new Date(a.paidAt || a.createdAt).getTime()
      const dateB = new Date(b.paidAt || b.createdAt).getTime()
      return dateB - dateA
    }),
  }

  return NextResponse.json({ success: true, report })
}
