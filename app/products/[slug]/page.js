import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function ProductDetailPage({ params }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  })

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <p className="text-2xl font-semibold mb-2">${Number(product.price).toFixed(2)}</p>
        <p className="text-gray-500">Stock: {product.stock}</p>
      </div>
    </main>
  )
}