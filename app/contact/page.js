'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="bg-gray-100 min-h-screen p-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow text-center">
          <h1 className="text-4xl font-bold mb-4">Message Sent!</h1>
          <p className="text-gray-600 mb-6">
            Thanks {form.name}, we&apos;ve received your enquiry and will get back to you at {form.email} shortly.
          </p>
          <a href="/" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 inline-block">
            Back to Home
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded shadow">
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have a custom print idea, a question about an order, or just want to say hello? Fill in the form below and we&apos;ll get back to you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="">Select a topic...</option>
                <option value="Custom Print Enquiry">Custom Print Enquiry</option>
                <option value="Order Question">Order Question</option>
                <option value="Product Information">Product Information</option>
                <option value="Returns & Refunds">Returns &amp; Refunds</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what you need..."
                className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 font-medium disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-white p-6 rounded shadow text-sm text-gray-600">
          <p>Or email us directly: <a href="mailto:hello@stixs3d.com" className="text-black font-medium hover:underline">hello@stixs3d.com</a></p>
        </div>
      </div>
    </main>
  )
}