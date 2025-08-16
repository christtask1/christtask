import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '../../../lib/auth'
import { getStripe } from '../../../lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user.email) {
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    console.log('🔍 Checking Stripe directly for user:', user.email)

    const stripe = getStripe()

    // Get all customers with this email from Stripe directly
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 10
    })

    console.log(`📧 Found ${customers.data.length} Stripe customers for ${user.email}`)

    if (!customers.data || customers.data.length === 0) {
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    // Check subscriptions for each customer
    for (const customer of customers.data) {
      console.log(`👤 Checking customer: ${customer.id}`)
      
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 10
      })

      for (const subscription of subscriptions.data) {
        console.log(`💳 Subscription ${subscription.id}: status="${subscription.status}"`)
        
        if (['active', 'trialing', 'incomplete', 'past_due'].includes(subscription.status)) {
          console.log(`✅ FOUND ACTIVE SUBSCRIPTION! Status: ${subscription.status}`)
          return NextResponse.json({
            hasActiveSubscription: true,
            subscription: {
              id: subscription.id,
              status: subscription.status,
              current_period_end: (subscription as any).current_period_end,
              customer: subscription.customer
            }
          })
        }
      }
    }

    console.log('❌ No active subscriptions found')
    return NextResponse.json({ hasActiveSubscription: false, subscription: null })

  } catch (error: any) {
    console.error('Stripe subscription check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'