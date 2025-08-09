'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { supabase } from '../../lib/supabaseClient'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CardForm({
  clientSecret,
  country,
  plan,
  coupon,
  onClientSecret,
  user,
}: {
  clientSecret: string | null
  country: string
  plan: string
  coupon: string
  onClientSecret: (secret: string) => void
  user: any
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

    const confirm = async () => {
    if (!stripe || !elements || !user) return
    setLoading(true)
    try {
      let secret = clientSecret
      if (!secret) {
        const { data, error } = await supabase.rpc('create_subscription_for_price', {
          price_id: plan,
          coupon,
        })
        if (error) throw error
        secret = data.client_secret as string
        onClientSecret(secret)
      }

      const card = elements.getElement(CardElement)
      const res = await stripe.confirmCardPayment(secret!, {
        payment_method: {
          card: card!,
          billing_details: { address: { country } },
        },
      })
      if (!res.error) window.location.href = '/success'
      else alert(res.error.message || 'Payment failed')
    } catch (err: any) {
      console.error('Payment error:', err)
      alert(err?.message || 'Unable to start payment')
    }
    setLoading(false)
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
      <button className="btn" onClick={confirm} disabled={loading || !user}>{loading ? 'Processing…' : user ? 'Pay now' : 'Please sign up first'}</button>
    </div>
  )
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [coupon, setCoupon] = useState('')
  const [country, setCountry] = useState('GB')
  const [plan, setPlan] = useState<string>('')
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  // Check for existing session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const COUNTRIES: { code: string; name: string }[] = [
    { code: 'AF', name: 'Afghanistan' },
    { code: 'AL', name: 'Albania' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'AS', name: 'American Samoa' },
    { code: 'AD', name: 'Andorra' },
    { code: 'AO', name: 'Angola' },
    { code: 'AI', name: 'Anguilla' },
    { code: 'AQ', name: 'Antarctica' },
    { code: 'AG', name: 'Antigua and Barbuda' },
    { code: 'AR', name: 'Argentina' },
    { code: 'AM', name: 'Armenia' },
    { code: 'AW', name: 'Aruba' },
    { code: 'AU', name: 'Australia' },
    { code: 'AT', name: 'Austria' },
    { code: 'AZ', name: 'Azerbaijan' },
    { code: 'BS', name: 'Bahamas' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'BB', name: 'Barbados' },
    { code: 'BY', name: 'Belarus' },
    { code: 'BE', name: 'Belgium' },
    { code: 'BZ', name: 'Belize' },
    { code: 'BJ', name: 'Benin' },
    { code: 'BM', name: 'Bermuda' },
    { code: 'BT', name: 'Bhutan' },
    { code: 'BO', name: 'Bolivia' },
    { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
    { code: 'BA', name: 'Bosnia and Herzegovina' },
    { code: 'BW', name: 'Botswana' },
    { code: 'BV', name: 'Bouvet Island' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IO', name: 'British Indian Ocean Territory' },
    { code: 'BN', name: 'Brunei Darussalam' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'BF', name: 'Burkina Faso' },
    { code: 'BI', name: 'Burundi' },
    { code: 'KH', name: 'Cambodia' },
    { code: 'CM', name: 'Cameroon' },
    { code: 'CA', name: 'Canada' },
    { code: 'CV', name: 'Cape Verde' },
    { code: 'KY', name: 'Cayman Islands' },
    { code: 'CF', name: 'Central African Republic' },
    { code: 'TD', name: 'Chad' },
    { code: 'CL', name: 'Chile' },
    { code: 'CN', name: 'China' },
    { code: 'CX', name: 'Christmas Island' },
    { code: 'CC', name: 'Cocos (Keeling) Islands' },
    { code: 'CO', name: 'Colombia' },
    { code: 'KM', name: 'Comoros' },
    { code: 'CG', name: 'Congo' },
    { code: 'CD', name: 'Congo, the Democratic Republic of the' },
    { code: 'CK', name: 'Cook Islands' },
    { code: 'CR', name: 'Costa Rica' },
    { code: 'CI', name: "Côte d'Ivoire" },
    { code: 'HR', name: 'Croatia' },
    { code: 'CU', name: 'Cuba' },
    { code: 'CW', name: 'Curaçao' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'CZ', name: 'Czechia' },
    { code: 'DK', name: 'Denmark' },
    { code: 'DJ', name: 'Djibouti' },
    { code: 'DM', name: 'Dominica' },
    { code: 'DO', name: 'Dominican Republic' },
    { code: 'EC', name: 'Ecuador' },
    { code: 'EG', name: 'Egypt' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'GQ', name: 'Equatorial Guinea' },
    { code: 'ER', name: 'Eritrea' },
    { code: 'EE', name: 'Estonia' },
    { code: 'SZ', name: 'Eswatini' },
    { code: 'ET', name: 'Ethiopia' },
    { code: 'FK', name: 'Falkland Islands (Malvinas)' },
    { code: 'FO', name: 'Faroe Islands' },
    { code: 'FJ', name: 'Fiji' },
    { code: 'FI', name: 'Finland' },
    { code: 'FR', name: 'France' },
    { code: 'GF', name: 'French Guiana' },
    { code: 'PF', name: 'French Polynesia' },
    { code: 'TF', name: 'French Southern Territories' },
    { code: 'GA', name: 'Gabon' },
    { code: 'GM', name: 'Gambia' },
    { code: 'GE', name: 'Georgia' },
    { code: 'DE', name: 'Germany' },
    { code: 'GH', name: 'Ghana' },
    { code: 'GI', name: 'Gibraltar' },
    { code: 'GR', name: 'Greece' },
    { code: 'GL', name: 'Greenland' },
    { code: 'GD', name: 'Grenada' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GU', name: 'Guam' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'GG', name: 'Guernsey' },
    { code: 'GN', name: 'Guinea' },
    { code: 'GW', name: 'Guinea-Bissau' },
    { code: 'GY', name: 'Guyana' },
    { code: 'HT', name: 'Haiti' },
    { code: 'HM', name: 'Heard Island and McDonald Islands' },
    { code: 'VA', name: 'Holy See (Vatican City State)' },
    { code: 'HN', name: 'Honduras' },
    { code: 'HK', name: 'Hong Kong' },
    { code: 'HU', name: 'Hungary' },
    { code: 'IS', name: 'Iceland' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'IR', name: 'Iran, Islamic Republic of' },
    { code: 'IQ', name: 'Iraq' },
    { code: 'IE', name: 'Ireland' },
    { code: 'IM', name: 'Isle of Man' },
    { code: 'IL', name: 'Israel' },
    { code: 'IT', name: 'Italy' },
    { code: 'JM', name: 'Jamaica' },
    { code: 'JP', name: 'Japan' },
    { code: 'JE', name: 'Jersey' },
    { code: 'JO', name: 'Jordan' },
    { code: 'KZ', name: 'Kazakhstan' },
    { code: 'KE', name: 'Kenya' },
    { code: 'KI', name: 'Kiribati' },
    { code: 'KP', name: "Korea, Democratic People's Republic of" },
    { code: 'KR', name: 'Korea, Republic of' },
    { code: 'KW', name: 'Kuwait' },
    { code: 'KG', name: 'Kyrgyzstan' },
    { code: 'LA', name: "Lao People's Democratic Republic" },
    { code: 'LV', name: 'Latvia' },
    { code: 'LB', name: 'Lebanon' },
    { code: 'LS', name: 'Lesotho' },
    { code: 'LR', name: 'Liberia' },
    { code: 'LY', name: 'Libya' },
    { code: 'LI', name: 'Liechtenstein' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'MO', name: 'Macao' },
    { code: 'MG', name: 'Madagascar' },
    { code: 'MW', name: 'Malawi' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'MV', name: 'Maldives' },
    { code: 'ML', name: 'Mali' },
    { code: 'MT', name: 'Malta' },
    { code: 'MH', name: 'Marshall Islands' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'MR', name: 'Mauritania' },
    { code: 'MU', name: 'Mauritius' },
    { code: 'YT', name: 'Mayotte' },
    { code: 'MX', name: 'Mexico' },
    { code: 'FM', name: 'Micronesia, Federated States of' },
    { code: 'MD', name: 'Moldova, Republic of' },
    { code: 'MC', name: 'Monaco' },
    { code: 'MN', name: 'Mongolia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MS', name: 'Montserrat' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MZ', name: 'Mozambique' },
    { code: 'MM', name: 'Myanmar' },
    { code: 'NA', name: 'Namibia' },
    { code: 'NR', name: 'Nauru' },
    { code: 'NP', name: 'Nepal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'NC', name: 'New Caledonia' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'NE', name: 'Niger' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'NU', name: 'Niue' },
    { code: 'NF', name: 'Norfolk Island' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'MP', name: 'Northern Mariana Islands' },
    { code: 'NO', name: 'Norway' },
    { code: 'OM', name: 'Oman' },
    { code: 'PK', name: 'Pakistan' },
    { code: 'PW', name: 'Palau' },
    { code: 'PS', name: 'Palestine, State of' },
    { code: 'PA', name: 'Panama' },
    { code: 'PG', name: 'Papua New Guinea' },
    { code: 'PY', name: 'Paraguay' },
    { code: 'PE', name: 'Peru' },
    { code: 'PH', name: 'Philippines' },
    { code: 'PN', name: 'Pitcairn' },
    { code: 'PL', name: 'Poland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'PR', name: 'Puerto Rico' },
    { code: 'QA', name: 'Qatar' },
    { code: 'RE', name: 'Réunion' },
    { code: 'RO', name: 'Romania' },
    { code: 'RU', name: 'Russian Federation' },
    { code: 'RW', name: 'Rwanda' },
    { code: 'BL', name: 'Saint Barthélemy' },
    { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
    { code: 'KN', name: 'Saint Kitts and Nevis' },
    { code: 'LC', name: 'Saint Lucia' },
    { code: 'MF', name: 'Saint Martin (French part)' },
    { code: 'PM', name: 'Saint Pierre and Miquelon' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines' },
    { code: 'WS', name: 'Samoa' },
    { code: 'SM', name: 'San Marino' },
    { code: 'ST', name: 'Sao Tome and Principe' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'SN', name: 'Senegal' },
    { code: 'RS', name: 'Serbia' },
    { code: 'SC', name: 'Seychelles' },
    { code: 'SL', name: 'Sierra Leone' },
    { code: 'SG', name: 'Singapore' },
    { code: 'SX', name: 'Sint Maarten (Dutch part)' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'SB', name: 'Solomon Islands' },
    { code: 'SO', name: 'Somalia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
    { code: 'SS', name: 'South Sudan' },
    { code: 'ES', name: 'Spain' },
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'SD', name: 'Sudan' },
    { code: 'SR', name: 'Suriname' },
    { code: 'SJ', name: 'Svalbard and Jan Mayen' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SY', name: 'Syrian Arab Republic' },
    { code: 'TW', name: 'Taiwan' },
    { code: 'TJ', name: 'Tajikistan' },
    { code: 'TZ', name: 'Tanzania, United Republic of' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TL', name: 'Timor-Leste' },
    { code: 'TG', name: 'Togo' },
    { code: 'TK', name: 'Tokelau' },
    { code: 'TO', name: 'Tonga' },
    { code: 'TT', name: 'Trinidad and Tobago' },
    { code: 'TN', name: 'Tunisia' },
    { code: 'TR', name: 'Türkiye' },
    { code: 'TM', name: 'Turkmenistan' },
    { code: 'TC', name: 'Turks and Caicos Islands' },
    { code: 'TV', name: 'Tuvalu' },
    { code: 'UG', name: 'Uganda' },
    { code: 'UA', name: 'Ukraine' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'UM', name: 'United States Minor Outlying Islands' },
    { code: 'UY', name: 'Uruguay' },
    { code: 'UZ', name: 'Uzbekistan' },
    { code: 'VU', name: 'Vanuatu' },
    { code: 'VE', name: 'Venezuela, Bolivarian Republic of' },
    { code: 'VN', name: 'Viet Nam' },
    { code: 'VG', name: 'Virgin Islands, British' },
    { code: 'VI', name: 'Virgin Islands, U.S.' },
    { code: 'WF', name: 'Wallis and Futuna' },
    { code: 'EH', name: 'Western Sahara' },
    { code: 'YE', name: 'Yemen' },
    { code: 'ZM', name: 'Zambia' },
    { code: 'ZW', name: 'Zimbabwe' },
  ]

  // Load live prices from Supabase RPC
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const { data, error } = await supabase.rpc('get_active_prices')
        if (error) throw error
        
        setPrices(data || [])
        // Set first price as default if available
        if (data && data.length > 0) {
          setPlan(data[0].id)
        }
      } catch (error: any) {
        console.error('Error loading prices:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        alert(`Failed to load subscription plans: ${error?.message || 'Unknown error'}. Please refresh.`)
      } finally {
        setLoading(false)
      }
    }
    
    loadPrices()
  }, [])

  // Handle auth (login/signup)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)
    
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (error: any) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  // Format price for display
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

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
              <label className="label">Choose your plan</label>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                  Loading subscription plans...
                </div>
              ) : (
                <div className="plan-grid">
                  {prices.map((price) => (
                    <button
                      key={price.id}
                      type="button"
                      className={`plan-card ${plan === price.id ? 'selected' : ''}`}
                      onClick={() => setPlan(price.id)}
                    >
                      <div className="plan-title">{price.product_name}</div>
                      <div className="plan-price">
                        {formatPrice(price.unit_amount, price.currency)}
                        <span className="plan-period">/{price.type === 'recurring' ? 'month' : 'one-time'}</span>
                      </div>
                      <ul className="plan-points">
                        <li>Full access</li>
                        <li>Cancel anytime</li>
                      </ul>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="form-block">
              <label className="label">Coupon (optional)</label>
              <input className="input" value={coupon} onChange={(e)=>setCoupon(e.target.value)} placeholder="Enter coupon or promo code" />
            </div>
            <div className="form-block">
              <label className="label">Country</label>
              <select className="select" value={country} onChange={(e)=>setCountry(e.target.value)}>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {!user && (
              <div className="form-block">
                <h4>{authMode === 'signup' ? 'Create account' : 'Log in'}</h4>
                <form onSubmit={handleAuth} style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                  <input 
                    className="input" 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                  <input 
                    className="input" 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  {authError && <div style={{ color: '#ff6b6b', fontSize: '14px' }}>{authError}</div>}
                  <button className="btn secondary" type="submit" disabled={authLoading}>
                    {authLoading ? 'Processing…' : authMode === 'signup' ? 'Create account' : 'Log in'}
                  </button>
                </form>
                <div style={{ marginTop: 12, fontSize: '14px', color: 'var(--muted)' }}>
                  {authMode === 'signup' ? 'Have an account?' : 'No account?'}{' '}
                  <button 
                    type="button" 
                    onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {authMode === 'signup' ? 'Log in' : 'Sign up'}
                  </button>
                </div>
              </div>
            )}

            {user && (
              <div className="form-block">
                <div style={{ color: 'var(--brand)', fontSize: '14px', marginBottom: 12 }}>
                  ✓ Signed in as {user.email}
                </div>
              </div>
            )}

            <CardForm
              clientSecret={clientSecret}
              country={country}
              plan={plan}
              coupon={coupon}
              onClientSecret={setClientSecret}
              user={user}
            />
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
        .plan-grid { display:grid; grid-template-columns: 1fr; gap:12px; }
        @media(min-width:700px){ .plan-grid { grid-template-columns: 1fr 1fr; } }
        .plan-card { text-align:left; border:1px solid var(--border); background:#0e1530; padding:16px; border-radius:12px; cursor:pointer; color:var(--text); }
        .plan-card:hover { border-color: var(--brand); box-shadow: 0 8px 24px rgba(78,123,255,0.18) }
        .plan-card.selected { border-color: var(--brand); outline: 2px solid rgba(78,123,255,0.35); }
        .plan-title { font-weight:800; margin-bottom:6px; }
        .plan-price { font-weight:800; font-size:20px; }
        .plan-period { font-weight:600; font-size:12px; color: var(--muted); margin-left:6px; }
        .plan-points { margin:10px 0 0; padding-left:18px; color: var(--muted); }
      `}</style>
    </Elements>
  )
}


