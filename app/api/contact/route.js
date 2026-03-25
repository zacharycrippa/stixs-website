import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

export async function POST(request) {
  const { name, email, subject, message } = await request.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const enquiry = await prisma.enquiry.create({
    data: { name, email, subject, message, status: 'new' }
  })

  // Send notification email to admin if key is configured
  if (process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFY_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)

      const sendResult = await resend.emails.send({
        from: 'Stixs 3D <notifications@resend.dev>',
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `New enquiry: ${subject}`,
        html: `
          <h2>New enquiry from your website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555">${message.replace(/\n/g, '<br/>')}</blockquote>
          <p><a href="${process.env.NEXTAUTH_URL}/admin/enquiries">View in admin</a></p>
        `
      })

      if (sendResult?.error) {
        console.error('Resend reported an email send error:', sendResult.error)
      }
    } catch (emailError) {
      // Log but don't fail the request if email sending fails
      console.error('Failed to send notification email:', emailError)
    }
  } else {
    console.warn('Email notification skipped: RESEND_API_KEY or ADMIN_NOTIFY_EMAIL is missing')
  }

  return NextResponse.json({ success: true, id: enquiry.id }, { status: 201 })
}
