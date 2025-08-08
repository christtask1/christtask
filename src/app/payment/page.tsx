'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CardForm({ clientSecret, country }: { clientSecret: string | null; country: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!stripe || !elements) return
    if (!clientSecret) {
      alert('Click Continue first to prepare payment')
      return
    }
    setLoading(true)
    const card = elements.getElement(CardElement)
    const res = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card!,
        billing_details: {
          address: { country },
        },
      },
    })
    setLoading(false)
    if (!res.error) window.location.href = '/'
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button onClick={confirm} disabled={loading} style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', borderRadius: 6 }}>Pay</button>
    </div>
  )
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [coupon, setCoupon] = useState('')
  const [country, setCountry] = useState('GB')

  // TODO: Replace with your backend/RPC call to create a PaymentIntent or Subscription and return client_secret
  const createClientSecret = async () => {
    // placeholder: this should call your Supabase RPC and include coupon & country if needed
    alert('Wire this button to your Supabase RPC that returns a client_secret for PaymentElement.')
  }

  return (
    <Elements stripe={stripePromise}>
      <div style={{ maxWidth: 480 }}>
        <h1>Payment</h1>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <div>Coupon (optional)</div>
            <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter coupon or promo code" />
          </label>
          <label>
            <div>Country</div>
            <select value={country} onChange={e=>setCountry(e.target.value)}>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </label>
          <CardForm clientSecret={clientSecret} country={country} />
          <div style={{ display:'flex', gap: 8 }}>
            <button onClick={createClientSecret} style={{ padding: '10px 16px', background: '#64748b', color: '#fff', borderRadius: 6 }}>Continue</button>
          </div>
        </div>
      </div>
    </Elements>
  )
}


