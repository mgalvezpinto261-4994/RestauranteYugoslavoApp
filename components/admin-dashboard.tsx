"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { TableGrid } from "./table-grid"
import { ActiveOrdersList } from "./active-orders-list"
import { SalesReports } from "./sales-reports"
import { InventoryManagement } from "./inventory-management"
import { OrderForm } from "./order-form"
import { TableManagement } from "./table-management"
import { UserManagement } from "./user-management"
import type { Table, Order, InventoryItem, MenuItem } from "@/lib/db"
import {
  LayoutGrid,
  ClipboardList,
  BarChart3,
  DollarSign,
  RefreshCw,
  Package,
  UtensilsCrossed,
} from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { getTables } from "@/app/actions/tables"
import { getActiveOrders, getActiveOrderForTable } from "@/app/actions/orders"
import { getAllInventoryItems } from "@/app/actions/inventory"

interface AdminDashboardProps {
  tables: Table[]
  orders: Order[]
  inventoryItems: InventoryItem[]
  menuItems: MenuItem[]
}

export function AdminDashboard({
  tables: initialTables,
  orders: initialOrders,
  inventoryItems: initialInventoryItems,
  menuItems,
}: AdminDashboardProps) {
  console.log("[v0] AdminDashboard initializing with tables:", initialTables)
  console.log("[v0] First table in AdminDashboard:", initialTables[0])
  console.log("[v0] AdminDashboard orders:", initialOrders.length)

  const [tables, setTables] = useState(initialTables)
  const [orders, setOrders] = useState(initialOrders)
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [existingOrder, setExistingOrder] = useState<Order | null>(null)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    console.log("[v0] Admin refreshing data...")

    try {
      const [tablesResult, ordersResult, inventoryResult] = await Promise.all([
        getTables(),
        getActiveOrders(),
        getAllInventoryItems(),
      ])

      if (tablesResult.success && tablesResult.tables) {
        console.log("[v0] Tables refreshed:", tablesResult.tables)
        console.log("[v0] First refreshed table:", tablesResult.tables[0])
        setTables(tablesResult.tables)
      }

      if (ordersResult.success && ordersResult.orders) {
        setOrders(ordersResult.orders)
        console.log("[v0] Orders updated:", ordersResult.orders.length)
      }

      if (inventoryResult.success && inventoryResult.items) {
        setInventoryItems(inventoryResult.items)
        console.log("[v0] Inventory updated:", inventoryResult.items.length)
      }
    } catch (error) {
      console.error("[v0] Error refreshing data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleTableSelect = async (table: Table) => {
    const currentTable = tables.find((t) => t.id === table.id) || table
    console.log("[v0] Admin selected table:", currentTable)
    setSelectedTable(currentTable)

    setLoadingOrder(true)
    try {
      const result = await getActiveOrderForTable(currentTable.id)
      if (result.success && result.order) {
        setExistingOrder(result.order)
        console.log("[v0] Admin loaded existing order:", result.order)
      } else {
        setExistingOrder(null)
        console.log("[v0] No existing order for table")
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
    console.log("[v0] Admin order completed, refreshing...")
    await handleRefresh()
    setShowOrderForm(false)
    setSelectedTable(null)
    setExistingOrder(null)
  }

  const handleBackToTables = () => {
    setShowOrderForm(false)
    setSelectedTable(null)
    setExistingOrder(null)
  }

  const occupiedTables = tables.filter((t) => t.status === "occupied").length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const lowStockCount = inventoryItems.filter((item) => item.quantity <= item.min_quantity).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Panel de Administración
          </h2>
          <p className="text-muted-foreground mt-1 font-medium">Gestiona mesas, pedidos y visualiza reportes</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mesas Ocupadas</CardTitle>
            <div className="rounded-full bg-primary/20 p-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {occupiedTables} / {tables.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((occupiedTables / tables.length) * 100).toFixed(0)}% de ocupación
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 via-card to-accent/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
            <div className="rounded-full bg-accent/20 p-2">
              <ClipboardList className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pedidos en proceso</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 via-card to-secondary/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Activos</CardTitle>
            <div className="rounded-full bg-secondary/20 p-2">
              <DollarSign className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">De pedidos activos</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-accent/10 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Mesa</CardTitle>
            <div className="rounded-full bg-primary/20 p-2">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {orders.length > 0 ? formatCurrency(totalRevenue / orders.length) : formatCurrency(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ticket promedio</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid w-full max-w-5xl grid-cols-6">
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Mesas
            <Badge variant="secondary" className="ml-1">
              {occupiedTables}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="create-order" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Tomar Pedidos
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Pedidos
            <Badge variant="secondary" className="ml-1">
              {orders.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventario
            {lowStockCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {lowStockCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reportes
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="mt-6">
          <div className="space-y-6">
            <TableManagement />
            <Card>
              <CardHeader>
                <CardTitle>Estado de Mesas</CardTitle>
                <CardDescription>Haz clic en una mesa ocupada para liberarla y marcar como pagada</CardDescription>
              </CardHeader>
              <CardContent>
                <TableGrid tables={tables} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create-order" className="mt-6">
          {loadingOrder ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <p>Cargando información del pedido...</p>
                </div>
              </CardContent>
            </Card>
          ) : !showOrderForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Tomar Pedido</CardTitle>
                <CardDescription>Selecciona una mesa para crear o agregar items a un pedido</CardDescription>
              </CardHeader>
              <CardContent>
                <TableGrid tables={tables} onTableSelect={handleTableSelect} selectedTableId={selectedTable?.id} />
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
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <ActiveOrdersList orders={orders} showPayButton={true} />
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <InventoryManagement items={inventoryItems} onUpdate={handleRefresh} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <SalesReports />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
