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

    // 2) Also search by email with exact and wildcard matching
    try {
      const { data: byEmail } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)

      console.log('📧 Found by exact email:', byEmail?.length || 0)
      if (Array.isArray(byEmail)) {
        for (const c of byEmail) if (c?.id) possibleCustomerIds.push(c.id)
      }
    } catch (e) {
      console.log('⚠️ Email search failed:', e)
    }

    // 3) Also try wildcard email search (case insensitive)
    try {
      const { data: byEmailWild } = await supabase
        .from('customers')
        .select('id')
        .ilike('email', `%${user.email || ''}%`)

      console.log('🔍 Found by wildcard email:', byEmailWild?.length || 0)
      if (Array.isArray(byEmailWild)) {
        for (const c of byEmailWild) if (c?.id) possibleCustomerIds.push(c.id)
      }
    } catch (e) {
      console.log('⚠️ Wildcard email search failed:', e)
    }

    // Remove duplicates
    const customerIds = Array.from(new Set(possibleCustomerIds))
    
    if (customerIds.length === 0) {
      console.log('❌ No customers found for user:', user.id, 'email:', user.email)
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    console.log(`🎯 Total unique customers found: ${customerIds.length}`, customerIds)
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
    console.log('🔎 Checking subscriptions:', subscriptions.map(s => ({ id: s.id, customer: s.customer, attrs: s.attrs })))
    
    for (const sub of subscriptions) {
      const status = sub.attrs?.status
      console.log(`💳 Subscription ${sub.id}: status="${status}", customer="${sub.customer}", attrs:`, sub.attrs)
      
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
      } else {
        console.log(`❌ Rejecting subscription with status: ${status}`)
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
