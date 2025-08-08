// Stripe service for subscription creation
export interface CreateSubscriptionParams {
  email: string
  plan: 'weekly' | 'monthly'
  paymentMethodId: string
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

export async function createSubscription({
  email,
  plan,
  paymentMethodId,
}: CreateSubscriptionParams): Promise<SubscriptionResult> {
  try {
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
      const error = await customerResponse.json()
      return { success: false, error: error.message || 'Failed to create customer' }
    }

    const { customerId } = await customerResponse.json()

    // Create subscription
    const subscriptionResponse = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        priceId: PRICE_IDS[plan],
      }),
    })

    if (!subscriptionResponse.ok) {
      const error = await subscriptionResponse.json()
      return { success: false, error: error.message || 'Failed to create subscription' }
    }

    const { subscriptionId } = await subscriptionResponse.json()

    return {
      success: true,
      subscriptionId,
      customerId,
    }
  } catch {
    return {
      success: false,
      error: 'Failed to create subscription',
    }
  }
}
