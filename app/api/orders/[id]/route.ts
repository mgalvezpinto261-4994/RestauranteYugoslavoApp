import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/app/actions/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 })
  }

  const order = db.getOrder(params.id)

  if (!order) {
    return NextResponse.json({ success: false, error: "Pedido no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ success: true, order })
}
