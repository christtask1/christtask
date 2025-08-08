'use client'

import { useState } from 'react'
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
      alert('Click Prepare payment first')
      return
    }
    setLoading(true)
    const card = elements.getElement(CardElement)
    const res = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card!,
        billing_details: { address: { country } },
      },
    })
    setLoading(false)
    if (!res.error) window.location.href = '/success'
  }

  return (
    <div className="form-block">
      <label className="label">Card details</label>
      <div className="card-shell">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: 'var(--text)',
                iconColor: 'var(--brand)',
                fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
                '::placeholder': { color: 'var(--muted)' },
              },
              invalid: { color: '#ff6b6b' },
            },
          }}
        />
      </div>
      <button className="btn" onClick={confirm} disabled={loading}>{loading ? 'Processing…' : 'Pay now'}</button>
    </div>
  )
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [coupon, setCoupon] = useState('')
  const [country, setCountry] = useState('GB')

  // TODO: Replace with your backend/RPC call to create a PaymentIntent or Subscription and return client_secret
  const createClientSecret = async () => {
    alert('Wire this button to your Supabase RPC that returns a client_secret for CardElement.')
    // setClientSecret('pi_client_secret_xxx')
  }

  return (
    <Elements stripe={stripePromise}>
      <section className="section">
        <div className="container grid grid-2" style={{ gap: 28, alignItems: 'start' }}>
          <div className="card" style={{ padding: 28 }}>
            <span className="pill">Secure checkout</span>
            <h2 style={{ marginTop: 10 }}>Complete your subscription</h2>
            <p className="muted" style={{ marginTop: 6 }}>Enter any valid promotion code, choose your country, and pay securely with your card.</p>
            <ul className="muted" style={{ marginTop: 14, lineHeight: 1.9 }}>
              <li>256‑bit SSL, PCI‑compliant processing</li>
              <li>Cancel anytime from your account</li>
              <li>Instant access after payment</li>
            </ul>
          </div>

          <div className="pay-card">
            <h3>Payment details</h3>
            <div className="form-block">
              <label className="label">Coupon (optional)</label>
              <input className="input" value={coupon} onChange={(e)=>setCoupon(e.target.value)} placeholder="Enter coupon or promo code" />
            </div>
            <div className="form-block">
              <label className="label">Country</label>
              <select className="select" value={country} onChange={(e)=>setCountry(e.target.value)}>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>

            <CardForm clientSecret={clientSecret} country={country} />

            {!clientSecret && (
              <button className="btn secondary" onClick={createClientSecret}>Prepare payment</button>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .pay-card { background: linear-gradient(180deg, rgba(23,35,74,0.55), rgba(16,24,48,0.8)); border:1px solid var(--border); border-radius:16px; padding:22px; }
        .form-block { display:grid; gap:8px; margin-top:14px; }
        .label { font-weight:700; color: var(--text); font-size:14px; }
        .input, .select { width:100%; background:#0e1530; color:var(--text); border:1px solid var(--border); border-radius:10px; padding:12px 14px; outline:none; }
        .input::placeholder { color: var(--muted); }
        .card-shell { border:1px dashed var(--border); border-radius:12px; padding:14px; background:#0e1530; }
      `}</style>
    </Elements>
  )
}


