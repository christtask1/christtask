import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set')
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 })
    }

    const { customerId, priceId, couponCode } = await request.json()

    // Validate required fields
    if (!customerId || !priceId) {
      return NextResponse.json({ error: 'Customer ID and Price ID are required' }, { status: 400 })
    }

    console.log('Creating subscription for customer:', customerId, 'price:', priceId)

    // Prepare subscription parameters
    const subscriptionParams: Record<string, string> = {
      customer: customerId,
      'items[0][price]': priceId,
      payment_behavior: 'default_incomplete',
      'payment_settings[save_default_payment_method]': 'on_subscription',
      expand: 'latest_invoice.payment_intent',
    }

    // Add coupon if provided
    if (couponCode && couponCode.trim()) {
      subscriptionParams.coupon = couponCode.trim()
      console.log('Applying coupon:', couponCode.trim())
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
      const errorData = await response.json()
      console.error('Stripe API error:', errorData)
      return NextResponse.json({ 
        error: errorData.error?.message || `Failed to create subscription: ${response.status}` 
      }, { status: response.status })
    }

    const subscription = await response.json()
    console.log('Subscription created successfully:', subscription.id)

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
