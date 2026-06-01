import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY não configurada')
  }
  _stripe = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  })
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop, getStripe())
  },
})
