import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const setting = await prisma.setting.findUnique({ where: { key: 'checkoutEnabled' } })
  return NextResponse.json({ checkoutEnabled: setting?.value === 'true' })
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { checkoutEnabled } = await request.json()
  const setting = await prisma.setting.upsert({
    where: { key: 'checkoutEnabled' },
    update: { value: String(checkoutEnabled) },
    create: { key: 'checkoutEnabled', value: String(checkoutEnabled) }
  })

  return NextResponse.json({ checkoutEnabled: setting.value === 'true' })
}
