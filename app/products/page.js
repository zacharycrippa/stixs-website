'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/app/components/CartContext'

export default function ProductsPage() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' })
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shop Products</h1>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-96 object-cover" />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                <div className="p-5">
                <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <p className="font-bold mb-4">${Number(product.price).toFixed(2)}</p>
                <div className="flex gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    Add to Cart
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}