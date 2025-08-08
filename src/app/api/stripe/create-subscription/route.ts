import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { customerId, priceId, couponCode } = await request.json()

    // Prepare subscription parameters
    const subscriptionParams: Record<string, string> = {
      customer: customerId,
      items: JSON.stringify([{ price: priceId }]),
      payment_behavior: 'default_incomplete',
      payment_settings: JSON.stringify({
        save_default_payment_method: 'on_subscription',
      }),
      expand: JSON.stringify(['latest_invoice.payment_intent']),
    }

    // Add coupon if provided
    if (couponCode && couponCode.trim()) {
      subscriptionParams.coupon = couponCode.trim()
    }

    // Create subscription using Stripe API
    const response = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(subscriptionParams),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.error?.message || 'Failed to create subscription' }, { status: 400 })
    }

    const subscription = await response.json()

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
