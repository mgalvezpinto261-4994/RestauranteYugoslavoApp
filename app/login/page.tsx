import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value)
      if (session.user.role === "admin") {
        redirect("/admin")
      } else {
        redirect("/waiter")
      }
    } catch {
      // Invalid session, continue to login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  )
}
