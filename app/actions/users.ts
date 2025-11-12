"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getCurrentUser } from "./auth"

export async function getAllUsers() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "No autorizado" }
    }

    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, role, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[app] Error fetching users:", error)
      return { success: false, error: "Error al obtener usuarios" }
    }

    return { success: true, users }
  } catch (error) {
    console.error("[app] Error in getAllUsers:", error)
    return { success: false, error: "Error al obtener usuarios" }
  }
}

export async function createUser(username: string, password: string, role: "waiter" | "admin" = "waiter") {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "No autorizado" }
    }

    // Validate inputs
    if (!username || username.length < 3) {
      return { success: false, error: "El nombre de usuario debe tener al menos 3 caracteres" }
    }

    if (!password || password.length < 4) {
      return { success: false, error: "La contraseña debe tener al menos 4 caracteres" }
    }

    const supabase = await createAdminClient()

    const { data: existingUser } = await supabase.from("users").select("id").eq("username", username).maybeSingle()

    if (existingUser) {
      return { success: false, error: "El nombre de usuario ya existe" }
    }

    // Insert user with hashed password
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        username,
        password_hash: "", // Empty initially, will be hashed next
        role,
      })
      .select("id, username, role, created_at")
      .single()

    if (error) {
      console.error("[app] Error creating user:", error)
      return { success: false, error: "Error al crear usuario" }
    }

    // Hash the password using the database function
    const { error: hashError } = await supabase.rpc("hash_password_for_user", {
      user_id: newUser.id,
      plain_password: password,
    })

    if (hashError) {
      console.error("[app] Error hashing password:", hashError)
      // If hashing fails, delete the user
      await supabase.from("users").delete().eq("id", newUser.id)
      return { success: false, error: "Error al crear usuario" }
    }

    return { success: true, user: newUser }
  } catch (error) {
    console.error("[app] Error in createUser:", error)
    return { success: false, error: "Error al crear usuario" }
  }
}

export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "No autorizado" }
    }

    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: "La contraseña debe tener al menos 4 caracteres" }
    }

    const supabase = await createAdminClient()

    // Update password using the database function
    const { error } = await supabase.rpc("hash_password_for_user", {
      user_id: userId,
      plain_password: newPassword,
    })

    if (error) {
      console.error("[app] Error updating password:", error)
      return { success: false, error: "Error al actualizar contraseña" }
    }

    return { success: true }
  } catch (error) {
    console.error("[app] Error in updateUserPassword:", error)
    return { success: false, error: "Error al actualizar contraseña" }
  }
}

export async function deleteUser(userId: string) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "No autorizado" }
    }

    // Prevent deleting yourself
    if (currentUser.id === userId) {
      return { success: false, error: "No puedes eliminar tu propia cuenta" }
    }

    const supabase = await createAdminClient()

    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      console.error("[app] Error deleting user:", error)
      return { success: false, error: "Error al eliminar usuario" }
    }

    return { success: true }
  } catch (error) {
    console.error("[app] Error in deleteUser:", error)
    return { success: false, error: "Error al eliminar usuario" }
  }
}
