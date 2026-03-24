'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from './CartContext'

export default function Providers({ children }) {
  return (
    <SessionProvider refetchInterval={60}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  )
}
