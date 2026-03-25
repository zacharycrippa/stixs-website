import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

export async function POST(request) {
  const { title, slug, description, price, stock, image, imageScale, imagePositionX, imagePositionY, featured } = await request.json()

  if (!title || !slug || !description || price == null || stock == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      title,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      image: image || '',
      imageScale: imageScale != null ? Number(imageScale) : 100,
      imagePositionX: imagePositionX != null ? Number(imagePositionX) : 50,
      imagePositionY: imagePositionY != null ? Number(imagePositionY) : 50,
      featured: Boolean(featured)
    }
  })

  return NextResponse.json(product, { status: 201 })
}