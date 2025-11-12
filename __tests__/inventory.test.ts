import { describe, it, expect, beforeEach } from "@jest/globals"
import { getInventoryDirect, updateInventoryItemDirect } from "@/app/actions/inventory"
import { createOrder } from "@/app/actions/orders"
import { db } from "@/lib/db"

describe("Inventory Management Tests", () => {
  beforeEach(() => {
    db.reset()
  })

  it("should get all inventory items", async () => {
    const inventory = getInventoryDirect()
    expect(inventory.length).toBeGreaterThan(0)
    expect(inventory[0]).toHaveProperty("name")
    expect(inventory[0]).toHaveProperty("quantity")
    expect(inventory[0]).toHaveProperty("unit")
  })

  it("should update inventory quantity", async () => {
    const inventory = getInventoryDirect()
    const item = inventory[0]
    const newQuantity = item.quantity + 10

    const result = await updateInventoryItemDirect(item.id, newQuantity)
    expect(result.success).toBe(true)

    const updated = getInventoryDirect()
    const updatedItem = updated.find((i) => i.id === item.id)
    expect(updatedItem?.quantity).toBe(newQuantity)
  })

  it("should deduct inventory when creating order", async () => {
    const before = getInventoryDirect()
    const harina = before.find((i) => i.name === "Harina")!
    const initialQty = harina.quantity

    // Create order with Empanadas (uses 0.2kg harina per unit)
    await createOrder(1, [{ menuItemId: 1, quantity: 5 }])

    const after = getInventoryDirect()
    const harinaAfter = after.find((i) => i.name === "Harina")!

    expect(harinaAfter.quantity).toBe(initialQty - 1) // 5 * 0.2 = 1kg
  })

  it("should fail when insufficient stock", async () => {
    const inventory = getInventoryDirect()
    const harina = inventory.find((i) => i.name === "Harina")!

    // Set very low stock
    await updateInventoryItemDirect(harina.id, 0.05)

    // Try to order 10 empanadas (needs 2kg harina)
    const result = await createOrder(1, [{ menuItemId: 1, quantity: 10 }])

    expect(result.success).toBe(false)
    expect(result.error).toContain("stock")
  })

  it("should identify low stock items", async () => {
    const inventory = getInventoryDirect()
    const item = inventory[0]

    // Set below minimum
    await updateInventoryItemDirect(item.id, item.minStock - 1)

    const updated = getInventoryDirect()
    const lowStockItem = updated.find((i) => i.id === item.id)!

    expect(lowStockItem.quantity).toBeLessThan(lowStockItem.minStock)
  })
})
