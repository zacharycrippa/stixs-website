'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-800',
}

export default function AdminEnquiriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/admin/enquiries')
      .then(r => r.json())
      .then(data => {
        setEnquiries(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [status])

  if (status === 'loading' || loading) {
    return <main className="bg-gray-100 min-h-screen p-10"><p>Loading...</p></main>
  }

  if (!session || session.user.role !== 'admin') return null

  const newCount = enquiries.filter(e => e.status === 'new').length

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Enquiries</h1>
            {newCount > 0 && (
              <p className="text-sm text-blue-600 mt-1">{newCount} unread</p>
            )}
          </div>
          <button onClick={() => router.push('/admin')} className="text-blue-600 underline">
            Back to dashboard
          </button>
        </div>

        {enquiries.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center text-gray-500">
            No enquiries yet.
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map(e => (
              <div key={e.id} className="bg-white rounded shadow overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[e.status] || statusColors.read}`}>
                      {e.status}
                    </span>
                    <div>
                      <p className="font-semibold">{e.name} <span className="font-normal text-gray-500 text-sm">({e.email})</span></p>
                      <p className="text-sm text-gray-600">{e.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString('en-AU')}</span>
                </button>

                {expanded === e.id && (
                  <div className="border-t px-6 py-4">
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{e.message}</p>
                    <a
                      href={`mailto:${e.email}?subject=Re: ${encodeURIComponent(e.subject)}`}
                      className="inline-block bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
                    >
                      Reply via Email
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
