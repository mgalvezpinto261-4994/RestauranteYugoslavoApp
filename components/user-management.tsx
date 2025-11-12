"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Trash2, KeyRound, Users, AlertTriangle } from "lucide-react"
import { getAllUsers, createUser, updateUserPassword, deleteUser } from "@/app/actions/users"
import { useRouter } from "next/navigation"

type User = {
  id: string
  username: string
  role: string
  created_at: string
}

export function UserManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newUserRole, setNewUserRole] = useState<"admin" | "waiter">("waiter")
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null)
  const [newPasswordForUser, setNewPasswordForUser] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const result = await getAllUsers()
    if (result.success && result.users) {
      setUsers(result.users)
    }
    setLoading(false)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await createUser(newUsername, newPassword, newUserRole)

    if (result.success) {
      setNewUsername("")
      setNewPassword("")
      setNewUserRole("waiter")
      await loadUsers()
      router.refresh()
      toast({
        title: "Usuario creado",
        description: `El ${newUserRole === "admin" ? "administrador" : "mesero"} "${newUsername}" fue creado exitosamente.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Error al crear usuario",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePassword = async (userId: string) => {
    const result = await updateUserPassword(userId, newPasswordForUser)

    if (result.success) {
      setEditingPasswordUserId(null)
      setNewPasswordForUser("")
      toast({
        title: "Contraseña actualizada",
        description: "La contraseña fue actualizada correctamente.",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Error al actualizar contraseña",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string, username: string) => {
    setUserToDelete({ id: userId, username })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    const result = await deleteUser(userToDelete.id)

    if (result.success) {
      await loadUsers()
      toast({
        title: "Usuario eliminado",
        description: `El usuario "${userToDelete.username}" fue eliminado correctamente.`,
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Error al eliminar usuario",
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      </div>

      {/* Create User Form */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Crear Nuevo Usuario
        </h3>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="usuario123"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={newUserRole} onValueChange={(value: "admin" | "waiter") => setNewUserRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waiter">Mesero</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Crear Usuario
          </Button>
        </form>
      </Card>

      {/* Users List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usuarios Registrados</h3>
        {loading ? (
          <p className="text-muted-foreground">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No hay usuarios registrados</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{user.username}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Mesero"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Creado: {new Date(user.created_at).toLocaleDateString("es-CL")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editingPasswordUserId === user.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={newPasswordForUser}
                        onChange={(e) => setNewPasswordForUser(e.target.value)}
                        className="w-40"
                        minLength={4}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdatePassword(user.id)}
                        disabled={newPasswordForUser.length < 4}
                      >
                        Guardar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPasswordUserId(null)
                          setNewPasswordForUser("")
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingPasswordUserId(user.id)}>
                        <KeyRound className="h-4 w-4 mr-1" />
                        Cambiar Contraseña
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              ¿Estás seguro de eliminar al usuario{" "}
              <span className="font-semibold text-foreground">"{userToDelete?.username}"</span>?
              <br />
              <br />
              Esta acción no se puede deshacer y el usuario no podrá acceder más al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar Usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
