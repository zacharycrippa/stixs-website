'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ title: '', slug: '', description: '', price: '', stock: '', image: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/products')
      setProducts(await res.json())
    }
    load()
  }, [])

  if (status === 'loading') return <p>Loading...</p>
  if (!session || session.user.role !== 'admin') return null

  const refresh = async () => {
    const res = await fetch('/api/products')
    setProducts(await res.json())
  }

  const createProduct = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
      })
    })
    if (!res.ok) {
      setError('Failed to create product')
      return
    }
    setNewProduct({ title: '', slug: '', description: '', price: '', stock: '', image: '' })
    await refresh()
  }

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl mb-6">Admin Products</h1>

        <form onSubmit={createProduct} className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl mb-4">Add Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={newProduct.title} onChange={(e) => setNewProduct((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="p-2 border rounded" required />
            <input value={newProduct.slug} onChange={(e) => setNewProduct((p) => ({ ...p, slug: e.target.value }))} placeholder="Slug" className="p-2 border rounded" required />
            <input value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} placeholder="Price" type="number" step="0.01" className="p-2 border rounded" required />
            <input value={newProduct.stock} onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))} placeholder="Stock" type="number" className="p-2 border rounded" required />
            <input value={newProduct.image} onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))} placeholder="Image URL" className="p-2 border rounded" />
            <textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="p-2 border rounded col-span-1 md:col-span-2" required />
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
        </form>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl mb-4">Product List</h2>
          <div className="grid gap-4">
            {products.map((item) => (
              <div key={item.id} className="p-4 border rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">${item.price} | Stock: {item.stock}</p>
                </div>
                <button onClick={() => deleteProduct(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => router.push('/admin')} className="mt-6 text-blue-600 underline">Back to dashboard</button>
      </div>
    </main>
  )
}