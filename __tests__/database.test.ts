import { describe, it, expect } from "@jest/globals"
import { db } from "@/lib/db"

describe("Database Tests", () => {
  describe("User Management", () => {
    it("should retrieve admin user", () => {
      const admin = db.getUser("admin")
      expect(admin).toBeDefined()
      expect(admin?.role).toBe("admin")
      expect(admin?.username).toBe("admin")
    })

    it("should retrieve waiter user", () => {
      const waiter = db.getUser("mesero")
      expect(waiter).toBeDefined()
      expect(waiter?.role).toBe("waiter")
      expect(waiter?.username).toBe("mesero")
    })

    it("should return undefined for non-existent user", () => {
      const user = db.getUser("nonexistent")
      expect(user).toBeUndefined()
    })
  })

  describe("Table Management", () => {
    it("should have 12 tables initialized", () => {
      const tables = db.getAllTables()
      expect(tables).toHaveLength(12)
    })

    it("should update table status", () => {
      const table = db.getTable("table-1")
      expect(table).toBeDefined()

      const updated = db.updateTable("table-1", { status: "occupied" })
      expect(updated?.status).toBe("occupied")
    })

    it("should maintain table updates across retrievals", () => {
      db.updateTable("table-2", { status: "reserved", currentOrderId: "test-order" })
      const table = db.getTable("table-2")
      expect(table?.status).toBe("reserved")
      expect(table?.currentOrderId).toBe("test-order")
    })
  })

  describe("Menu Items", () => {
    it("should have menu items with ingredients", () => {
      const menuItems = db.getAllMenuItems()
      expect(menuItems.length).toBeGreaterThan(0)

      const itemWithIngredients = menuItems.find((item) => item.ingredients && item.ingredients.length > 0)
      expect(itemWithIngredients).toBeDefined()
    })

    it("should retrieve specific menu item", () => {
      const item = db.getMenuItem("menu-1")
      expect(item).toBeDefined()
      expect(item?.name).toBe("Empanadas de Pino")
    })
  })

  describe("Order Management", () => {
    it("should create and retrieve order", () => {
      const order = {
        id: "test-order-1",
        tableId: "table-1",
        tableNumber: 1,
        items: [
          {
            id: "item-1",
            menuItemId: "menu-1",
            menuItemName: "Test Item",
            quantity: 2,
            price: 5000,
          },
        ],
        total: 10000,
        status: "active" as const,
        createdAt: new Date(),
        waiterId: "mesero",
        waiterName: "Juan Pérez",
      }

      const created = db.createOrder(order)
      expect(created).toEqual(order)

      const retrieved = db.getOrder("test-order-1")
      expect(retrieved).toEqual(order)
    })

    it("should filter active orders", () => {
      const activeOrders = db.getActiveOrders()
      expect(Array.isArray(activeOrders)).toBe(true)
      activeOrders.forEach((order) => {
        expect(order.status).toBe("active")
      })
    })

    it("should update order status", () => {
      const order = {
        id: "test-order-2",
        tableId: "table-2",
        tableNumber: 2,
        items: [],
        total: 5000,
        status: "active" as const,
        createdAt: new Date(),
        waiterId: "mesero",
        waiterName: "Juan Pérez",
      }

      db.createOrder(order)
      const updated = db.updateOrder("test-order-2", { status: "paid", paidAt: new Date() })

      expect(updated?.status).toBe("paid")
      expect(updated?.paidAt).toBeDefined()
    })
  })

  describe("Inventory Management", () => {
    it("should have inventory items initialized", () => {
      const items = db.getAllInventoryItems()
      expect(items.length).toBeGreaterThan(0)
    })

    it("should check stock availability for menu item", () => {
      const result = db.checkMenuItemStock("menu-1", 1)
      expect(result).toHaveProperty("available")
      expect(result).toHaveProperty("missingItems")
    })

    it("should deduct inventory when order is placed", () => {
      const inventoryItem = db.getInventoryItem("inv-1")
      const initialStock = inventoryItem?.currentStock || 0

      const success = db.deductInventoryForOrder("menu-1", 1)
      expect(success).toBe(true)

      const updatedItem = db.getInventoryItem("inv-1")
      expect(updatedItem?.currentStock).toBeLessThan(initialStock)
    })

    it("should identify low stock items", () => {
      // Set an item to low stock
      db.updateInventoryItem("inv-1", { currentStock: 5, minStock: 10 })

      const lowStockItems = db.getLowStockItems()
      expect(lowStockItems.length).toBeGreaterThan(0)

      const lowItem = lowStockItems.find((item) => item.id === "inv-1")
      expect(lowItem).toBeDefined()
    })

    it("should prevent order if insufficient stock", () => {
      // Set stock to 0
      db.updateInventoryItem("inv-1", { currentStock: 0 })

      const result = db.checkMenuItemStock("menu-1", 1)
      expect(result.available).toBe(false)
      expect(result.missingItems.length).toBeGreaterThan(0)
    })
  })

  describe("Data Persistence", () => {
    it("should maintain data across multiple operations", () => {
      // Create order
      const order = {
        id: "persistence-test",
        tableId: "table-3",
        tableNumber: 3,
        items: [],
        total: 15000,
        status: "active" as const,
        createdAt: new Date(),
        waiterId: "admin",
        waiterName: "Administrador",
      }
      db.createOrder(order)

      // Update table
      db.updateTable("table-3", { status: "occupied", currentOrderId: "persistence-test" })

      // Verify both persist
      const retrievedOrder = db.getOrder("persistence-test")
      const retrievedTable = db.getTable("table-3")

      expect(retrievedOrder).toBeDefined()
      expect(retrievedTable?.currentOrderId).toBe("persistence-test")
      expect(retrievedTable?.status).toBe("occupied")
    })
  })
})
