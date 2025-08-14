import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '../../../lib/stripe'

function envPriceId(currency: string, plan: 'MONTHLY' | 'WEEKLY'): string | undefined {
  const upper = currency.toUpperCase()
  // Prefer non-public keys if you set them; otherwise fall back to public ones
  const privateKey = process.env[`PRICE_${upper}_${plan}`]
  const publicKey = process.env[`NEXT_PUBLIC_PRICE_${upper}_${plan}`]
  return (privateKey || publicKey) as string | undefined
}

export async function GET(request: NextRequest) {
  try {
    const stripe = getStripe()
    const { searchParams } = new URL(request.url)
    const currency = (searchParams.get('currency') || 'GBP').toUpperCase()

    const monthlyId = envPriceId(currency, 'MONTHLY')
    const weeklyId = envPriceId(currency, 'WEEKLY')

    // If nothing configured for this currency, fall back to GBP
    const effectiveCurrency = monthlyId || weeklyId ? currency : 'GBP'
    const monthly = envPriceId(effectiveCurrency, 'MONTHLY')
    const weekly = envPriceId(effectiveCurrency, 'WEEKLY')

    const result: any[] = []
    if (monthly) {
      const price = await stripe.prices.retrieve(monthly)
      result.push({
        id: price.id,
        product_name: 'ChristTask Monthly',
        unit_amount: price.unit_amount || 0,
        currency: (price.currency || effectiveCurrency).toUpperCase(),
        type: price.recurring ? 'recurring' : 'one_time',
      })
    }
    if (weekly) {
      const price = await stripe.prices.retrieve(weekly)
      result.push({
        id: price.id,
        product_name: 'ChristTask Weekly',
        unit_amount: price.unit_amount || 0,
        currency: (price.currency || effectiveCurrency).toUpperCase(),
        type: price.recurring ? 'recurring' : 'one_time',
      })
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'No price IDs configured' }, { status: 404 })
    }

    return NextResponse.json({ currency: effectiveCurrency, prices: result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to load prices' }, { status: 500 })
  }
}

export const runtime = 'nodejs'


