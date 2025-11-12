"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/app/actions/auth"
import { UtensilsCrossed } from "@/components/icons"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(username, password)

      // Si hay un resultado y no fue exitoso, mostrar error
      if (result && !result.success) {
        setError(result.error || "Error al iniciar sesión")
        setIsLoading(false)
      }
      // Si no hay resultado, significa que el redirect fue exitoso
      // (redirect() lanza una excepción que es normal en Next.js)
    } catch (err: any) {
      // Next.js redirect() lanza una excepción especial con digest "NEXT_REDIRECT"
      // Verificamos si es un redirect exitoso o un error real
      const isRedirect = 
        err?.digest?.startsWith("NEXT_REDIRECT") || 
        err?.digest?.includes("NEXT_REDIRECT") ||
        err?.message?.includes("NEXT_REDIRECT") ||
        (err?.name === "NEXT_REDIRECT") ||
        // En algunos casos, el error puede tener una estructura diferente
        (typeof err === "object" && err !== null && "digest" in err && String(err.digest).includes("redirect"))
      
      if (isRedirect) {
        // Es un redirect exitoso, no mostrar error
        // El redirect se procesará automáticamente por Next.js
        return
      }
      
      // Es un error real
      console.error("[app] Login error:", err)
      setError("Error al iniciar sesión. Por favor, intenta nuevamente.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card via-card to-secondary/5">
      <CardHeader className="space-y-4 text-center bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-t-lg pb-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-4 shadow-lg">
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            El Yugoslavo
          </CardTitle>
          <CardDescription className="mt-2 text-base font-medium">Sistema de Gestión de Restaurante</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin o mesero"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          <div className="mt-6 p-4 bg-muted rounded-md space-y-2 text-sm">
            <p className="font-semibold text-foreground">Usuarios de prueba:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Admin:</span> admin / admin123
              </p>
              <p>
                <span className="font-medium text-foreground">Mesero:</span> mesero / mesero123
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
