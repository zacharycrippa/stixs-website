import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(orders)
}

export async function POST(request) {
  const { customerName, customerEmail, items, total } = await request.json()

  if (!customerName || !customerEmail || !items || total == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      customerEmail,
      items: JSON.stringify(items),
      total: Number(total),
      status: 'pending'
    }
  })

  return NextResponse.json(order, { status: 201 })
}