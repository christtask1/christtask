'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
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
  const [couponCode, setCouponCode] = useState('')
  const [country, setCountry] = useState('GB')
  const [postalCode, setPostalCode] = useState('')

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
        card: elements.getElement(CardNumberElement)!,
        billing_details: {
          email,
          address: {
            country,
            postal_code: postalCode,
          },
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

  const cardElementOptions = {
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Number
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700">
          <CardNumberElement options={cardElementOptions} />
        </div>
      </div>

      {/* Card Details Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expiry Date
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700">
            <CardExpiryElement options={cardElementOptions} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CVC
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700">
            <CardCvcElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      {/* Country and Postal Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="NL">Netherlands</option>
            <option value="SE">Sweden</option>
            <option value="NO">Norway</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="CH">Switzerland</option>
            <option value="AT">Austria</option>
            <option value="BE">Belgium</option>
            <option value="IE">Ireland</option>
            <option value="PT">Portugal</option>
            <option value="PL">Poland</option>
            <option value="CZ">Czech Republic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter postal code"
            required
          />
        </div>
      </div>

      {/* Coupon Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Coupon Code (Optional)
        </label>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter coupon code"
        />
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
