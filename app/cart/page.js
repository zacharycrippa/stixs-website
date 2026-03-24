'use client'

import { useState } from 'react'
import { useCart } from '../components/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          items: cart.map(item => ({ id: item.id, title: item.title, quantity: item.quantity, price: item.price })),
          total: getTotal()
        })
      })

      if (!res.ok) throw new Error('Failed to place order')

      clearCart()
      setOrderPlaced(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <main className="bg-gray-100 min-h-screen p-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow text-center">
          <h1 className="text-4xl font-bold mb-4">Order Placed!</h1>
          <p className="text-gray-600 mb-6">Thanks {form.name}, your order has been received. We&apos;ll be in touch at {form.email}.</p>
          <a href="/products" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 inline-block">
            Continue Shopping
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded"></div>
                    )}
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600">${Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 p-2 border rounded"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <p className="text-2xl font-bold">Total: ${getTotal().toFixed(2)}</p>
              {!showCheckout && (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>

            {showCheckout && (
              <form onSubmit={handleCheckout} className="mt-8 border-t pt-8 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Your Details</h2>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border rounded p-2"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border rounded p-2"
                    placeholder="john@example.com"
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="px-6 py-3 border rounded hover:bg-gray-100"
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </main>
  )
}