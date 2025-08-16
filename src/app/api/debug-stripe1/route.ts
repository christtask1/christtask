import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '../../../lib/auth'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Debug: Looking for user:', user.id, 'email:', user.email)

    // Check all customers
    const { data: allCustomers, error: custError } = await supabase
      .from('customers')
      .select('id, email, attrs')
      .limit(20)

    console.log('👥 All customers:', allCustomers?.length || 0)
    if (custError) console.log('Customer error:', custError)

    // Check customers for this email
    const { data: customersByEmail } = await supabase
      .from('customers')
      .select('id, email, attrs')
      .eq('email', user.email)

    console.log('📧 Customers by email:', customersByEmail?.length || 0)

    // Check all subscriptions
    const { data: allSubs, error: subError } = await supabase
      .from('subscriptions')
      .select('id, customer, attrs')
      .limit(20)

    console.log('📋 All subscriptions:', allSubs?.length || 0)
    if (subError) console.log('Subscription error:', subError)

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      allCustomers: allCustomers?.slice(0, 5), // First 5 only
      customersByEmail,
      allSubscriptions: allSubs?.slice(0, 5), // First 5 only
      counts: {
        totalCustomers: allCustomers?.length || 0,
        customersByEmail: customersByEmail?.length || 0,
        totalSubscriptions: allSubs?.length || 0
      }
    })

  } catch (error: any) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error.message },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
