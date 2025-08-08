import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan, email, password } = await req.json()

    // Define pricing based on plan
    const prices = {
      weekly: {
        amount: 450, // £4.50 in pence
        currency: 'gbp',
        interval: 'week'
      },
      monthly: {
        amount: 1199, // £11.99 in pence
        currency: 'gbp',
        interval: 'month'
      }
    }

    const selectedPrice = prices[plan as keyof typeof prices]

    if (!selectedPrice) {
      throw new Error('Invalid plan selected')
    }

    // Create or get user
    let user
    try {
      const { data: { user: existingUser }, error: getUserError } = await supabase.auth.getUser()
      
      if (getUserError || !existingUser) {
        // Create new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (signUpError) {
          throw new Error(`Signup error: ${signUpError.message}`)
        }
        
        user = signUpData.user
      } else {
        user = existingUser
      }
    } catch (error: unknown) {
      throw new Error(`User creation error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        user_id: user.id,
        plan: plan
      }
    })

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: selectedPrice.amount,
      currency: selectedPrice.currency,
      customer: customer.id,
      metadata: {
        user_id: user.id,
        plan: plan,
        email: email
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: unknown) {
    console.error('Payment intent error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 