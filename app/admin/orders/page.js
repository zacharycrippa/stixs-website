'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/orders')
      setOrders(await res.json())
    }
    load()
  }, [])

  if (status === 'loading') return <p>Loading...</p>
  if (!session || session.user.role !== 'admin') return null

  const updateStatus = async (id, statusValue) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusValue })
    })

    const res = await fetch('/api/orders')
    setOrders(await res.json())
  }

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl mb-6">Admin Orders</h1>
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{order.customerName} ({order.customerEmail})</p>
              <p className="text-sm text-gray-600">Total: ${order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
              <p className="text-sm">Items: {order.items}</p>
              <div className="mt-2 space-x-2">
                <button onClick={() => updateStatus(order.id, 'processing')} className="px-2 py-1 bg-yellow-400 rounded">Processing</button>
                <button onClick={() => updateStatus(order.id, 'shipped')} className="px-2 py-1 bg-blue-500 text-white rounded">Shipped</button>
                <button onClick={() => updateStatus(order.id, 'completed')} className="px-2 py-1 bg-green-500 text-white rounded">Completed</button>
                <button onClick={() => updateStatus(order.id, 'cancelled')} className="px-2 py-1 bg-red-500 text-white rounded">Cancelled</button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => router.push('/admin')} className="mt-6 text-blue-600 underline">Back to dashboard</button>
      </div>
    </main>
  )
}