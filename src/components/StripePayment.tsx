'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { supabase } from '@/lib/supabaseClient'

interface StripePaymentProps {
  selectedPlan: 'weekly' | 'monthly'
  email: string
  onSuccess: () => void
  onError: (error: string) => void
}

type PriceRow = {
  id: string
  active: boolean
  currency: string | null
  unit_amount: number | null
  product: string | null
  product_name: string | null
}

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = loadStripe(publishableKey)

function CardForm({ clientSecret, subscriptionId, onSuccess, onError }: { clientSecret: string; subscriptionId: string; onSuccess: () => void; onError: (e: string) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const confirmPayment = async () => {
    if (!stripe || !elements || !clientSecret) return
    setLoading(true)
    const result = await stripe.confirmPayment({ elements, clientSecret, redirect: 'if_required' })
    setLoading(false)
    if (result.error) {
      onError(result.error.message || 'Payment failed')
      return
    }
    const { error } = await supabase.rpc('mark_subscription_active', { stripe_subscription_id: subscriptionId })
    if (error) {
      onError('Payment succeeded but failed to mark subscription active.')
      return
    }
    onSuccess()
  }

  return (
    <>
      <PaymentElement />
      <button
        onClick={confirmPayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        {loading ? 'Processing…' : 'Pay now'}
      </button>
    </>
  )
}

function PaymentFlow({
  selectedPlan,
  email,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [priceId, setPriceId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)
  const [couponPreview, setCouponPreview] = useState<string | null>(null)

  // Load prices and pick based on product name containing weekly/monthly
  useEffect(() => {
    const loadPrice = async () => {
      const { data, error } = await supabase.rpc('get_active_prices')
      if (error) {
        onError('Failed to load prices')
        return
      }
      const prices = (data as PriceRow[]) || []
      const match = prices.find((p) =>
        (p.product_name || '').toLowerCase().includes(selectedPlan === 'weekly' ? 'week' : 'month')
      )
      if (!match) {
        onError('No matching price found. Ensure your product names contain "week" or "month".')
        return
      }
      setPriceId(match.id)
    }
    loadPrice()
  }, [selectedPlan, onError])

  // Validate coupon preview
  useEffect(() => {
    const run = async () => {
      if (!couponCode) {
        setCouponPreview(null)
        return
      }
      const { data, error } = await supabase.rpc('validate_coupon', { coupon_code: couponCode })
      if (error || !data || !data[0]) {
        setCouponPreview('Invalid coupon')
        return
      }
      const row = data[0]
      if (!row.valid) {
        setCouponPreview('Invalid coupon')
        return
      }
      const c = row.coupon
      if (c?.percent_off) setCouponPreview(`${c.percent_off}% off`)
      else if (c?.amount_off && c?.currency) setCouponPreview(`${c.amount_off / 100} ${c.currency.toUpperCase()} off`)
      else if (row.is_promotion_code) setCouponPreview('Promotion code applied')
      else setCouponPreview('Coupon applied')
    }
    run()
  }, [couponCode])

  const startPayment = async () => {
    try {
      if (!priceId) {
        onError('Price not selected')
        return
      }

      // Ensure authenticated session present
      // Allow proceeding. If the server rejects due to auth, the RPC will fail and we display that.

      // Get or create customer
      const { data: custRows, error: custErr } = await supabase.rpc('get_or_create_customer', { user_email: email })
      if (custErr || !custRows || !custRows[0]?.customer_id) {
        onError('Failed to get customer')
        return
      }
      const customerId = custRows[0].customer_id as string

      // Create subscription and get client secret
      const plan = selectedPlan
      const { data: subRows, error: subErr } = await supabase.rpc('create_subscription', {
        price_id: priceId,
        customer_id: customerId,
        plan,
        coupon_code: couponCode || null,
      })
      if (subErr || !subRows || !subRows[0]?.client_secret || !subRows[0]?.stripe_subscription_id) {
        onError('Failed to create subscription')
        return
      }
      setClientSecret(subRows[0].client_secret as string)
      setSubscriptionId(subRows[0].stripe_subscription_id as string)
    } catch (e) {
      onError('Unexpected error starting payment')
    }
  }

  return (
    <div className="space-y-4">
      {!clientSecret ? (
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Coupon Code (optional)</label>
        <input
          type="text"
          value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.trim())}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="COUPONID"
        />
            {couponPreview && (
              <p className="mt-2 text-sm {couponPreview==='Invalid coupon' ? 'text-red-600' : 'text-green-600'}">
                {couponPreview}
              </p>
            )}
      </div>

      <button
            onClick={startPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
            Continue to card details
      </button>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <div className="space-y-4">
            <CardForm
              clientSecret={clientSecret}
              subscriptionId={subscriptionId!}
        onSuccess={onSuccess}
        onError={onError}
      />
          </div>
        </Elements>
      )}
    </div>
  )
}

export default function StripePayment(props: StripePaymentProps) {
  return (
    <div className="w-full">
      {publishableKey ? <PaymentFlow {...props} /> : <p className="text-red-600 text-sm">Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</p>}
    </div>
  )
}
