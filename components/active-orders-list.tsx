"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/db"
import { Clock, User, CheckCircle } from "@/components/icons"
import { payOrder } from "@/app/actions/orders"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ActiveOrdersListProps {
  orders: Order[]
  showPayButton?: boolean
}

export function ActiveOrdersList({ orders, showPayButton = false }: ActiveOrdersListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null)
  const [paidOrderIds, setPaidOrderIds] = useState<Set<string>>(new Set())

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePayOrder = async (orderId: string) => {
    setPayingOrderId(orderId)
    console.log("[v0] Marking order as paid:", orderId)

    const result = await payOrder(orderId)

    if (result.success) {
      console.log("[v0] Payment successful, hiding order and refreshing")
      setPaidOrderIds((prev) => new Set(prev).add(orderId))
      toast({
        title: "Pedido pagado",
        description: "El pedido fue marcado como pagado correctamente.",
      })
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } else {
      console.error("[v0] Payment failed:", result.error)
      toast({
        title: "Error al procesar el pago",
        description: result.error || "Ocurrió un error al marcar el pedido como pagado.",
        variant: "destructive",
      })
      setPayingOrderId(null)
    }
  }

  const visibleOrders = orders.filter((order) => !paidOrderIds.has(order.id))

  if (visibleOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Activos</CardTitle>
          <CardDescription>No hay pedidos activos en este momento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay pedidos para mostrar</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Activos</CardTitle>
        <CardDescription>Lista de todos los pedidos en proceso</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {visibleOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="default" className="text-lg px-3 py-1">
                        Mesa {order.tableNumber}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatTime(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{formatCurrency(order.total)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {order.waiterName}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {item.quantity}x
                            </Badge>
                            <span className="text-sm">{item.menuItemName}</span>
                          </div>
                          <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                        {index < order.items.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                  {showPayButton && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={() => handlePayOrder(order.id)}
                        disabled={payingOrderId === order.id}
                        className="w-full"
                        size="lg"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        {payingOrderId === order.id ? "Procesando..." : "Marcar como Pagado"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
