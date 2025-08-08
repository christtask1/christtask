'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { createSubscription } from '@/lib/stripe-service'

// Load Stripe (you'll need to add your publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  selectedPlan: 'weekly' | 'monthly'
  email: string
  onSuccess: () => void
  onError: (error: string) => void
}

const PaymentForm = ({ selectedPlan, email, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      onError('Stripe not loaded')
      return
    }

    setLoading(true)

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
        billing_details: {
          email,
        },
      })

      if (paymentMethodError) {
        onError(paymentMethodError.message || 'Payment method creation failed')
        return
      }

      if (!paymentMethod) {
        onError('Failed to create payment method')
        return
      }

      // Create subscription using our service
      const result = await createSubscription({
        email,
        plan: selectedPlan,
        paymentMethodId: paymentMethod.id,
      })

      if (result.success) {
        onSuccess()
      } else {
        onError(result.error || 'Subscription creation failed')
      }
    } catch {
      onError('Payment processing failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        {loading ? 'Processing...' : `Subscribe to ${selectedPlan === 'weekly' ? 'Weekly' : 'Monthly'} Plan`}
      </button>
    </form>
  )
}

interface StripePaymentProps {
  selectedPlan: 'weekly' | 'monthly'
  email: string
  onSuccess: () => void
  onError: (error: string) => void
}

export default function StripePayment({ selectedPlan, email, onSuccess, onError }: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        selectedPlan={selectedPlan}
        email={email}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
