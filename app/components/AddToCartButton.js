'use client'

import { useCart } from './CartContext'

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart()

  return (
    <button
      onClick={() => addToCart(product)}
      className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 text-lg"
    >
      Add to Cart
    </button>
  )
}
