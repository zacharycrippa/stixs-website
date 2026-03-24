'use client'

import { useCart } from '../components/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart()

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
                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price}</p>
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
              <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}