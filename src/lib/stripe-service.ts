// Stripe service for subscription creation
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

// Your price IDs from the SQL queries
const PRICE_IDS = {
  weekly: 'price_1Rsw3dFEfjI8S6GYpcOVkvSF', // £4.50/week
  monthly: 'price_1Rsw49FEfjI8S6GYhL8ih4Zi', // £11.99/month
  } as const

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

export async function validateCoupon(couponCode: string): Promise<CouponValidationResult> {
  try {
    const response = await fetch('/api/stripe/validate-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ couponCode }),
    })

    if (!response.ok) {
      const error = await response.json()
      return { valid: false, error: error.message || 'Invalid coupon' }
    }

    const coupon = await response.json()
    return { valid: true, coupon }
  } catch {
    return { valid: false, error: 'Failed to validate coupon' }
  }
}

export async function createSubscription({
  email,
  plan,
  paymentMethodId,
  couponCode,
}: CreateSubscriptionParams): Promise<SubscriptionResult> {
  try {
    console.log('Creating subscription for:', { email, plan, paymentMethodId, couponCode })
    
    // Create customer
    const customerResponse = await fetch('/api/stripe/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        paymentMethodId,
      }),
    })

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json()
      console.error('Customer creation failed:', errorData)
      return { success: false, error: errorData.error || 'Failed to create customer' }
    }

    const customerData = await customerResponse.json()
    console.log('Customer created successfully:', customerData)
    const { customerId } = customerData

    // Create subscription
    const subscriptionResponse = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        priceId: PRICE_IDS[plan],
        couponCode,
      }),
    })

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.json()
      console.error('Subscription creation failed:', errorData)
      return { success: false, error: errorData.error || 'Failed to create subscription' }
    }

    const subscriptionData = await subscriptionResponse.json()
    console.log('Subscription created successfully:', subscriptionData)
    const { subscriptionId } = subscriptionData

    return {
      success: true,
      subscriptionId,
      customerId,
    }
  } catch (error) {
    console.error('createSubscription error:', error)
    return {
      success: false,
      error: 'Failed to create subscription',
    }
  }
}
