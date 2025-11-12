"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "@/components/icons"
import { addTables } from "@/app/actions/tables"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function TableManagement() {
  const [capacity, setCapacity] = useState(4)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAddTables = async () => {
    setIsAdding(true)

    try {
      const result = await addTables(1, capacity)

      if (result.success) {
        toast({
          title: "Mesa agregada",
          description: `Se agregó 1 mesa de ${capacity} personas exitosamente`,
        })
        setCapacity(4)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo agregar la mesa",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al agregar la mesa",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Mesa</CardTitle>
        <CardDescription>La nueva mesa se numerará automáticamente de forma correlativa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="capacity">Capacidad (personas)</Label>
            <Select value={capacity.toString()} onValueChange={(value) => setCapacity(Number.parseInt(value))}>
              <SelectTrigger id="capacity">
                <SelectValue placeholder="Selecciona capacidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 personas</SelectItem>
                <SelectItem value="4">4 personas</SelectItem>
                <SelectItem value="6">6 personas</SelectItem>
                <SelectItem value="8">8 personas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddTables} disabled={isAdding} className="gap-2">
            <Plus className="h-4 w-4" />
            {isAdding ? "Agregando..." : "Agregar Mesa"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
