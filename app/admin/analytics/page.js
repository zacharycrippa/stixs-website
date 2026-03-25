'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Money({ value }) {
  return <>${Number(value || 0).toFixed(2)}</>
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    async function loadAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics', { cache: 'no-store' })
        if (!res.ok) {
          setData(null)
          return
        }
        setData(await res.json())
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [status])

  const maxRevenue = useMemo(() => {
    if (!data?.trend?.length) return 1
    return Math.max(...data.trend.map((d) => d.revenue), 1)
  }, [data])

  if (status === 'loading' || loading) {
    return (
      <main className="bg-gray-100 min-h-screen p-10">
        <div className="max-w-6xl mx-auto">Loading analytics...</div>
      </main>
    )
  }

  if (!session || session.user.role !== 'admin') return null
  if (!data) {
    return (
      <main className="bg-gray-100 min-h-screen p-10">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
          <p>Could not load analytics.</p>
          <button onClick={() => router.push('/admin')} className="mt-4 text-blue-600 underline">
            Back to dashboard
          </button>
        </div>
      </main>
    )
  }

  const { kpis, statusCounts, topProductsByQuantity, topProductsByRevenue, lowStockProducts, trend } = data

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Analytics</h1>
          <button onClick={() => router.push('/admin')} className="text-blue-600 underline">
            Back to dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Revenue Today</p><p className="text-2xl font-bold"><Money value={kpis.revenueToday} /></p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Revenue (7d)</p><p className="text-2xl font-bold"><Money value={kpis.revenue7d} /></p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Revenue (30d)</p><p className="text-2xl font-bold"><Money value={kpis.revenue30d} /></p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">AOV (30d)</p><p className="text-2xl font-bold"><Money value={kpis.aov30d} /></p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Orders Today</p><p className="text-2xl font-bold">{kpis.ordersToday}</p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Orders (7d)</p><p className="text-2xl font-bold">{kpis.orders7d}</p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Orders (30d)</p><p className="text-2xl font-bold">{kpis.orders30d}</p></div>
          <div className="bg-white p-4 rounded shadow"><p className="text-sm text-gray-500">Pending &gt; 24h</p><p className="text-2xl font-bold">{kpis.pendingOver24h}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Order Status Breakdown</h2>
            {Object.keys(statusCounts).length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(statusCounts).map(([statusLabel, count]) => (
                  <div key={statusLabel} className="flex justify-between border-b pb-2">
                    <span className="capitalize">{statusLabel}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Low Stock</h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500">No low-stock products.</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex justify-between border-b pb-2">
                    <span>{p.title}</span>
                    <span className="font-semibold">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Revenue Trend (Last 30 Days)</h2>
          <div className="space-y-2 max-h-96 overflow-auto pr-2">
            {trend.map((point) => (
              <div key={point.date} className="grid grid-cols-[100px_1fr_100px] gap-3 items-center text-sm">
                <span className="text-gray-600">{point.date.slice(5)}</span>
                <div className="h-3 bg-gray-200 rounded">
                  <div
                    className="h-3 bg-black rounded"
                    style={{ width: `${Math.max((point.revenue / maxRevenue) * 100, 2)}%` }}
                  />
                </div>
                <span className="text-right"><Money value={point.revenue} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Top Products by Quantity</h2>
            {topProductsByQuantity.length === 0 ? (
              <p className="text-gray-500">No sales data yet.</p>
            ) : (
              <div className="space-y-2">
                {topProductsByQuantity.map((p) => (
                  <div key={p.title} className="flex justify-between border-b pb-2">
                    <span>{p.title}</span>
                    <span className="font-semibold">{p.quantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Top Products by Revenue</h2>
            {topProductsByRevenue.length === 0 ? (
              <p className="text-gray-500">No sales data yet.</p>
            ) : (
              <div className="space-y-2">
                {topProductsByRevenue.map((p) => (
                  <div key={p.title} className="flex justify-between border-b pb-2">
                    <span>{p.title}</span>
                    <span className="font-semibold"><Money value={p.revenue} /></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
