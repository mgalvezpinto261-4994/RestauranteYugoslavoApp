// In-memory database simulation (H2-style)
export type UserRole = "admin" | "waiter"

export interface User {
  id: string
  username: string
  password: string
  role: UserRole
  name: string
}

export interface Table {
  id: string
  number: number
  status: "available" | "occupied" | "reserved"
  capacity: number
  currentOrderId?: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
  category: string
  available: boolean
  ingredients?: Array<{
    inventoryItemId: string
    quantity: number // cantidad que se consume por cada unidad del plato
  }>
}

export interface OrderItem {
  id: string
  menuItemId: string
  menuItemName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  tableId: string
  tableNumber: number
  items: OrderItem[]
  total: number
  status: "active" | "paid"
  createdAt: Date
  paidAt?: Date
  waiterId: string
  waiterName: string
}

export interface InventoryItem {
  id: string
  name: string
  unit: string // kg, litros, unidades, etc.
  quantity: number
  min_quantity: number
  category: string
  created_at?: Date
  updated_at?: Date
}

// In-memory storage
class Database {
  private users: Map<string, User> = new Map()
  private tables: Map<string, Table> = new Map()
  private menuItems: Map<string, MenuItem> = new Map()
  private orders: Map<string, Order> = new Map()
  private inventory: Map<string, InventoryItem> = new Map()
  private initialized = false

  constructor() {
    if (!this.initialized) {
      this.seedData()
      this.initialized = true
      console.log("[app] Database initialized with seed data")
    }
  }

  private seedData() {
    // Seed users
    this.users.set("admin", {
      id: "admin",
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "Administrador",
    })

    this.users.set("mesero", {
      id: "mesero",
      username: "mesero",
      password: "mesero123",
      role: "waiter",
      name: "Juan Pérez",
    })

    // Seed tables
    for (let i = 1; i <= 12; i++) {
      this.tables.set(`table-${i}`, {
        id: `table-${i}`,
        number: i,
        status: "available",
        capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
      })
    }

    // Seed menu items
    const menuData = [
      {
        name: "Empanadas de Pino",
        price: 3500,
        category: "Entradas",
        ingredients: [
          { inventoryItemId: "inv-1", quantity: 0.15 }, // Carne de Res
          { inventoryItemId: "inv-5", quantity: 0.05 }, // Cebollas
          { inventoryItemId: "inv-8", quantity: 0.1 }, // Harina
          { inventoryItemId: "inv-12", quantity: 1 }, // Huevos
        ],
      },
      {
        name: "Ceviche",
        price: 8500,
        category: "Entradas",
        ingredients: [
          { inventoryItemId: "inv-3", quantity: 0.2 }, // Pescado
          { inventoryItemId: "inv-5", quantity: 0.05 }, // Cebollas
          { inventoryItemId: "inv-4", quantity: 0.05 }, // Tomates
        ],
      },
      {
        name: "Pastel de Choclo",
        price: 9500,
        category: "Platos Principales",
        ingredients: [
          { inventoryItemId: "inv-1", quantity: 0.2 }, // Carne de Res
          { inventoryItemId: "inv-2", quantity: 0.1 }, // Pollo
          { inventoryItemId: "inv-5", quantity: 0.05 }, // Cebollas
          { inventoryItemId: "inv-12", quantity: 2 }, // Huevos
        ],
      },
      {
        name: "Cazuela",
        price: 8000,
        category: "Platos Principales",
        ingredients: [
          { inventoryItemId: "inv-1", quantity: 0.2 }, // Carne de Res
          { inventoryItemId: "inv-6", quantity: 0.2 }, // Papas
          { inventoryItemId: "inv-7", quantity: 0.1 }, // Arroz
        ],
      },
      {
        name: "Lomo a lo Pobre",
        price: 12500,
        category: "Platos Principales",
        ingredients: [
          { inventoryItemId: "inv-1", quantity: 0.3 }, // Carne de Res
          { inventoryItemId: "inv-6", quantity: 0.2 }, // Papas
          { inventoryItemId: "inv-12", quantity: 2 }, // Huevos
          { inventoryItemId: "inv-5", quantity: 0.05 }, // Cebollas
        ],
      },
      {
        name: "Completo",
        price: 4500,
        category: "Platos Principales",
        ingredients: [
          { inventoryItemId: "inv-4", quantity: 0.05 }, // Tomates
          { inventoryItemId: "inv-5", quantity: 0.02 }, // Cebollas
        ],
      },
      {
        name: "Sopaipillas",
        price: 2500,
        category: "Acompañamientos",
        ingredients: [
          { inventoryItemId: "inv-8", quantity: 0.15 }, // Harina
          { inventoryItemId: "inv-9", quantity: 0.02 }, // Aceite
        ],
      },
      {
        name: "Ensalada Chilena",
        price: 3000,
        category: "Acompañamientos",
        ingredients: [
          { inventoryItemId: "inv-4", quantity: 0.1 }, // Tomates
          { inventoryItemId: "inv-5", quantity: 0.05 }, // Cebollas
        ],
      },
      {
        name: "Mote con Huesillo",
        price: 2500,
        category: "Postres",
        ingredients: [
          { inventoryItemId: "inv-7", quantity: 0.1 }, // Arroz (mote)
        ],
      },
      {
        name: "Leche Asada",
        price: 3500,
        category: "Postres",
        ingredients: [
          { inventoryItemId: "inv-10", quantity: 0.3 }, // Leche
          { inventoryItemId: "inv-12", quantity: 3 }, // Huevos
        ],
      },
      {
        name: "Pisco Sour",
        price: 5500,
        category: "Bebidas",
        ingredients: [
          { inventoryItemId: "inv-13", quantity: 0.05 }, // Pisco
          { inventoryItemId: "inv-12", quantity: 1 }, // Huevos
        ],
      },
      {
        name: "Coca Cola",
        price: 2000,
        category: "Bebidas",
        ingredients: [
          { inventoryItemId: "inv-15", quantity: 0.5 }, // Coca Cola
        ],
      },
      {
        name: "Agua Mineral",
        price: 1500,
        category: "Bebidas",
        ingredients: [
          { inventoryItemId: "inv-16", quantity: 0.5 }, // Agua Mineral
        ],
      },
    ]

    menuData.forEach((item, index) => {
      const id = `menu-${index + 1}`
      this.menuItems.set(id, {
        id,
        name: item.name,
        price: item.price,
        category: item.category,
        available: true,
        ingredients: item.ingredients,
      })
    })

    const inventoryData = [
      { name: "Carne de Res", unit: "kg", quantity: 50, min_quantity: 10, category: "Carnes" },
      { name: "Pollo", unit: "kg", quantity: 40, min_quantity: 15, category: "Carnes" },
      { name: "Pescado", unit: "kg", quantity: 25, min_quantity: 8, category: "Pescados" },
      { name: "Tomates", unit: "kg", quantity: 30, min_quantity: 10, category: "Verduras" },
      { name: "Cebollas", unit: "kg", quantity: 20, min_quantity: 5, category: "Verduras" },
      { name: "Papas", unit: "kg", quantity: 60, min_quantity: 20, category: "Verduras" },
      { name: "Arroz", unit: "kg", quantity: 45, min_quantity: 15, category: "Granos" },
      { name: "Harina", unit: "kg", quantity: 35, min_quantity: 10, category: "Granos" },
      { name: "Aceite", unit: "litros", quantity: 25, min_quantity: 8, category: "Aceites" },
      { name: "Leche", unit: "litros", quantity: 40, min_quantity: 15, category: "Lácteos" },
      { name: "Queso", unit: "kg", quantity: 15, min_quantity: 5, category: "Lácteos" },
      { name: "Huevos", unit: "unidades", quantity: 120, min_quantity: 30, category: "Lácteos" },
      { name: "Pisco", unit: "litros", quantity: 10, min_quantity: 3, category: "Bebidas Alcohólicas" },
      {
        name: "Vino Tinto",
        unit: "litros",
        quantity: 15,
        min_quantity: 5,
        category: "Bebidas Alcohólicas",
      },
      { name: "Coca Cola", unit: "litros", quantity: 50, min_quantity: 20, category: "Bebidas" },
      { name: "Agua Mineral", unit: "litros", quantity: 80, min_quantity: 30, category: "Bebidas" },
    ]

    inventoryData.forEach((item, index) => {
      const id = `inv-${index + 1}`
      this.inventory.set(id, {
        id,
        ...item,
        created_at: new Date(),
        updated_at: new Date(),
      })
    })
  }

  // User methods
  getUser(username: string): User | undefined {
    return this.users.get(username)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  // Table methods
  getTable(id: string): Table | undefined {
    return this.tables.get(id)
  }

  getAllTables(): Table[] {
    return Array.from(this.tables.values()).sort((a, b) => a.number - b.number)
  }

  updateTable(id: string, updates: Partial<Table>): Table | undefined {
    const table = this.tables.get(id)
    if (table) {
      const updated = { ...table, ...updates }
      this.tables.set(id, updated)
      return updated
    }
    return undefined
  }

  // Menu methods
  getMenuItem(id: string): MenuItem | undefined {
    return this.menuItems.get(id)
  }

  getAllMenuItems(): MenuItem[] {
    return Array.from(this.menuItems.values())
  }

  // Order methods
  createOrder(order: Order): Order {
    this.orders.set(order.id, order)
    return order
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id)
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values())
  }

  updateOrder(id: string, updates: Partial<Order>): Order | undefined {
    const order = this.orders.get(id)
    if (order) {
      const updated = { ...order, ...updates }
      this.orders.set(id, updated)
      return updated
    }
    return undefined
  }

  getActiveOrders(): Order[] {
    return Array.from(this.orders.values()).filter((o) => o.status === "active")
  }

  getPaidOrders(): Order[] {
    return Array.from(this.orders.values()).filter((o) => o.status === "paid")
  }

  getInventoryItem(id: string): InventoryItem | undefined {
    return this.inventory.get(id)
  }

  getAllInventoryItems(): InventoryItem[] {
    return Array.from(this.inventory.values())
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | undefined {
    const item = this.inventory.get(id)
    if (item) {
      const updated = { ...item, ...updates }
      this.inventory.set(id, updated)
      return updated
    }
    return undefined
  }

  createInventoryItem(item: InventoryItem): InventoryItem {
    this.inventory.set(item.id, item)
    return item
  }

  deleteInventoryItem(id: string): boolean {
    return this.inventory.delete(id)
  }

  getLowStockItems(): InventoryItem[] {
    return Array.from(this.inventory.values()).filter((item) => item.quantity <= item.min_quantity)
  }

  checkMenuItemStock(menuItemId: string, quantity: number): { available: boolean; missingItems: string[] } {
    const menuItem = this.menuItems.get(menuItemId)
    if (!menuItem || !menuItem.ingredients) {
      return { available: true, missingItems: [] }
    }

    const missingItems: string[] = []

    for (const ingredient of menuItem.ingredients) {
      const inventoryItem = this.inventory.get(ingredient.inventoryItemId)
      if (!inventoryItem) continue

      const requiredQuantity = ingredient.quantity * quantity
      if (inventoryItem.quantity < requiredQuantity) {
        missingItems.push(inventoryItem.name)
      }
    }

    return {
      available: missingItems.length === 0,
      missingItems,
    }
  }

  deductInventoryForOrder(menuItemId: string, quantity: number): boolean {
    const menuItem = this.menuItems.get(menuItemId)
    if (!menuItem || !menuItem.ingredients) {
      return true // No ingredients to deduct
    }

    // First check if we have enough stock
    const stockCheck = this.checkMenuItemStock(menuItemId, quantity)
    if (!stockCheck.available) {
      return false
    }

    // Deduct from inventory
    for (const ingredient of menuItem.ingredients) {
      const inventoryItem = this.inventory.get(ingredient.inventoryItemId)
      if (!inventoryItem) continue

      const requiredQuantity = ingredient.quantity * quantity
      this.updateInventoryItem(ingredient.inventoryItemId, {
        quantity: inventoryItem.quantity - requiredQuantity,
      })
    }

    return true
  }
}

// Simple singleton pattern - will reset on hot reloads in development
let dbInstance: Database | null = null

export const db = dbInstance || (dbInstance = new Database())
