import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const empresa = await prisma.empresa.findUnique({
    where: { userId: session.user.id },
  })

  if (!empresa) {
    return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
  }

  if (empresa.plano !== 'GRATUITO') {
    return NextResponse.json({ error: 'Você já possui um plano ativo' }, { status: 400 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email!,
    metadata: {
      empresaId: empresa.id,
      plano: 'ESSENCIAL',
    },
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Plano Essencial — Ilicínea.com',
            description: 'WhatsApp clicável, fotos, Google Maps e destaque na listagem',
          },
          unit_amount: 3499,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/minha-empresa/plano?sucesso=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/minha-empresa/plano`,
  })

  return NextResponse.json({ url: checkoutSession.url })
}
