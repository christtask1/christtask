import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json()

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    // Validate coupon with Stripe API
    const response = await fetch(`https://api.stripe.com/v1/coupons/${encodeURIComponent(couponCode)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }
      const error = await response.json()
      return NextResponse.json({ error: error.error?.message || 'Invalid coupon' }, { status: 400 })
    }

    const coupon = await response.json()

    // Check if coupon is valid (not expired, etc.)
    if (!coupon.valid) {
      return NextResponse.json({ error: 'Coupon is no longer valid' }, { status: 400 })
    }

    return NextResponse.json({
      id: coupon.id,
      name: coupon.name,
      percent_off: coupon.percent_off,
      amount_off: coupon.amount_off,
      currency: coupon.currency,
      valid: coupon.valid,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
