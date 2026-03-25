import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AddToCartButton from '@/app/components/AddToCartButton'
import { PRODUCT_IMAGE_FRAME_CLASS, getProductImageStyle } from '@/lib/productImage'

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
        {product.image && (
          <div className={`${PRODUCT_IMAGE_FRAME_CLASS} rounded mb-6`}>
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              style={getProductImageStyle(product)}
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <p className="text-2xl font-semibold mb-1">${Number(product.price).toFixed(2)}</p>
        <p className="text-gray-500 mb-4">Stock: {product.stock}</p>
        {product.stock > 0 ? (
          <AddToCartButton product={product} />
        ) : (
          <p className="text-red-500 font-semibold mt-4">Out of stock</p>
        )}
      </div>
    </main>
  )
}