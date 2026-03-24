'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

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
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              View Analytics
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li>New order received for Caravan Scoop</li>
            <li>Custom print request submitted</li>
            <li>Product Phone Stand updated</li>
          </ul>
        </div>
      </div>
    </main>
  )
}