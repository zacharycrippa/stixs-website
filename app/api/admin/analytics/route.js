import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function formatDay(date) {
  return date.toISOString().slice(0, 10)
}

function parseOrderItems(rawItems) {
  try {
    const parsed = JSON.parse(rawItems)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const startToday = new Date(now)
  startToday.setHours(0, 0, 0, 0)

  const start7d = new Date(now)
  start7d.setDate(start7d.getDate() - 7)

  const start30d = new Date(now)
  start30d.setDate(start30d.getDate() - 30)

  const pendingCutoff = new Date(now)
  pendingCutoff.setHours(pendingCutoff.getHours() - 24)

  const [orders30d, allOrders, pendingOlder, lowStockProducts] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: start30d } },
      orderBy: { createdAt: 'asc' },
      select: { total: true, status: true, createdAt: true, items: true }
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: { status: true, createdAt: true }
    }),
    prisma.order.count({
      where: { status: 'pending', createdAt: { lte: pendingCutoff } }
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      take: 8,
      select: { id: true, title: true, stock: true }
    })
  ])

  let revenueToday = 0
  let revenue7d = 0
  let revenue30d = 0
  let ordersToday = 0
  let orders7d = 0
  const productMap = new Map()

  const revenueByDayMap = new Map()
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(now)
    day.setDate(day.getDate() - i)
    revenueByDayMap.set(formatDay(day), { revenue: 0, orders: 0 })
  }

  for (const order of orders30d) {
    const total = Number(order.total) || 0
    const createdAt = new Date(order.createdAt)

    revenue30d += total

    if (createdAt >= start7d) {
      revenue7d += total
      orders7d += 1
    }

    if (createdAt >= startToday) {
      revenueToday += total
      ordersToday += 1
    }

    const dayKey = formatDay(createdAt)
    const dayEntry = revenueByDayMap.get(dayKey)
    if (dayEntry) {
      dayEntry.revenue += total
      dayEntry.orders += 1
      revenueByDayMap.set(dayKey, dayEntry)
    }

    const items = parseOrderItems(order.items)
    for (const item of items) {
      const title = item?.title || 'Unnamed Product'
      const quantity = Number(item?.quantity) || 0
      const price = Number(item?.price) || 0
      const itemRevenue = quantity * price

      if (!productMap.has(title)) {
        productMap.set(title, { title, quantity: 0, revenue: 0 })
      }

      const current = productMap.get(title)
      current.quantity += quantity
      current.revenue += itemRevenue
      productMap.set(title, current)
    }
  }

  const statusCounts = allOrders.reduce((acc, order) => {
    const key = order.status || 'unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const productStats = Array.from(productMap.values())
  const topProductsByQuantity = [...productStats]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
  const topProductsByRevenue = [...productStats]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const trend = Array.from(revenueByDayMap.entries()).map(([date, stats]) => ({
    date,
    revenue: Number(stats.revenue.toFixed(2)),
    orders: stats.orders
  }))

  const orders30dCount = orders30d.length
  const aov30d = orders30dCount > 0 ? revenue30d / orders30dCount : 0

  return NextResponse.json({
    kpis: {
      revenueToday: Number(revenueToday.toFixed(2)),
      revenue7d: Number(revenue7d.toFixed(2)),
      revenue30d: Number(revenue30d.toFixed(2)),
      ordersToday,
      orders7d,
      orders30d: orders30dCount,
      aov30d: Number(aov30d.toFixed(2)),
      pendingOver24h: pendingOlder
    },
    statusCounts,
    topProductsByQuantity,
    topProductsByRevenue,
    lowStockProducts,
    trend
  })
}
