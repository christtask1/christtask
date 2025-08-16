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

    // 2) Direct query: find any subscription for this user's email
    const { data: userSubs, error: userSubsError } = await supabase
      .from('subscriptions')
      .select(`
        id, attrs, current_period_end, customer,
        customers!inner(email)
      `)
      .eq('customers.email', user.email)
      .limit(10)

    if (userSubsError) {
      console.log('Direct subscription lookup failed:', userSubsError)
      return NextResponse.json({ hasActiveSubscription: false, subscription: null })
    }

    if (Array.isArray(userSubs) && userSubs.length > 0) {
      console.log(`🔍 Found ${userSubs.length} subscriptions for email ${user.email}`)
      
      for (const sub of userSubs) {
        const status = sub.attrs?.status || (sub as any).status
        console.log(`💳 Subscription ${sub.id}: status="${status}"`)
        
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
