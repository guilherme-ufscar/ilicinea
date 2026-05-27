import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const empresa = await prisma.empresa.findUnique({
    where: { userId: session.user.id },
  })

  if (!empresa || !empresa.stripeCustomerId) {
    return NextResponse.json({ error: 'Nenhuma assinatura encontrada' }, { status: 404 })
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: empresa.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/minha-empresa/plano`,
  })

  return NextResponse.json({ url: portalSession.url })
}
