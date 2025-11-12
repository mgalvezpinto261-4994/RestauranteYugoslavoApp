"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(username: string, password: string) {
  console.log("[app] Login attempt for username:", username)

  const supabase = await createClient()

  const { data: users, error } = await supabase.from("users").select("*").eq("username", username)

  console.log("[app] Query result:", { users, error })

  if (error || !users || users.length === 0) {
    console.log("[app] User not found or error:", error)
    return { success: false, error: "Credenciales inválidas" }
  }

  const user = users[0]

  // Verify password using PostgreSQL's crypt function
  const { data: passwordCheck, error: passwordError } = await supabase.rpc("verify_password", {
    username_input: username,
    password_input: password,
  })

  console.log("[app] Password verification:", { passwordCheck, passwordError })

  if (passwordError || !passwordCheck) {
    console.log("[app] Password verification failed")
    return { success: false, error: "Credenciales inválidas" }
  }

  const session = {
    user: {
      id: user.id,
      name: username,
      role: user.role,
    },
    role: user.role,
  }

  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  console.log("[app] Login successful, redirecting to:", user.role === "admin" ? "/admin" : "/waiter")

  // Redirect based on role
  if (user.role === "admin") {
    redirect("/admin")
  } else {
    redirect("/waiter")
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  return { success: true }
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (sessionCookie) {
    try {
      return JSON.parse(sessionCookie.value)
    } catch {
      return null
    }
  }

  return null
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session || !session.user) {
    return null
  }

  return {
    id: session.user.id,
    username: session.user.name,
    role: session.user.role,
  }
}
