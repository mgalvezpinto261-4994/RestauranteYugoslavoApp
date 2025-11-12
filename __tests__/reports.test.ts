import { describe, it, expect, beforeEach } from "@jest/globals"
import { getSalesReport } from "@/app/actions/reports"
import { createOrder } from "@/app/actions/orders"
import { releaseTable } from "@/app/actions/tables"
import { db } from "@/lib/db"

describe("Sales Reports Tests", () => {
  beforeEach(() => {
    db.reset()
  })

  it("should generate daily report", async () => {
    const report = await getSalesReport("day")
    expect(report.period).toBe("day")
    expect(report.totalSales).toBe(0)
    expect(report.orderCount).toBe(0)
    expect(report.orders).toEqual([])
  })

  it("should generate weekly report", async () => {
    const report = await getSalesReport("week")
    expect(report.period).toBe("week")
  })

  it("should generate monthly report", async () => {
    const report = await getSalesReport("month")
    expect(report.period).toBe("month")
  })

  it("should generate yearly report", async () => {
    const report = await getSalesReport("year")
    expect(report.period).toBe("year")
  })

  it("should include paid orders in report", async () => {
    const order = await createOrder(1, [{ menuItemId: 1, quantity: 2 }])
    await releaseTable(1, order.orderId!)

    const report = await getSalesReport("day")
    expect(report.orderCount).toBe(1)
    expect(report.totalSales).toBe(5000)
    expect(report.orders.length).toBe(1)
  })

  it("should not include unpaid orders", async () => {
    await createOrder(1, [{ menuItemId: 1, quantity: 1 }])

    const report = await getSalesReport("day")
    expect(report.orderCount).toBe(0)
    expect(report.totalSales).toBe(0)
  })

  it("should calculate total from multiple orders", async () => {
    const order1 = await createOrder(1, [{ menuItemId: 1, quantity: 2 }])
    const order2 = await createOrder(2, [{ menuItemId: 2, quantity: 1 }])

    await releaseTable(1, order1.orderId!)
    await releaseTable(2, order2.orderId!)

    const report = await getSalesReport("day")
    expect(report.orderCount).toBe(2)
    expect(report.totalSales).toBe(13500) // 5000 + 8500
  })
})
