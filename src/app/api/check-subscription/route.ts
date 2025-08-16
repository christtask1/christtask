import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getAuthUserFromRequest } from '../../../lib/auth'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 1: Find the user's Stripe customer using their email
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
      subscription: hasActiveSubscription ? {
        id: subscriptions[0].id,
        status: subscriptions[0].status,
        current_period_end: subscriptions[0].current_period_end,
        customer: subscriptions[0].customer,
        currency: subscriptions[0].currency
      } : null
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
