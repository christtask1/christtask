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
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      console.error('No stripe-signature header found')
      return new Response(
        JSON.stringify({ error: 'No signature found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        },
      )
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('Webhook secret not configured')
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Payment successful for session:', session.id)
        
        // Upsert subscription record
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            customer: session.customer as string,
            current_period_end: new Date(session.subscription_data?.trial_end * 1000 || Date.now()).toISOString(),
            attrs: {
              user_id: session.metadata?.user_id,
              stripe_subscription_id: session.subscription as string,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          })
        
        if (upsertError) {
          console.error('Error upserting subscription:', upsertError)
        } else {
          console.log('Subscription record upserted successfully')
        }
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription updated:', updatedSubscription.id)
        
        // Update subscription record
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            attrs: {
              status: updatedSubscription.status,
              updated_at: new Date().toISOString()
            }
          })
          .eq('attrs->stripe_subscription_id', updatedSubscription.id)
        
        if (updateError) {
          console.error('Error updating subscription:', updateError)
        } else {
          console.log('Subscription record updated successfully')
        }
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log('Subscription deleted:', deletedSubscription.id)
        
        // Mark subscription as cancelled
        const { error: deleteError } = await supabase
          .from('subscriptions')
          .update({
            attrs: {
              status: 'cancelled',
              updated_at: new Date().toISOString()
            }
          })
          .eq('attrs->stripe_subscription_id', deletedSubscription.id)
        
        if (deleteError) {
          console.error('Error cancelling subscription:', deleteError)
        } else {
          console.log('Subscription marked as cancelled successfully')
        }
        break

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription created:', subscription.id)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded for invoice:', invoice.id)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', failedInvoice.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: unknown) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
}) 