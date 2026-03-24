import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const order = await prisma.order.findUnique({ where: { id: params.id } })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(request, { params }) {
  const { status } = await request.json()
  const updated = await prisma.order.update({ where: { id: params.id }, data: { status } })
  return NextResponse.json(updated)
}

export async function DELETE(request, { params }) {
  await prisma.order.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}