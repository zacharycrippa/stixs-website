import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  const { name, email, subject, message } = await request.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const enquiry = await prisma.enquiry.create({
    data: { name, email, subject, message, status: 'new' }
  })

  return NextResponse.json({ success: true, id: enquiry.id }, { status: 201 })
}
