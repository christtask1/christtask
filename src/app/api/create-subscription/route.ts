import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const { price_id, coupon, user_id, user_email } = await request.json()

    if (!price_id || !user_id || !user_email) {
      return NextResponse.json(
        { error: 'Missing required fields: price_id, user_id, user_email' },
        { status: 400 }
      )
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user_email,
      metadata: {
        supabase_uid: user_id,
      },
    })

    // Create subscription
    const subscriptionData: any = {
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
      },
      expand: ['latest_invoice.payment_intent'],
    }

    // Add coupon if provided (using discounts format)
    if (coupon && coupon.trim()) {
      subscriptionData.discounts = [{ coupon: coupon.trim() }]
    }

    const subscription = await stripe.subscriptions.create(subscriptionData)

    // Safely access client_secret
    const clientSecret = subscription?.latest_invoice?.payment_intent?.client_secret
    
    if (!clientSecret) {
      console.error('No client_secret found in subscription:', JSON.stringify(subscription, null, 2))
      return NextResponse.json(
        { error: 'No client_secret received from Stripe' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      client_secret: clientSecret,
      subscription_id: subscription.id,
    })
  } catch (error: any) {
    console.error('Stripe API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
