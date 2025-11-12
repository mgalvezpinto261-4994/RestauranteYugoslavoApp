import { describe, it, expect, beforeEach } from "@jest/globals"
import { createOrder, addItemsToOrder, getOrder } from "@/app/actions/orders"
import { db } from "@/lib/db"

describe("Order Management Tests", () => {
  beforeEach(() => {
    db.reset()
  })

  it("should create order successfully", async () => {
    const result = await createOrder(1, [{ menuItemId: 1, quantity: 2 }])

    expect(result.success).toBe(true)
    expect(result.orderId).toBeDefined()
  })

  it("should calculate correct total for single item", async () => {
    const result = await createOrder(1, [
      { menuItemId: 1, quantity: 2 }, // Empanadas: 2 * 2500 = 5000
    ])

    const order = await getOrder(result.orderId!)
    expect(order?.total).toBe(5000)
  })

  it("should calculate correct total for multiple items", async () => {
    const result = await createOrder(1, [
      { menuItemId: 1, quantity: 2 }, // 2 * 2500 = 5000
      { menuItemId: 2, quantity: 1 }, // 1 * 8500 = 8500
    ])

    const order = await getOrder(result.orderId!)
    expect(order?.total).toBe(13500)
  })

  it("should add items to existing order", async () => {
    const createResult = await createOrder(1, [{ menuItemId: 1, quantity: 1 }])

    const addResult = await addItemsToOrder(createResult.orderId!, [{ menuItemId: 2, quantity: 1 }])

    expect(addResult.success).toBe(true)

    const order = await getOrder(createResult.orderId!)
    expect(order?.items.length).toBe(2)
  })

  it("should update total when adding items", async () => {
    const createResult = await createOrder(1, [
      { menuItemId: 1, quantity: 1 }, // 2500
    ])

    await addItemsToOrder(createResult.orderId!, [
      { menuItemId: 2, quantity: 1 }, // 8500
    ])

    const order = await getOrder(createResult.orderId!)
    expect(order?.total).toBe(11000)
  })

  it("should fail with invalid table number", async () => {
    const result = await createOrder(999, [{ menuItemId: 1, quantity: 1 }])

    expect(result.success).toBe(false)
    expect(result.error).toContain("Mesa no encontrada")
  })

  it("should fail when table is already occupied", async () => {
    await createOrder(1, [{ menuItemId: 1, quantity: 1 }])

    const result = await createOrder(1, [{ menuItemId: 2, quantity: 1 }])

    expect(result.success).toBe(false)
    expect(result.error).toContain("ocupada")
  })
})
