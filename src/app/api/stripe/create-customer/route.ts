import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, paymentMethodId } = await request.json()

    // Create customer using Stripe API
    const response = await fetch('https://api.stripe.com/v1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email,
        payment_method: paymentMethodId,
        invoice_settings: JSON.stringify({
          default_payment_method: paymentMethodId,
        }),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.error?.message || 'Failed to create customer' }, { status: 400 })
    }

    const customer = await response.json()

    return NextResponse.json({
      customerId: customer.id,
      email: customer.email,
    })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
