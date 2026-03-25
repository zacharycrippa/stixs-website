'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ title: '', slug: '', description: '', price: '', stock: '', image: '', featured: false })
  const [editingId, setEditingId] = useState(null)
  const [editingProduct, setEditingProduct] = useState({ title: '', slug: '', description: '', price: '', stock: '', image: '', featured: false })
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
        stock: Number(newProduct.stock),
        featured: Boolean(newProduct.featured)
      })
    })
    if (!res.ok) {
      setError('Failed to create product')
      return
    }
    setNewProduct({ title: '', slug: '', description: '', price: '', stock: '', image: '', featured: false })
    await refresh()
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditingProduct({
      title: item.title,
      slug: item.slug,
      description: item.description,
      price: String(item.price),
      stock: String(item.stock),
      image: item.image || '',
      featured: Boolean(item.featured)
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingProduct({ title: '', slug: '', description: '', price: '', stock: '', image: '', featured: false })
  }

  const saveEdit = async (id) => {
    setError('')
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        featured: Boolean(editingProduct.featured)
      })
    })

    if (!res.ok) {
      setError('Failed to update product')
      return
    }

    cancelEdit()
    await refresh()
  }

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    await refresh()
  }

  const uploadImage = async (file, updateFn) => {
    const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      body: file,
    })
    if (res.ok) {
      const data = await res.json()
      updateFn(data.url)
    }
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
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], (url) => setNewProduct((p) => ({ ...p, image: url })))}
                className="block mb-2 text-sm"
              />
              <input
                value={newProduct.image}
                onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))}
                placeholder="Or paste image URL"
                className="p-2 border rounded w-full text-sm"
              />
              {newProduct.image && (
                <img src={newProduct.image} alt="Preview" className="mt-2 h-28 w-28 object-cover rounded border" />
              )}
            </div>
            <textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className="p-2 border rounded col-span-1 md:col-span-2" required />
            <label className="flex items-center gap-2 col-span-1 md:col-span-2">
              <input
                type="checkbox"
                checked={newProduct.featured}
                onChange={(e) => setNewProduct((p) => ({ ...p, featured: e.target.checked }))}
              />
              Featured product
            </label>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button className="mt-4 bg-black text-white px-4 py-2 rounded">Save</button>
        </form>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl mb-4">Product List</h2>
          <div className="grid gap-4">
            {products.map((item) => (
              <div key={item.id} className="p-4 border rounded">
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input value={editingProduct.title} onChange={(e) => setEditingProduct((p) => ({ ...p, title: e.target.value }))} className="p-2 border rounded" placeholder="Title" />
                    <input value={editingProduct.slug} onChange={(e) => setEditingProduct((p) => ({ ...p, slug: e.target.value }))} className="p-2 border rounded" placeholder="Slug" />
                    <input value={editingProduct.price} onChange={(e) => setEditingProduct((p) => ({ ...p, price: e.target.value }))} className="p-2 border rounded" type="number" step="0.01" placeholder="Price" />
                    <input value={editingProduct.stock} onChange={(e) => setEditingProduct((p) => ({ ...p, stock: e.target.value }))} className="p-2 border rounded" type="number" placeholder="Stock" />
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">Product Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], (url) => setEditingProduct((p) => ({ ...p, image: url })))}
                        className="block mb-2 text-sm"
                      />
                      <input
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct((p) => ({ ...p, image: e.target.value }))}
                        placeholder="Or paste image URL"
                        className="p-2 border rounded w-full text-sm"
                      />
                      {editingProduct.image && (
                        <img src={editingProduct.image} alt="Preview" className="mt-2 h-28 w-28 object-cover rounded border" />
                      )}
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) => setEditingProduct((p) => ({ ...p, featured: e.target.checked }))}
                      />
                      Featured product
                    </label>
                    <textarea value={editingProduct.description} onChange={(e) => setEditingProduct((p) => ({ ...p, description: e.target.value }))} className="p-2 border rounded col-span-1 md:col-span-2" placeholder="Description" />
                    <div className="col-span-1 md:col-span-2 flex gap-2">
                      <button onClick={() => saveEdit(item.id)} className="bg-black text-white px-3 py-1 rounded">Save Changes</button>
                      <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-16 w-16 object-cover rounded border flex-shrink-0" />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded border flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">
                          {item.title} {item.featured ? <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span> : null}
                        </p>
                        <p className="text-sm text-gray-600">${item.price} | Stock: {item.stock}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                      <button onClick={() => deleteProduct(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => router.push('/admin')} className="mt-6 text-blue-600 underline">Back to dashboard</button>
      </div>
    </main>
  )
}