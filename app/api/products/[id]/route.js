import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(request, { params }) {
  const { title, slug, description, price, stock, image, featured } = await request.json()
  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      title,
      slug,
      description,
      price: price != null ? Number(price) : undefined,
      stock: stock != null ? Number(stock) : undefined,
      image,
      featured: featured != null ? Boolean(featured) : undefined
    }
  })
  return NextResponse.json(updated)
}

export async function DELETE(request, { params }) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}