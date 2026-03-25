'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [checkoutEnabled, setCheckoutEnabled] = useState(null)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/settings')
        .then(r => r.json())
        .then(d => setCheckoutEnabled(d.checkoutEnabled))
    }
  }, [status])

  const handleToggleCheckout = async () => {
    setToggling(true)
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutEnabled: !checkoutEnabled })
    })
    const data = await res.json()
    setCheckoutEnabled(data.checkoutEnabled)
    setToggling(false)
  }

  if (status === 'loading') {
    return (
      <main className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </main>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null // Will redirect
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Site Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Checkout</p>
              <p className="text-sm text-gray-500">
                {checkoutEnabled === null
                  ? 'Loading...'
                  : checkoutEnabled
                  ? 'Customers can currently place orders.'
                  : 'Checkout is disabled — customers cannot place orders.'}
              </p>
            </div>
            <button
              onClick={handleToggleCheckout}
              disabled={toggling || checkoutEnabled === null}
              className={`relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${checkoutEnabled ? 'bg-green-500' : 'bg-gray-400'}`}
            >
              <span
                className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${checkoutEnabled ? 'translate-x-8' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
            <p className="text-gray-600 mb-4">Add, edit, or remove products from the catalog.</p>
            <button onClick={() => router.push('/admin/products')} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Go to Products
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">View Orders</h2>
            <p className="text-gray-600 mb-4">Check and manage customer orders.</p>
            <button onClick={() => router.push('/admin/orders')} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              View Orders
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">View sales data and website statistics.</p>
            <button onClick={() => router.push('/admin/analytics')} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              View Analytics
            </button>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Enquiries</h2>
            <p className="text-gray-600 mb-4">Read and reply to customer contact form submissions.</p>
            <button onClick={() => router.push('/admin/enquiries')} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              View Enquiries
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}