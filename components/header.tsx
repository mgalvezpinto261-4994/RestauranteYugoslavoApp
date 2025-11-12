"use client"

import { Button } from "@/components/ui/button"
import { LogOut, UtensilsCrossed } from "@/components/icons"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { logout } from "@/app/actions/auth"

interface HeaderProps {
  userName: string
  userRole: string
}

export function Header({ userName, userRole }: HeaderProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
      router.push("/login")
      router.refresh()
    })
  }

  return (
    <header className="border-b bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-primary to-accent p-2.5 shadow-md">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                El Yugoslavo
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {userName} - {userRole === "admin" ? "Administrador" : "Mesero"}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            disabled={isPending}
            className="border-primary/30 hover:bg-primary/10 hover:border-primary/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isPending ? "Cerrando..." : "Cerrar Sesión"}
          </Button>
        </div>
      </div>
    </header>
  )
}
