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

    // Collect possible Stripe customer ids for this user
    const possibleCustomerIds: string[] = []
    
    console.log('🔍 Looking for customers for user:', user.id, 'email:', user.email)
    
    // 1) Prefer metadata linkage (we set supabase_uid when creating the customer)
    try {
      const { data: byMeta } = await supabase
        .from('customers')
        .select('id, attrs')
        .filter('attrs->metadata->>supabase_uid', 'eq', user.id)

      console.log('📋 Found by metadata:', byMeta?.length || 0)
      if (Array.isArray(byMeta)) {
        for (const c of byMeta) if (c?.id) possibleCustomerIds.push(c.id)
      }
    } catch (e) {
      console.log('⚠️ Metadata search failed:', e)
    }

    // 2) Use the exact same approach as your working SQL queries
    // First get customers by email
    const { data: customers } = await supabase
      .from('customers')
      .select('id')
      .eq('email', user.email)

    if (!customers || customers.length === 0) {
      console.log('No customers found for email:', user.email)
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    console.log(`Found ${customers.length} customers for email ${user.email}`)

    // Then get subscriptions for those customers
    const customerIds = customers.map(c => c.id)
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('id, attrs, current_period_end, customer')
      .in('customer', customerIds)

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found for customers:', customerIds)
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    console.log(`Found ${subscriptions.length} subscriptions for customers`)

    // Check each subscription for active status
    for (const sub of subscriptions) {
      const status = sub.attrs?.status
      console.log(`Subscription ${sub.id}: status="${status}"`)
      
      if (['active', 'trialing', 'incomplete', 'past_due'].includes(status)) {
        console.log(`✅ Accepting subscription with status: ${status}`)
        return NextResponse.json({
          hasActiveSubscription: true,
          subscription: {
            id: sub.id,
            status: status,
            current_period_end: sub.current_period_end,
            customer: sub.customer
          }
        })
      }
    }

    // None active
    return NextResponse.json({ hasActiveSubscription: false, subscription: null })

  } catch (error: any) {
    console.error('Subscription check error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
