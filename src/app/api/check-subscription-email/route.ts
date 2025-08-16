import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '../../../lib/auth'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Method: Link via email (no mapping table needed)
    // Step 1: Find Stripe customer by email
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', user.email)

    if (customerError) {
      console.error('Customer lookup error:', customerError)
      return NextResponse.json({ error: 'Failed to find customer' }, { status: 500 })
    }

    if (!customers || customers.length === 0) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null
      })
    }

    const customerId = customers[0].id

    // Step 2: Find active subscriptions for this customer
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, status, current_period_end, customer, currency')
      .eq('customer', customerId)
      .in('status', ['active', 'trialing'])
      .order('current_period_end', { ascending: false })
      .limit(1)

    if (subscriptionError) {
      console.error('Subscription lookup error:', subscriptionError)
      return NextResponse.json({ error: 'Failed to check subscriptions' }, { status: 500 })
    }

    const hasActiveSubscription = subscriptions && subscriptions.length > 0

    return NextResponse.json({
      hasActiveSubscription,
      subscription: hasActiveSubscription ? subscriptions[0] : null
    })

  } catch (error: any) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
