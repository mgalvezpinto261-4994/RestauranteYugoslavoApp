import { db, type UserRole } from "./db"

export interface Session {
  user: {
    id: string
    username: string
    name: string
    role: UserRole
  }
}

// Simple session storage (in production, use proper session management)
const sessions = new Map<string, Session>()

export function login(username: string, password: string): Session | null {
  const user = db.getUser(username)

  if (user && user.password === password) {
    const session: Session = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    }

    // Store session with username as key
    sessions.set(username, session)

    return session
  }

  return null
}

export function logout(username: string): void {
  sessions.delete(username)
}

export function getSession(username: string): Session | null {
  return sessions.get(username) || null
}
