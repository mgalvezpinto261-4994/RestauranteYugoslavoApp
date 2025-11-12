"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Package, Plus, Minus } from "@/components/icons"
import type { InventoryItem } from "@/lib/db"
import { updateInventoryItem } from "@/app/actions/inventory"
import { useToast } from "@/hooks/use-toast"

interface InventoryManagementProps {
  items: InventoryItem[]
  onUpdate: () => void
}

export function InventoryManagement({ items, onUpdate }: InventoryManagementProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleAdjustStock = async (itemId: string, adjustment: number) => {
    setIsUpdating(true)
    const item = items.find((i) => i.id === itemId)
    if (!item) return

    const newStock = Math.max(0, item.quantity + adjustment)

    const result = await updateInventoryItem(itemId, {
      quantity: newStock,
    })

    if (result.success) {
      toast({
        title: "Stock actualizado",
        description: `${item.name}: ${item.quantity} → ${newStock} ${item.unit}`,
      })
      onUpdate()
      setSelectedItem(null)
      setAdjustAmount("")
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo actualizar el stock",
        variant: "destructive",
      })
    }

    setIsUpdating(false)
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.min_quantity) {
      return { label: "Crítico", variant: "destructive" as const, color: "text-red-500" }
    } else if (item.quantity <= item.min_quantity * 1.5) {
      return { label: "Bajo", variant: "secondary" as const, color: "text-yellow-500" }
    } else {
      return { label: "Normal", variant: "default" as const, color: "text-green-500" }
    }
  }

  const lowStockItems = items.filter((item) => item.quantity <= item.min_quantity)
  const categories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Stock Bajo
            </CardTitle>
            <CardDescription>Los siguientes items necesitan reabastecimiento urgente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock actual: {item.quantity} {item.unit} (Mínimo: {item.min_quantity} {item.unit})
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                        Reabastecer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajustar Stock: {item.name}</DialogTitle>
                        <DialogDescription>
                          Stock actual: {item.quantity} {item.unit}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="adjust-amount">Cantidad a agregar</Label>
                          <Input
                            id="adjust-amount"
                            type="number"
                            placeholder="0"
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAdjustStock(item.id, Number(adjustAmount) || 0)}
                            disabled={isUpdating || !adjustAmount}
                            className="flex-1"
                          >
                            Confirmar
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => {
        const categoryItems = items.filter((item) => item.category === category)
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {category}
              </CardTitle>
              <CardDescription>{categoryItems.length} items en esta categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map((item) => {
                  const status = getStockStatus(item)

                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium">{item.name}</p>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              Stock: {item.quantity} {item.unit} (Mín: {item.min_quantity})
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                item.quantity <= item.min_quantity
                                  ? "bg-destructive"
                                  : item.quantity <= item.min_quantity * 1.5
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min((item.quantity / (item.min_quantity * 3)) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAdjustStock(item.id, -10)}
                          disabled={isUpdating || item.quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAdjustStock(item.id, 10)}
                          disabled={isUpdating}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
