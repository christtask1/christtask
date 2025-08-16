import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '../../../lib/auth'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Looking for subscriptions for user:', user.id, 'email:', user.email)
    
    // DIRECT APPROACH: Get all active subscriptions and check which belong to our email
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('id, attrs, current_period_end, customer')
      .limit(100) // Get more to ensure we find it

    if (subError) {
      console.log('⚠️ Subscription query failed:', subError)
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('❌ No subscriptions found in database')
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    console.log(`🎯 Found ${subscriptions.length} total subscriptions, checking each one`)

    // Get all customers for email matching
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('id, email')
      .eq('email', user.email)

    if (custError || !customers) {
      console.log('⚠️ Customer query failed:', custError)
    }

    const customerIds = customers?.map(c => c.id) || []
    console.log(`📧 Found ${customerIds.length} customers for email ${user.email}:`, customerIds)

    // Check each subscription
    for (const sub of subscriptions) {
      const status = sub.attrs?.status
      const isOurCustomer = customerIds.includes(sub.customer)
      
      console.log(`💳 Subscription ${sub.id}: status="${status}", customer="${sub.customer}", isOurs=${isOurCustomer}`)
      
      if (isOurCustomer && ['active', 'trialing', 'incomplete', 'past_due'].includes(status)) {
        console.log(`✅ FOUND ACTIVE SUBSCRIPTION! Status: ${status}`)
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
    console.log('❌ No active subscriptions found for this user')
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