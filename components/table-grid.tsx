"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Table } from "@/lib/db"
import { Users, CheckCircle, ClipboardList } from "@/components/icons"
import { releaseTable } from "@/app/actions/tables"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface TableGridProps {
  tables: Table[]
  onTableSelect?: (table: Table) => void
  selectedTableId?: string
}

export function TableGrid({ tables, onTableSelect, selectedTableId }: TableGridProps) {
  const { toast } = useToast()
  const router = useRouter()

  console.log("[v0] TableGrid received tables:", tables)
  console.log("[v0] First table:", tables[0])

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md"
      case "occupied":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md"
      case "reserved":
        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 shadow-md"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "occupied":
        return "Ocupada"
      case "reserved":
        return "Reservada"
      default:
        return status
    }
  }

  const handleReleaseTable = async (e: React.MouseEvent, table: Table) => {
    e.stopPropagation()

    const result = await releaseTable(table.id)

    if (result.success) {
      toast({
        title: "Mesa liberada",
        description: `La Mesa ${table.number} ha sido marcada como pagada y liberada`,
      })
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo liberar la mesa",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => {
        console.log("[v0] Rendering table:", table.id, "Number:", table.number)

        return (
          <Card
            key={table.id}
            className={cn(
              "p-6 transition-all hover:shadow-xl border-2",
              onTableSelect && "cursor-pointer hover:scale-105 hover:-translate-y-1",
              selectedTableId === table.id && "ring-4 ring-primary ring-offset-2 shadow-2xl",
              table.status === "available" && "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-green-300 hover:border-green-400 shadow-green-200/50",
              table.status === "occupied" && "bg-gradient-to-br from-red-50 via-rose-50 to-red-100 border-red-300 hover:border-red-400 shadow-red-200/50",
              table.status === "reserved" && "bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-yellow-300 hover:border-yellow-400 shadow-yellow-200/50",
            )}
            onClick={() => onTableSelect?.(table)}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="text-5xl font-bold text-foreground">Mesa {table.number || table.table_number || "?"}</div>
              <Badge className={cn("text-xs font-medium", getStatusColor(table.status))}>
                {getStatusLabel(table.status)}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{table.capacity} personas</span>
              </div>

              {table.status === "occupied" && table.currentOrderId && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ClipboardList className="h-3 w-3" />
                  <span>Pedido #{table.currentOrderId.slice(-4)}</span>
                </div>
              )}

              {table.status === "occupied" && !onTableSelect && (
                <Button
                  size="sm"
                  variant="default"
                  className="w-full mt-2"
                  onClick={(e) => handleReleaseTable(e, table)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Liberar Mesa
                </Button>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
