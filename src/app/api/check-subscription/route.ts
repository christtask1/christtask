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

    // 2) Also match by email (case-insensitive)
    const { data: byEmail, error: emailError } = await supabase
      .from('customers')
      .select('id')
      .ilike('email', user.email || '')

    console.log('📧 Found by email:', byEmail?.length || 0, 'Error:', emailError)
    if (emailError) {
      console.error('Customer lookup error:', emailError)
    }
    if (Array.isArray(byEmail)) {
      for (const c of byEmail) if (c?.id) possibleCustomerIds.push(c.id)
    }

    // Deduplicate ids
    const uniqueCustomerIds = Array.from(new Set(possibleCustomerIds))
    console.log('🎯 Unique customer IDs found:', uniqueCustomerIds)

    if (uniqueCustomerIds.length === 0) {
      console.log('❌ No customer IDs found, returning false')
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    // Check each potential customer for an active/trialing subscription
    for (const customerId of uniqueCustomerIds) {
      // Note: In Stripe FDW, status is in attrs JSON, not a direct column
      const { data: subscriptions, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('id, attrs, current_period_end, customer')
        .eq('customer', customerId)
        .order('current_period_end', { ascending: false })
        .limit(10)

      if (subscriptionError) {
        console.warn('Subscription lookup error for', customerId, subscriptionError)
        continue
      }

      if (Array.isArray(subscriptions) && subscriptions.length > 0) {
        console.log(`🔍 Found ${subscriptions.length} subscriptions for customer ${customerId}`)
        // Check each subscription for active/trialing status
        for (const sub of subscriptions) {
          const status = sub.attrs?.status || (sub as any).status
          console.log(`💳 Subscription ${sub.id}: status="${status}", attrs:`, sub.attrs)
          if (['active', 'trialing', 'incomplete', 'past_due'].includes(status)) {
            console.log(`✅ Accepting subscription with status: ${status}`)
            return NextResponse.json({
              hasActiveSubscription: true,
              subscription: {
                id: sub.id,
                status: status,
                current_period_end: sub.current_period_end,
                customer: sub.customer,
                attrs: sub.attrs
              }
            })
          } else {
            console.log(`❌ Rejecting subscription with status: ${status}`)
          }
        }
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
