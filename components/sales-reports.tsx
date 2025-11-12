"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, DollarSign, ShoppingBag, RefreshCw, BarChart3 } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getSalesReport } from "@/app/actions/reports"

export function SalesReports() {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("day")
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const loadReport = async () => {
    setLoading(true)
    try {
      const result = await getSalesReport(period)
      if (result.success && result.report) {
        setReport(result.report)
      } else {
        console.error("Error loading report:", result.error)
      }
    } catch (error) {
      console.error("Error loading sales report:", error)
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPeriodLabel = (p: string) => {
    switch (p) {
      case "day":
        return "Hoy"
      case "week":
        return "Esta Semana"
      case "month":
        return "Este Mes"
      case "year":
        return "Este Año"
      default:
        return p
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes de Ventas</CardTitle>
          <CardDescription>Visualiza las ventas por período</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={period}
            onValueChange={(v) => {
              setPeriod(v as "day" | "week" | "month" | "year")
              setReport(null)
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="day">Día</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mes</TabsTrigger>
                <TabsTrigger value="year">Año</TabsTrigger>
              </TabsList>
              <Button onClick={loadReport} disabled={loading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Cargando..." : "Cargar Reporte"}
              </Button>
            </div>

            <div className="mt-6">
              {!report && !loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Haz clic en "Cargar Reporte" para ver las ventas</p>
                </div>
              ) : loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Cargando reporte...</p>
                </div>
              ) : report ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Período</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{getPeriodLabel(report.period)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{formatCurrency(report.totalSales)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos Pagados</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{report.orderCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Promedio:{" "}
                          {report.orderCount > 0
                            ? formatCurrency(report.totalSales / report.orderCount)
                            : formatCurrency(0)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {report.orders.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Detalle de Pedidos Pagados</CardTitle>
                        <CardDescription>Lista de pedidos completados en el período seleccionado</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {report.orders.map((order: any) => (
                              <Card key={order.id}>
                                <CardContent className="pt-6">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <Badge variant="secondary">Mesa {order.tableNumber}</Badge>
                                      <span className="text-sm text-muted-foreground">{order.waiterName}</span>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-accent">{formatCurrency(order.total)}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {formatDate(order.paidAt || order.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                  <Separator className="my-3" />
                                  <div className="space-y-1">
                                    {order.items.map((item: any) => (
                                      <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                          {item.quantity}x {item.menuItemName}
                                        </span>
                                        <span className="font-medium">
                                          {formatCurrency(item.price * item.quantity)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-12">
                        <div className="text-center text-muted-foreground">
                          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No hay ventas registradas en este período</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : null}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
