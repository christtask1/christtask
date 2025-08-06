import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
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
    const { plan, email, success_url, cancel_url } = await req.json()

    // Define pricing based on plan
    const prices = {
      weekly: {
        price_id: 'price_1Rsw3dFEfjI8S6GYpcOVkvSF',
        amount: 450,
        currency: 'gbp',
        interval: 'week'
      },
      monthly: {
        price_id: 'price_1Rsw49FEfjI8S6GYhL8ih4Zi',
        amount: 1199,
        currency: 'gbp',
        interval: 'month'
      }
    }

    const selectedPrice = prices[plan as keyof typeof prices]

    if (!selectedPrice) {
      throw new Error('Invalid plan selected')
    }

    // Create Stripe checkout session with Supabase integration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPrice.price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: email,
      metadata: {
        plan: plan,
        email: email,
      },
      // Enable automatic webhook handling
      subscription_data: {
        metadata: {
          plan: plan,
          email: email,
        }
      }
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 