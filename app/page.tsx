import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function Home() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    redirect("/login")
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    if (session.user.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/waiter")
    }
  } catch {
    redirect("/login")
  }
}
