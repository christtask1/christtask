import { supabase } from './supabase'

// Price IDs from your Stripe dashboard (these should match what you created)
const PRICE_IDS = {
  weekly: 'price_1Rsw3dFEfjI8S6GYpcOVkvSF', // £4.50/week
  monthly: 'price_1Rsw49FEfjI8S6GYhL8ih4Zi', // £11.99/month
} as const

export interface CreateSubscriptionParams {
  email: string
  plan: 'weekly' | 'monthly'
  paymentMethodId: string
  couponCode?: string
}

export interface SubscriptionResult {
  success: boolean
  subscriptionId?: string
  customerId?: string
  error?: string
}

export interface CouponValidationResult {
  valid: boolean
  coupon?: {
    id: string
    name: string
    percent_off?: number
    amount_off?: number
    currency?: string
  }
  error?: string
}

// Validate coupon using Supabase Stripe wrapper
export async function validateCoupon(couponCode: string): Promise<CouponValidationResult> {
  try {
    // Use Supabase RPC to call Stripe wrapper function
    const { data, error } = await supabase.rpc('validate_coupon', {
      coupon_code: couponCode
    })

    if (error) {
      console.error('Coupon validation error:', error)
      return { valid: false, error: error.message }
    }

    if (data && data.valid) {
      return { valid: true, coupon: data.coupon }
    } else {
      return { valid: false, error: data?.error || 'Invalid coupon' }
    }
  } catch (error) {
    console.error('Coupon validation failed:', error)
    return { valid: false, error: 'Failed to validate coupon' }
  }
}

// Create subscription using Supabase Stripe wrapper
export async function createSubscription({
  email,
  plan,
  paymentMethodId,
  couponCode,
}: CreateSubscriptionParams): Promise<SubscriptionResult> {
  try {
    console.log('Creating subscription with Stripe wrapper:', { email, plan, paymentMethodId, couponCode })

    // First, check if customer exists or create one
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single()

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error checking customer:', customerError)
      return { success: false, error: 'Failed to check customer' }
    }

    let customerId: string

    if (!customerData) {
      // Create customer using Stripe wrapper
      const { data: newCustomer, error: createError } = await supabase.rpc('create_customer', {
        email: email,
        payment_method_id: paymentMethodId
      })

      if (createError) {
        console.error('Customer creation error:', createError)
        return { success: false, error: createError.message }
      }

      customerId = newCustomer.id
      console.log('Customer created:', customerId)
    } else {
      customerId = customerData.id
      console.log('Customer found:', customerId)
    }

    // Create subscription using Stripe wrapper
    const subscriptionParams = {
      customer_id: customerId,
      price_id: PRICE_IDS[plan],
      payment_method_id: paymentMethodId,
      coupon_code: couponCode || null
    }

    const { data: subscriptionData, error: subscriptionError } = await supabase.rpc('create_subscription', subscriptionParams)

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError)
      return { success: false, error: subscriptionError.message }
    }

    console.log('Subscription created successfully:', subscriptionData)

    return {
      success: true,
      subscriptionId: subscriptionData.id,
      customerId: customerId,
    }
  } catch (error) {
    console.error('createSubscription error:', error)
    return {
      success: false,
      error: 'Failed to create subscription',
    }
  }
}

// Get prices from Stripe wrapper
export async function getPrices() {
  try {
    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('active', true)

    if (error) {
      console.error('Error fetching prices:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch prices:', error)
    return []
  }
}
