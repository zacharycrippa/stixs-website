'use client'

import Link from 'next/link'
import { useCart } from './CartContext'

export default function Header() {
  const { getCartCount } = useCart()

  return (
    <header className="bg-black text-white py-4 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        <Link href="/" className="text-2xl font-bold">
          Stixs 3D
        </Link>
        <nav className="flex justify-center space-x-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
        </nav>
        <div className="flex justify-end items-center">
          <Link href="/cart" className="relative hover:text-gray-300 flex items-center gap-1">
            Cart
            {getCartCount() > 0 && (
              <span className="bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}