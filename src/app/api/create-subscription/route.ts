import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '../../../lib/stripe'
import { getAuthUser } from '../../../lib/auth'
import { supabase } from '../../../lib/supabaseClient'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { price_id, coupon, user_id, user_email } = await request.json()

    // Basic input validation
    const emailOk = typeof user_email === 'string' && /.+@.+\..+/.test(user_email)
    const priceOk = typeof price_id === 'string' && price_id.startsWith('price_')
    if (!emailOk || !priceOk) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // user_id is optional now. We only require price_id and user_email to create a customer/subscription.
    if (!price_id || !user_email) {
      return NextResponse.json(
        { error: 'Missing required fields: price_id, user_email' },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Require logged-in user if a user_id is provided mismatch
    const user = await getAuthUser()
    if (user_id && (!user || user.id !== user_id)) {
      return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 })
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: user_email,
      metadata: {
        supabase_uid: user?.id || user_id || '',
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

    // Save subscription to Supabase table (only if user exists)
    if (user?.id) {
      try {
        await supabase.from('subscriptions').insert({
          user_id: user.id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: customer.id,
          status: subscription.status,
          price_id: price_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } catch (dbError) {
        console.error('Failed to save subscription to Supabase:', dbError)
        // Don't fail the whole request if DB save fails
      }
    }

    // Safely access nested fields with type narrowing
    let clientSecret: string | undefined
    let invoiceStatus: Stripe.Invoice.Status | undefined
    let amountDue: number | undefined

    const li = subscription.latest_invoice
    if (li && typeof li !== 'string') {
      const invoice = li as Stripe.Invoice
      invoiceStatus = (invoice.status || undefined) as Stripe.Invoice.Status | undefined
      if (typeof invoice.amount_due === 'number') {
        amountDue = invoice.amount_due
      }
      // Access expanded payment_intent via any to avoid type friction from union
      const anyInvoice: any = invoice
      const pi = anyInvoice.payment_intent
      if (pi && typeof pi !== 'string') {
        clientSecret = (pi as Stripe.PaymentIntent).client_secret || undefined
      }
    }

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

export const runtime = 'nodejs'
