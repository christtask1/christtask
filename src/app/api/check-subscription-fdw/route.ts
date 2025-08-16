import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '../../../lib/auth'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Method 1: If you have user_subscriptions mapping table
    try {
      // First get the user's Stripe subscription IDs
      const { data: userSubs, error: userSubsError } = await supabase
        .from('user_subscriptions')
        .select('stripe_subscription_id, stripe_customer_id')
        .eq('user_id', user.id)

      if (userSubsError) throw userSubsError

      if (!userSubs || userSubs.length === 0) {
        return NextResponse.json({
          hasActiveSubscription: false,
          subscription: null
        })
      }

      // Get the latest subscription ID
      const latestSubscriptionId = userSubs[0].stripe_subscription_id

      // Query the foreign table directly for real-time Stripe data
      const { data: stripeSubscription, error: stripeError } = await supabase
        .from('subscriptions')
        .select('id, status, current_period_end, customer')
        .eq('id', latestSubscriptionId)
        .single()

      if (stripeError) throw stripeError

      const isActive = stripeSubscription && 
        ['active', 'trialing'].includes(stripeSubscription.status)

      return NextResponse.json({
        hasActiveSubscription: isActive,
        subscription: isActive ? {
          id: stripeSubscription.id,
          status: stripeSubscription.status,
          current_period_end: stripeSubscription.current_period_end,
          customer: stripeSubscription.customer
        } : null
      })

    } catch (mappingError) {
      console.log('User subscriptions table not found, trying direct customer lookup')
      
      // Method 2: Direct lookup by customer email (fallback)
      const { data: customers, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)

      if (customerError || !customers || customers.length === 0) {
        return NextResponse.json({
          hasActiveSubscription: false,
          subscription: null
        })
      }

      const customerId = customers[0].id

      // Get subscriptions for this customer
      const { data: subscriptions, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('id, status, current_period_end, customer')
        .eq('customer', customerId)
        .in('status', ['active', 'trialing'])
        .order('current_period_end', { ascending: false })
        .limit(1)

      if (subscriptionError) throw subscriptionError

      const hasActiveSubscription = subscriptions && subscriptions.length > 0

      return NextResponse.json({
        hasActiveSubscription,
        subscription: hasActiveSubscription ? subscriptions[0] : null
      })
    }

  } catch (error: any) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
