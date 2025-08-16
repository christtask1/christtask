import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getAuthUserFromRequest } from '../../../lib/auth'
import { getStripe } from '../../../lib/stripe'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripe = getStripe()

    // Check if user has email
    if (!user.email) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
        debug: 'User has no email address'
      })
    }

    // Search for customers by email directly in Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 10
    })

    if (!customers.data || customers.data.length === 0) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
        debug: `No Stripe customers found for email: ${user.email}`
      })
    }

    // Check each customer for active subscriptions
    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 10
      })

      for (const subscription of subscriptions.data) {
        if (['active', 'trialing'].includes(subscription.status)) {
          return NextResponse.json({
            hasActiveSubscription: true,
            subscription: {
              id: subscription.id,
              status: subscription.status,
              current_period_end: (subscription as any).current_period_end,
              customer: subscription.customer,
              currency: (subscription as any).currency
            },
            debug: `Found active subscription for customer: ${customer.id}`
          })
        }
      }
    }

    // No active subscriptions found
    return NextResponse.json({
      hasActiveSubscription: false,
      subscription: null,
      debug: `Found ${customers.data.length} customers but no active subscriptions`
    })

  } catch (error: any) {
    console.error('Direct Stripe check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status', debug: error.message },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
