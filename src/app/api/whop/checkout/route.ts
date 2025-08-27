import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()
    
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    // Initialize Whop checkout with server-side API key
    const whopResponse = await fetch('https://api.whop.com/api/v2/checkout_sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: planId,
        success_url: 'https://christtask.com/chat',
        cancel_url: 'https://christtask.com/payment',
      }),
    })

    if (!whopResponse.ok) {
      console.error('Whop checkout error:', await whopResponse.text())
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    const checkoutData = await whopResponse.json()
    
    return NextResponse.json({
      checkout_url: checkoutData.checkout_url,
      session_id: checkoutData.id
    })

  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
