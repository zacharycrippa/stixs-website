'use client'

import Link from 'next/link'
import { useCart } from './CartContext'

export default function Header() {
  const { getCartCount } = useCart()

  return (
    <header className="bg-black text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Stixs 3D
        </Link>
        <nav className="flex space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="hover:text-gray-300">
            Cart ({getCartCount()})
          </Link>
        </div>
      </div>
    </header>
  )
}