import { describe, it, expect, beforeEach } from "@jest/globals"
import { getTables, releaseTable } from "@/app/actions/tables"
import { createOrder } from "@/app/actions/orders"
import { db } from "@/lib/db"

describe("Table Management Tests", () => {
  beforeEach(() => {
    db.reset()
  })

  it("should get all 12 tables", async () => {
    const tables = await getTables()
    expect(tables.length).toBe(12)
  })

  it("should have correct table numbers", async () => {
    const tables = await getTables()
    expect(tables[0].number).toBe(1)
    expect(tables[11].number).toBe(12)
  })

  it("should have correct initial capacities", async () => {
    const tables = await getTables()
    const table1 = tables.find((t) => t.number === 1)
    expect(table1?.capacity).toBe(2)
  })

  it("should mark table as occupied when order is created", async () => {
    const result = await createOrder(1, [{ menuItemId: 1, quantity: 1 }])
    expect(result.success).toBe(true)

    const tables = await getTables()
    const table = tables.find((t) => t.number === 1)
    expect(table?.status).toBe("occupied")
    expect(table?.currentOrderId).toBe(result.orderId)
  })

  it("should release table successfully", async () => {
    // Create order
    const orderResult = await createOrder(1, [{ menuItemId: 1, quantity: 1 }])

    // Release table
    const releaseResult = await releaseTable(1, orderResult.orderId!)
    expect(releaseResult.success).toBe(true)

    // Verify table is available
    const tables = await getTables()
    const table = tables.find((t) => t.number === 1)
    expect(table?.status).toBe("available")
    expect(table?.currentOrderId).toBeNull()
  })

  it("should fail to release table with wrong order ID", async () => {
    await createOrder(1, [{ menuItemId: 1, quantity: 1 }])

    const result = await releaseTable(1, 999)
    expect(result.success).toBe(false)
  })
})
