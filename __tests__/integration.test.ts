import { describe, it, expect, beforeEach } from "@jest/globals"
import { login } from "@/app/actions/auth"
import { createOrder, getOrder } from "@/app/actions/orders"
import { getTables, releaseTable } from "@/app/actions/tables"
import { getSalesReport } from "@/app/actions/reports"
import { getInventory } from "@/app/actions/inventory"
import { db } from "@/lib/db"

describe("Integration Tests - Full Workflow", () => {
  beforeEach(() => {
    db.reset()
  })

  it("should complete full waiter workflow", async () => {
    // 1. Login as waiter
    const loginResult = await login("mesero", "mesero123")
    expect(loginResult.success).toBe(true)

    // 2. Get available tables
    const tables = await getTables()
    const availableTable = tables.find((t) => t.status === "available")
    expect(availableTable).toBeDefined()

    // 3. Create order
    const orderResult = await createOrder(availableTable!.number, [
      { menuItemId: 1, quantity: 2 },
      { menuItemId: 3, quantity: 1 },
    ])
    expect(orderResult.success).toBe(true)

    // 4. Verify table is occupied
    const updatedTables = await getTables()
    const occupiedTable = updatedTables.find((t) => t.number === availableTable!.number)
    expect(occupiedTable?.status).toBe("occupied")

    // 5. Verify order exists
    const order = await getOrder(orderResult.orderId!)
    expect(order).toBeDefined()
    expect(order?.items.length).toBe(2)
  })

  it("should complete full admin workflow", async () => {
    // 1. Login as admin
    const loginResult = await login("admin", "admin123")
    expect(loginResult.success).toBe(true)

    // 2. Create order as admin
    const orderResult = await createOrder(1, [{ menuItemId: 1, quantity: 1 }])
    expect(orderResult.success).toBe(true)

    // 3. Release table (mark as paid)
    const releaseResult = await releaseTable(1, orderResult.orderId!)
    expect(releaseResult.success).toBe(true)

    // 4. Check sales report
    const report = await getSalesReport("day")
    expect(report.orderCount).toBe(1)
    expect(report.totalSales).toBeGreaterThan(0)

    // 5. Check inventory
    const inventory = await getInventory()
    expect(inventory.length).toBeGreaterThan(0)
  })

  it("should share data between waiter and admin", async () => {
    // Waiter creates order
    await login("mesero", "mesero123")
    const orderResult = await createOrder(1, [{ menuItemId: 1, quantity: 1 }])

    // Admin should see the order
    await login("admin", "admin123")
    const tables = await getTables()
    const table = tables.find((t) => t.number === 1)

    expect(table?.status).toBe("occupied")
    expect(table?.currentOrderId).toBe(orderResult.orderId)

    const order = await getOrder(orderResult.orderId!)
    expect(order).toBeDefined()
  })

  it("should handle inventory deduction across multiple orders", async () => {
    const inventoryBefore = await getInventory()
    const harinaBefore = inventoryBefore.find((i) => i.name === "Harina")!

    // Create multiple orders
    await createOrder(1, [{ menuItemId: 1, quantity: 2 }])
    await createOrder(2, [{ menuItemId: 1, quantity: 3 }])

    const inventoryAfter = await getInventory()
    const harinaAfter = inventoryAfter.find((i) => i.name === "Harina")!

    // Total: (2 + 3) * 0.2kg = 1kg deducted
    expect(harinaAfter.quantity).toBe(harinaBefore.quantity - 1)
  })
})
