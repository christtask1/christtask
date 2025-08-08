import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check if STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set')
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 })
    }

    const { email, paymentMethodId } = await request.json()

    // Validate required fields
    if (!email || !paymentMethodId) {
      return NextResponse.json({ error: 'Email and payment method are required' }, { status: 400 })
    }

    console.log('Creating customer for email:', email)

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
      const errorData = await response.json()
      console.error('Stripe API error:', errorData)
      return NextResponse.json({ 
        error: errorData.error?.message || `Failed to create customer: ${response.status}` 
      }, { status: response.status })
    }

    const customer = await response.json()
    console.log('Customer created successfully:', customer.id)

    return NextResponse.json({
      customerId: customer.id,
      email: customer.email,
    })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
