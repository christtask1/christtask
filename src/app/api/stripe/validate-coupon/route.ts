import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json()

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    console.log('Validating coupon:', couponCode)
    console.log('Using Stripe key:', process.env.STRIPE_SECRET_KEY ? 'Key exists' : 'No key found')

    // Validate coupon with Stripe API
    const response = await fetch(`https://api.stripe.com/v1/coupons/${encodeURIComponent(couponCode)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    })

    console.log('Stripe response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Stripe error response:', errorText)
      
      if (response.status === 404) {
        return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
      }
      
      try {
        const error = JSON.parse(errorText)
        return NextResponse.json({ error: error.error?.message || 'Invalid coupon' }, { status: 400 })
      } catch {
        return NextResponse.json({ error: `Stripe API error: ${response.status}` }, { status: 400 })
      }
    }

    const coupon = await response.json()
    console.log('Coupon data:', coupon)

    // Check if coupon exists and is not redeem_by expired
    const now = Math.floor(Date.now() / 1000)
    if (coupon.redeem_by && coupon.redeem_by < now) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
    }

    // Check max redemptions
    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return NextResponse.json({ error: 'Coupon has reached maximum redemptions' }, { status: 400 })
    }

    return NextResponse.json({
      id: coupon.id,
      name: coupon.name,
      percent_off: coupon.percent_off,
      amount_off: coupon.amount_off,
      currency: coupon.currency,
      valid: true,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
