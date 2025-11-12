"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Table, MenuItem, OrderItem, Order } from "@/lib/db"
import { createOrder, addItemsToOrder } from "@/app/actions/orders"
import { checkMenuItemsStock } from "@/app/actions/menu"
import { Minus, Plus, ShoppingCart, Check, AlertTriangle } from "@/components/icons"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface OrderFormProps {
  table: Table
  menuItems: MenuItem[]
  existingOrder: Order | null
  onComplete: () => void
}

export function OrderForm({ table, menuItems, existingOrder, onComplete }: OrderFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [cart, setCart] = useState<Map<string, OrderItem>>(new Map())
  const [loading, setLoading] = useState(false)
  const [stockStatus, setStockStatus] = useState<Record<string, { available: boolean; missingItems: string[] }>>({})

  useEffect(() => {
    const loadStockStatus = async () => {
      const result = await checkMenuItemsStock()
      if (result.success && result.stockStatus) {
        setStockStatus(result.stockStatus)
      }
    }
    loadStockStatus()
  }, [])

  const addToCart = (item: MenuItem) => {
    const stock = stockStatus[item.id]
    if (stock && !stock.available) {
      toast({
        title: "Stock insuficiente",
        description: `No hay suficiente stock de: ${stock.missingItems.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    const newCart = new Map(cart)
    const existing = newCart.get(item.id)

    if (existing) {
      newCart.set(item.id, {
        ...existing,
        quantity: existing.quantity + 1,
      })
    } else {
      newCart.set(item.id, {
        id: `item-${Date.now()}-${item.id}`,
        menuItemId: item.id,
        menuItemName: item.name,
        quantity: 1,
        price: item.price,
      })
    }

    setCart(newCart)
  }

  const removeFromCart = (itemId: string) => {
    const newCart = new Map(cart)
    const existing = newCart.get(itemId)

    if (existing && existing.quantity > 1) {
      newCart.set(itemId, {
        ...existing,
        quantity: existing.quantity - 1,
      })
    } else {
      newCart.delete(itemId)
    }

    setCart(newCart)
  }

  const getTotal = () => {
    return Array.from(cart.values()).reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleSubmit = async () => {
    if (cart.size === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega al menos un item al pedido",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    toast({
      title: "Procesando pedido...",
      description: "Estamos registrando tu pedido",
    })

    try {
      const items = Array.from(cart.values())

      let result
      if (existingOrder) {
        result = await addItemsToOrder(existingOrder.id, items)
      } else {
        result = await createOrder(table.id, items)
      }

      if (result.success) {
        setCart(new Map())

        toast({
          title: "Pedido registrado",
          description: existingOrder
            ? "Se agregaron los items al pedido existente. Inventario actualizado."
            : "El pedido ha sido creado exitosamente. Inventario actualizado.",
        })

        router.refresh()

        setTimeout(() => {
          onComplete()
        }, 500)
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo registrar el pedido",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error submitting order:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount)
  }

  const categories = Array.from(new Set(menuItems.map((item) => item.category)))

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-primary/5 to-accent/5 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="text-primary">Menú</CardTitle>
            <CardDescription className="font-medium">
              Selecciona los items para la Mesa {table.number}
              {existingOrder && (
                <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-accent/20 to-secondary/20 border-accent/30">
                  Pedido existente #{existingOrder.id.slice(-4)}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{category}</h3>
                    <div className="grid gap-3">
                      {menuItems
                        .filter((item) => item.category === category)
                        .map((item) => {
                          const stock = stockStatus[item.id]
                          const hasStock = !stock || stock.available

                          return (
                            <Card
                              key={item.id}
                              className={`cursor-pointer transition-all border-2 ${
                                hasStock 
                                  ? "hover:shadow-lg hover:scale-[1.02] border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card hover:border-primary/40" 
                                  : "opacity-60 cursor-not-allowed border-destructive/20 bg-destructive/5"
                              }`}
                              onClick={() => hasStock && addToCart(item)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-foreground">{item.name}</h4>
                                      {!hasStock && (
                                        <Badge variant="destructive" className="text-xs bg-gradient-to-r from-red-500 to-rose-500">
                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                          Sin stock
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold mt-1">
                                      {formatCurrency(item.price)}
                                    </p>
                                    {!hasStock && stock && (
                                      <p className="text-xs text-destructive mt-1">
                                        Faltan: {stock.missingItems.join(", ")}
                                      </p>
                                    )}
                                  </div>
                                  <Button size="sm" variant="outline" disabled={!hasStock}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-4 border-2 border-accent/20 bg-gradient-to-br from-card via-accent/5 to-secondary/5 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-accent/10 via-secondary/5 to-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-accent">
              <ShoppingCart className="h-5 w-5" />
              {existingOrder ? "Agregar Items" : "Nuevo Pedido"}
            </CardTitle>
            <CardDescription className="font-medium">Mesa {table.number}</CardDescription>
          </CardHeader>
          <CardContent>
            {existingOrder && existingOrder.items && existingOrder.items.length > 0 && (
              <>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Pedido Actual:</h4>
                  <div className="space-y-2 text-sm">
                    {existingOrder.items.map((item: OrderItem, idx: number) => (
                      <div key={idx} className="flex justify-between text-muted-foreground">
                        <span>
                          {item.quantity}x {item.menuItemName}
                        </span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                    <span>Subtotal actual:</span>
                    <span>{formatCurrency(existingOrder.total)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
              </>
            )}

            {cart.size === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{existingOrder ? "Agrega más items al pedido" : "No hay items en el pedido"}</p>
              </div>
            ) : (
              <>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {existingOrder ? "Nuevos Items:" : "Items:"}
                </h4>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {Array.from(cart.values()).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{item.menuItemName}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => removeFromCart(item.menuItemId)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => {
                              const menuItem = menuItems.find((m) => m.id === item.menuItemId)
                              if (menuItem) addToCart(menuItem)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm font-semibold text-foreground w-20 text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}

            <Separator className="my-4" />
            <div className="space-y-2">
              {existingOrder && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal anterior:</span>
                  <span>{formatCurrency(existingOrder.total)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{existingOrder ? "Nuevos items:" : "Subtotal:"}</span>
                <span className="font-medium">{formatCurrency(getTotal())}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(getTotal() + (existingOrder?.total || 0))}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit} disabled={loading || cart.size === 0}>
              <Check className="h-4 w-4 mr-2" />
              {loading ? "Procesando..." : existingOrder ? "Agregar al Pedido" : "Crear Pedido"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
