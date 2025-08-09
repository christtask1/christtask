import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const { price_id, coupon, user_id, user_email } = await request.json()

    // user_id is optional now. We only require price_id and user_email to create a customer/subscription.
    if (!price_id || !user_email) {
      return NextResponse.json(
        { error: 'Missing required fields: price_id, user_email' },
        { status: 400 }
      )
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user_email,
      metadata: {
        supabase_uid: user_id || '',
        signup_status: user_id ? 'existing' : 'pending',
        signup_email: user_email,
      },
    })

    // Create subscription
    const subscriptionData: any = {
      customer: customer.id,
      items: [{ price: price_id }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      // Expand both latest_invoice and its payment_intent so we can inspect
      expand: ['latest_invoice', 'latest_invoice.payment_intent'],
    }

    // Add coupon if provided (using discounts format)
    if (coupon && coupon.trim()) {
      subscriptionData.discounts = [{ coupon: coupon.trim() }]
    }

    const subscription = await stripe.subscriptions.create(subscriptionData)

    // Safely access client_secret
    const clientSecret = subscription?.latest_invoice?.payment_intent?.client_secret
    const latestInvoice = subscription?.latest_invoice
    const invoiceStatus = latestInvoice?.status
    const amountDue = (latestInvoice && typeof latestInvoice.amount_due === 'number') ? latestInvoice.amount_due : undefined

    // If there is a client_secret, return it for front-end confirmation
    if (clientSecret) {
      return NextResponse.json({
        client_secret: clientSecret,
        subscription_id: subscription.id,
        status: subscription.status,
      })
    }

    // If no client_secret, check if no payment is required (e.g., 100% coupon) or already paid
    if (invoiceStatus === 'paid' || amountDue === 0 || subscription.status === 'active' || subscription.status === 'trialing') {
      // Create a SetupIntent so the card can be saved even when no payment is due
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        usage: 'off_session',
      })

      return NextResponse.json({
        client_secret: setupIntent.client_secret,
        subscription_id: subscription.id,
        status: subscription.status,
        intent_type: 'setup',
      })
    }

    // Otherwise treat as an error and bubble up details for debugging
    console.error('No client_secret and invoice not paid. Subscription:', JSON.stringify(subscription, null, 2))
    return NextResponse.json(
      { error: 'Subscription requires payment but no client_secret was returned' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Stripe API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
