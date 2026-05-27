import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const empresaId = session.metadata?.empresaId
      const plano = session.metadata?.plano

      if (empresaId && plano) {
        await prisma.empresa.update({
          where: { id: empresaId },
          data: {
            plano: plano as 'ESSENCIAL' | 'PROFISSIONAL',
            planoStatus: 'ATIVO',
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
          },
        })
        console.log(`✅ Plano ${plano} ativado para empresa ${empresaId}`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const empresa = await prisma.empresa.findFirst({
        where: { stripeSubId: subscription.id },
      })

      if (empresa) {
        await prisma.empresa.update({
          where: { id: empresa.id },
          data: {
            plano: 'GRATUITO',
            planoStatus: 'CANCELADO',
            stripeSubId: null,
          },
        })
        console.log(`⚠️ Assinatura cancelada para empresa ${empresa.id}`)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subId = invoice.subscription as string

      if (subId) {
        const empresa = await prisma.empresa.findFirst({
          where: { stripeSubId: subId },
        })

        if (empresa) {
          await prisma.empresa.update({
            where: { id: empresa.id },
            data: { planoStatus: 'AGUARDANDO_PAGAMENTO' },
          })
          console.log(`❌ Pagamento falhou para empresa ${empresa.id}`)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
