import { describe, it, expect, beforeEach } from "@jest/globals"
import { login } from "@/app/actions/auth"
import { db } from "@/lib/db"

describe("Authentication Tests", () => {
  beforeEach(() => {
    db.reset()
  })

  it("should login with valid admin credentials", async () => {
    const result = await login("admin", "admin123")
    expect(result.success).toBe(true)
    expect(result.user?.role).toBe("admin")
    expect(result.user?.username).toBe("admin")
  })

  it("should login with valid waiter credentials", async () => {
    const result = await login("mesero", "mesero123")
    expect(result.success).toBe(true)
    expect(result.user?.role).toBe("waiter")
    expect(result.user?.username).toBe("mesero")
  })

  it("should fail with invalid username", async () => {
    const result = await login("invalid", "admin123")
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it("should fail with invalid password", async () => {
    const result = await login("admin", "wrongpassword")
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it("should fail with empty credentials", async () => {
    const result = await login("", "")
    expect(result.success).toBe(false)
  })
})
