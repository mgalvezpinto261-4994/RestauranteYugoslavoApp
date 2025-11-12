"use client"

import { useState } from "react"
import { TableGrid } from "./table-grid"
import { OrderForm } from "./order-form"
import type { Table, MenuItem, Order } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid } from "@/components/icons"
import { getActiveOrderForTable } from "@/app/actions/orders"
import { useRouter } from "next/navigation"

interface WaiterDashboardProps {
  tables: Table[]
  menuItems: MenuItem[]
}

export function WaiterDashboard({ tables: initialTables, menuItems }: WaiterDashboardProps) {
  const router = useRouter()
  const [tables, setTables] = useState(initialTables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [existingOrder, setExistingOrder] = useState<Order | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(false)

  const refreshTables = async () => {
    router.refresh()
  }

  const handleTableSelect = async (table: Table) => {
    const currentTable = tables.find((t) => t.id === table.id) || table
    setSelectedTable(currentTable)

    setLoadingOrder(true)
    try {
      const result = await getActiveOrderForTable(currentTable.id)
      if (result.success && result.order) {
        setExistingOrder(result.order)
      } else {
        setExistingOrder(null)
      }
    } catch (error) {
      console.error("[v0] Error loading order:", error)
      setExistingOrder(null)
    } finally {
      setLoadingOrder(false)
    }

    setShowOrderForm(true)
  }

  const handleOrderComplete = async () => {
    setShowOrderForm(false)
    setSelectedTable(null)
    setExistingOrder(null)

    await refreshTables()
  }

  const handleBackToTables = () => {
    setShowOrderForm(false)
    setSelectedTable(null)
    setExistingOrder(null)
  }

  if (loadingOrder) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Panel de Mesero</h2>
          <p className="text-muted-foreground mt-1">Cargando información del pedido...</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>Cargando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Panel de Mesero
        </h2>
        <p className="text-muted-foreground mt-1 font-medium">
          {showOrderForm && selectedTable
            ? `Tomando pedido para Mesa ${selectedTable.number || selectedTable.table_number || "?"}`
            : "Selecciona una mesa para tomar un pedido"}
        </p>
      </div>

      {!showOrderForm ? (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-primary/5 to-accent/5 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-primary">
              <LayoutGrid className="h-5 w-5" />
              Mesas Disponibles
            </CardTitle>
            <CardDescription className="font-medium">Haz clic en una mesa para tomar un pedido</CardDescription>
          </CardHeader>
          <CardContent>
            {router.isFallback ? (
              <div className="text-center py-8 text-muted-foreground">Actualizando mesas...</div>
            ) : (
              <TableGrid tables={tables} onTableSelect={handleTableSelect} selectedTableId={selectedTable?.id} />
            )}
          </CardContent>
        </Card>
      ) : (
        selectedTable && (
          <div className="space-y-4">
            <button
              onClick={handleBackToTables}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              ← Volver a mesas
            </button>
            <OrderForm
              table={selectedTable}
              menuItems={menuItems}
              existingOrder={existingOrder}
              onComplete={handleOrderComplete}
            />
          </div>
        )
      )}
    </div>
  )
}
