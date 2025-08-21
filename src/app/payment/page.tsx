'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CardForm({
  clientSecret,
  country,
  setCountry,
  plan,
  coupon,
  onClientSecret,
  user,
  email,
  password,
}: {
  clientSecret: string | null
  country: string
  setCountry: (value: string) => void
  plan: string
  coupon: string
  onClientSecret: (secret: string) => void
  user: any
  email: string
  password: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCardExample, setShowCardExample] = useState(false)
  const [showExpiryExample, setShowExpiryExample] = useState(false)
  const [showCvcExample, setShowCvcExample] = useState(false)
  
  const stripe = useStripe()
  const elements = useElements()
  

  
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

  const confirm = async () => {
    if (!user && (!email || !password)) {
      alert('Please enter your email and password')
      return
    }
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please refresh the page.')
      return
    }
    
    setError(null)
    setLoading(true)
    
    try {
      let secret = clientSecret
      if (!secret) {
        // Create Stripe subscription via API route
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id || undefined
        const emailForStripe = session?.user?.email || email

        const response = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price_id: plan,
            coupon: coupon || undefined,
            user_id: userId,
            user_email: emailForStripe
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(`Failed to create subscription: ${error}`)
        }

        const data = await response.json()
        secret = data.client_secret
        
        if (data.intent_type === 'setup') {
          // Handle setup intent (no payment due)
          if (!user) {
            try {
              const { error: signUpError } = await supabase.auth.signUp({ email, password })
              if (signUpError && !/registered/i.test(signUpError.message)) throw signUpError
              if (signUpError && /registered/i.test(signUpError.message)) {
                await supabase.auth.signInWithPassword({ email, password })
              }
            } catch (e: any) { 
              setError(`Account creation failed: ${e.message}. Please contact support if this continues.`)
              setLoading(false)
              return
            }
          }
          window.location.href = '/loading'
          setLoading(false)
          return
        }
        
        if (!secret) {
          // Fallback: treat as success if no secret provided
          if (!user) {
            try {
              const { error: signUpError } = await supabase.auth.signUp({ email, password })
              if (signUpError && !/registered/i.test(signUpError.message)) throw signUpError
              if (signUpError && /registered/i.test(signUpError.message)) {
                await supabase.auth.signInWithPassword({ email, password })
              }
            } catch (e: any) { 
              setError(`Account creation failed after payment: ${e.message}. Please contact support with your payment confirmation.`)
              setLoading(false)
              return
            }
          }
          window.location.href = '/loading'
          setLoading(false)
          return
        }
        
        onClientSecret(secret)
      }

      // Now process the actual payment
      if (secret) {
        const { error: paymentError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/loading`,
          },
        })

        if (paymentError) {
          if (paymentError.type === 'card_error' || paymentError.type === 'validation_error') {
            setError(paymentError.message || 'Payment failed. Please check your card details.')
          } else {
            setError('An unexpected error occurred. Please try again.')
          }
          setLoading(false)
          return
        }

        // Payment successful - create account if needed
        if (!user) {
          try {
            const { error: signUpError } = await supabase.auth.signUp({ email, password })
            if (signUpError && !/registered/i.test(signUpError.message)) throw signUpError
            if (signUpError && /registered/i.test(signUpError.message)) {
              await supabase.auth.signInWithPassword({ email, password })
            }
          } catch (e: any) { 
            setError(`Account creation failed: ${e.message}. Please contact support.`)
            setLoading(false)
            return
          }
        }
        
        // Redirect to loading page
        window.location.href = '/loading'
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err?.message || 'Unable to process payment')
    }
    setLoading(false)
  }

  return (
    <div className="form-block">
      <label className="label">Card details</label>
      
      <div className="card-inputs">
        <div className="card-input-row">
          <div className="card-input-group">
            <div className="floating-label-container">
              <div className="stripe-card-element">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#000000',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        '::placeholder': {
                          color: '#9ca3af',
                        },
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-block">
        <label className="label">Country</label>
        <div className="floating-label-container">
          <select 
            className="card-input floating-input" 
            value={country} 
            onChange={(e)=>setCountry(e.target.value)}
            id="country"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <label htmlFor="country" className="floating-label">Country</label>
        </div>

      </div>
      
      {error && (
        <div style={{
          background: 'rgba(255,99,99,0.08)',
          border: '1px solid rgba(255,99,99,0.25)',
          color: '#ff8080',
          padding: '12px',
          borderRadius: 10,
          marginTop: 12,
          fontSize: 14
        }}>
          {error}
        </div>
      )}
      <button className="btn" onClick={confirm} disabled={loading}>
        {loading ? 'Processing…' : user ? 'Pay now' : 'Join Now →'}
      </button>
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
  const router = useRouter()
  const [fxRates, setFxRates] = useState<Record<string, number> | null>(null)

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

  // Map countries to primary currencies
  const COUNTRY_TO_CURRENCY: Record<string, string> = {
    GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR', PT: 'EUR', NL: 'EUR', BE: 'EUR', LU: 'EUR', AT: 'EUR',
    US: 'USD', CA: 'CAD', AU: 'AUD', NZ: 'NZD', JP: 'JPY', SG: 'SGD', HK: 'HKD', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK',
    AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR',
    NG: 'NGN', ZA: 'ZAR', KE: 'KES', GH: 'GHS', EG: 'EGP',
    IN: 'INR', PK: 'PKR', BD: 'BDT', LK: 'LKR', TH: 'THB', MY: 'MYR', ID: 'IDR', PH: 'PHP', VN: 'VND', KR: 'KRW', CN: 'CNY',
    BR: 'BRL', MX: 'MXN', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN',
    TR: 'TRY', IL: 'ILS', CZ: 'CZK', PL: 'PLN', HU: 'HUF', RO: 'RON'
  }

  // Configure Stripe price IDs per currency via env; fallback to GBP
  const PRICE_IDS = {
    GBP: {
      MONTHLY: process.env.NEXT_PUBLIC_PRICE_GBP_MONTHLY || 'price_1Rsw49FEfjI8S6GYhL8ih4Zi',
      WEEKLY: process.env.NEXT_PUBLIC_PRICE_GBP_WEEKLY || 'price_1Rsw3dFEfjI8S6GYpcOVkvSF',
      AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 },
    },
    USD: {
      MONTHLY: process.env.NEXT_PUBLIC_PRICE_USD_MONTHLY || '',
      WEEKLY: process.env.NEXT_PUBLIC_PRICE_USD_WEEKLY || '',
      AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 },
    },
    EUR: {
      MONTHLY: process.env.NEXT_PUBLIC_PRICE_EUR_MONTHLY || '',
      WEEKLY: process.env.NEXT_PUBLIC_PRICE_EUR_WEEKLY || '',
      AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 },
    },
    CAD: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_CAD_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_CAD_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    AUD: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_AUD_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_AUD_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    NZD: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_NZD_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_NZD_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    JPY: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_JPY_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_JPY_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    SGD: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_SGD_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_SGD_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    HKD: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_HKD_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_HKD_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    CHF: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_CHF_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_CHF_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    SEK: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_SEK_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_SEK_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    NOK: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_NOK_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_NOK_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    DKK: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_DKK_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_DKK_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    AED: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_AED_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_AED_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    SAR: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_SAR_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_SAR_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    QAR: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_QAR_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_QAR_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    KWD: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_KWD_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_KWD_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    NGN: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_NGN_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_NGN_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    ZAR: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_ZAR_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_ZAR_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    INR: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_INR_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_INR_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    BRL: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_BRL_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_BRL_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    MXN: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_MXN_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_MXN_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    TRY: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_TRY_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_TRY_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    ILS: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_ILS_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_ILS_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    CZK: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_CZK_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_CZK_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    PLN: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_PLN_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_PLN_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    HUF: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_HUF_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_HUF_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
    RON: { MONTHLY: process.env.NEXT_PUBLIC_PRICE_RON_MONTHLY || '', WEEKLY: process.env.NEXT_PUBLIC_PRICE_RON_WEEKLY || '', AMOUNTS: { MONTHLY: 1199, WEEKLY: 450 } },
  } as const

  // Load prices based on selected country/currency from backend to ensure exact Stripe currency/amounts
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const cur = COUNTRY_TO_CURRENCY[country] || 'GBP'
        const res = await fetch(`/api/get-prices?currency=${encodeURIComponent(cur)}`)
        if (!res.ok) throw new Error(await res.text())
        const data = await res.json()
        const list = (data.prices || [])
        setPrices(list)
        if (list.length > 0) setPlan(list[0].id)
      } catch (e) {
        // Fallback to GBP config if backend fails
        const cfg = (PRICE_IDS as any).GBP
        const fallback = [
          { id: cfg.MONTHLY, product_name: 'ChristTask Monthly', unit_amount: cfg.AMOUNTS.MONTHLY, currency: 'GBP', type: 'recurring' },
          { id: cfg.WEEKLY, product_name: 'ChristTask Weekly', unit_amount: cfg.AMOUNTS.WEEKLY, currency: 'GBP', type: 'recurring' },
        ].filter((p) => !!p.id)
        setPrices(fallback)
        if (fallback.length > 0) setPlan(fallback[0].id)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [country])

  // Format price for display
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  // Load FX rates once (base GBP) for display-only conversion
  useEffect(() => {
    const loadFx = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/GBP')
        const data = await res.json()
        if (data && data.rates) setFxRates(data.rates as Record<string, number>)
      } catch {
        // ignore; we will fallback to showing base currency
      }
    }
    if (!fxRates) loadFx()
  }, [fxRates])

  const convertMinorUnits = (
    amountMinor: number,
    fromCurrency: string,
    toCurrency: string,
  ): number => {
    const from = fromCurrency.toUpperCase()
    const to = toCurrency.toUpperCase()
    if (from === to || !fxRates) return amountMinor
    const rateFrom = from === 'GBP' ? 1 : fxRates[from]
    const rateTo = to === 'GBP' ? 1 : fxRates[to]
    if (!rateFrom || !rateTo) return amountMinor
    const factor = rateTo / rateFrom
    return Math.round(amountMinor * factor)
  }

  // TODO: Replace with your backend/RPC call to create a PaymentIntent or Subscription and return client_secret
  const createClientSecret = async () => {
    alert('Wire this button to your Supabase RPC that returns a client_secret for CardElement.')
    // setClientSecret('pi_client_secret_xxx')
  }

  return (
    <Elements stripe={stripePromise}>
      <section className="section" data-page="payment">
        <div className="container grid grid-2" style={{ gap: 28, alignItems: 'start', paddingRight: 0 }}>
                     <div className="card left-hero" style={{ padding: 48 }}>
             <div className="left-hero-inner">
               <div className="logo">ChristTask</div>
               <div className="bottom-text">Master Apologetics Today</div>
             </div>
             

          </div>

          <div className="pay-card">
            <h3>Card Details</h3>
            
            

            <div className="form-block">
              <label className="label">Choose your plan</label>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                  Loading subscription plans...
                </div>
              ) : (
                <div className="plan-grid">
                  {prices.map((price) => {
                    const displayCurrency = (COUNTRY_TO_CURRENCY[country] || price.currency || 'GBP').toUpperCase()
                    const displayAmountMinor = convertMinorUnits(price.unit_amount, price.currency, displayCurrency)
                    return (
                    <button
                      key={price.id}
                      type="button"
                      className={`plan-card ${plan === price.id ? 'selected' : ''}`}
                      onClick={() => setPlan(price.id)}
                    >
                      <div className="plan-title">{price.product_name}</div>
                      <div className="plan-price">
                        {formatPrice(displayAmountMinor, displayCurrency)}
                        <span className="plan-period">/{price.product_name.includes('Weekly') ? 'week' : price.product_name.includes('Monthly') ? 'month' : 'one-time'}</span>
                      </div>
                      <ul className="plan-points">
                        <li>Full access</li>
                        <li>Cancel anytime</li>
                      </ul>
                    </button>
                  )})}
                </div>
              )}
            </div>

             <div className="form-block">
               <div className="secure-checkout">
                 <span className="lock-icon">🔒</span>
                 <span className="secure-text">Secure, fast checkout with Link</span>
                 <span className="dropdown">▼</span>
               </div>
             </div>

            <div className="form-block">
              <label className="label">Coupon (optional)</label>
              <input className="input" value={coupon} onChange={(e)=>setCoupon(e.target.value)} placeholder="Enter coupon or promo code" />
            </div>

            {!user && (
              <div className="form-block">
                <label className="label">Email</label>
                <input 
                  className="input" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            )}

            {!user && (
              <div className="form-block">
                <label className="label">Password</label>
                <input 
                  className="input" 
                  type="password" 
                  placeholder="Create a password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
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
              setCountry={setCountry}
              plan={plan}
              coupon={coupon}
              onClientSecret={setClientSecret}
              user={user}
              email={email}
              password={password}
            />
                         
             
            <div className="form-block">
               <p className="disclaimer">
                 By providing your card information, you allow ChristTask to charge your card for future payments in accordance with our terms.
               </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --color-black: #000000;
          --color-white: #ffffff;
          --color-dark: #121212;
          --color-gray-light: #7d828e;
          --color-gray-medium: #758084;
          --color-gray-dark: #333e47;
          --color-green-dark: #233137;
          --color-green-light: #d1ebf2;
          --color-primary-100: #f2f5f5;
          --color-bg-secondary: #9aaeb5;
          --color-text-secondary: #515255;
          --color-bg-subtle: #fafafa;
          --color-border-primary-muted: rgba(242, 242, 242, 0.5);
          --color-border-base: #e8e8e8;
          --ease-in-out-sine: cubic-bezier(0.445, 0.05, 0.55, 0.95);
          --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        
        /* Mobile-first responsive design */
        .section {
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .grid {
          display: grid;
          gap: 20px;
        }
        
        .grid-2 {
          grid-template-columns: 1fr;
        }
        
        /* Left hero section - mobile optimized */
        .left-hero {
          position: relative;
          top: 0;
          left: 0;
          height: auto;
          min-height: 200px;
          width: 100%;
          overflow: hidden;
          background: 
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(64, 224, 208, 0.15), transparent 50%),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(0, 191, 255, 0.12), transparent 50%),
            radial-gradient(ellipse 1000px 700px at 50% 50%, rgba(72, 209, 204, 0.08), transparent 60%),
            radial-gradient(ellipse 700px 1000px at 10% 80%, rgba(0, 128, 128, 0.1), transparent 50%),
            radial-gradient(ellipse 900px 500px at 90% 20%, rgba(64, 224, 208, 0.06), transparent 50%);
          background-size: 200% 200%;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          z-index: 5;
          animation: silkyGradientDrift 10s ease-in-out infinite;
          padding: 40px 20px;
          margin-bottom: 20px;
        }
        
        /* Subtle vignette overlay */
        .left-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.03) 70%, rgba(0, 0, 0, 0.08) 100%);
          pointer-events: none;
          z-index: 1;
          border-radius: 16px;
        }
        
        /* Second layer of animated gradients for depth */
        .left-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 1200px 900px at 30% 40%, rgba(0, 255, 255, 0.04), transparent 60%),
            radial-gradient(ellipse 800px 1200px at 70% 60%, rgba(64, 224, 208, 0.03), transparent 70%),
            radial-gradient(ellipse 1400px 600px at 50% 20%, rgba(0, 191, 255, 0.02), transparent 80%);
          background-size: 150% 150%;
          animation: secondaryGradientFloat 12s ease-in-out infinite reverse;
          pointer-events: none;
          z-index: 2;
          border-radius: 16px;
        }
        
        .left-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(800px 600px at 20% 30%, rgba(59, 130, 246, 0.25), transparent 60%),
            radial-gradient(600px 500px at 80% 70%, rgba(34, 197, 94, 0.2), transparent 60%),
            linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.3));
          animation: gradientShift 12s ease-in-out infinite alternate;
          border-radius: 16px;
        }
        
        .left-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(1000px 800px at 10% 20%, rgba(59, 130, 246, 0.15), transparent 50%),
            radial-gradient(800px 600px at 90% 80%, rgba(168, 85, 247, 0.12), transparent 50%),
            radial-gradient(600px 400px at 50% 50%, rgba(59, 130, 246, 0.1), transparent 40%);
          animation: gradientFlow 18s ease-in-out infinite;
          border-radius: 16px;
        }
        
        /* Flowing Lines Animation */
        .left-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            /* Flowing line 1 */
            linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%),
            /* Flowing line 2 */
            linear-gradient(-45deg, transparent 20%, rgba(255, 255, 255, 0.08) 40%, transparent 60%),
            /* Flowing line 3 */
            linear-gradient(135deg, transparent 10%, rgba(255, 255, 255, 0.06) 30%, transparent 50%),
            /* Organic shapes */
            radial-gradient(400px 300px at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(300px 400px at 80% 70%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
            radial-gradient(500px 200px at 50% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
          animation: flowingLines 25s linear infinite, organicShapes 20s ease-in-out infinite alternate;
          border-radius: 16px;
        }
        
        @keyframes gradientShift { 
           0% { 
             transform: translate3d(0,0,0) scale(1);
             opacity: 0.8;
           } 
           50% { 
             transform: translate3d(-3%, -2%, 0) scale(1.1);
             opacity: 1;
           }
           100% { 
             transform: translate3d(-2%, -1%, 0) scale(1.05);
             opacity: 0.9;
           } 
         }
         
         @keyframes gradientFlow {
           0% { 
             transform: scale(1) rotate(0deg);
             opacity: 0.7;
           }
           25% { 
             transform: scale(1.2) rotate(2deg);
             opacity: 1;
           }
           50% { 
             transform: scale(1.1) rotate(-1deg);
             opacity: 0.9;
           }
           75% { 
             transform: scale(1.3) rotate(1deg);
             opacity: 1;
           }
           100% { 
             transform: scale(1) rotate(0deg);
             opacity: 0.7;
           }
         }
         
         @keyframes silkyGradientDrift {
           0% { 
             background-position: 0% 0%;
             filter: hue-rotate(0deg) saturate(1);
           }
           25% { 
             background-position: 100% 0%;
             filter: hue-rotate(2deg) saturate(1.05);
           }
           50% { 
             background-position: 100% 100%;
             filter: hue-rotate(4deg) saturate(1.1);
           }
           75% { 
             background-position: 0% 100%;
             filter: hue-rotate(2deg) saturate(1.05);
           }
           100% { 
             background-position: 0% 0%;
             filter: hue-rotate(0deg) saturate(1);
           }
         }
         
         @keyframes secondaryGradientFloat {
           0% { 
             background-position: 0% 0%;
             filter: hue-rotate(0deg) saturate(1);
           }
           33% { 
             background-position: 100% 0%;
             filter: hue-rotate(1deg) saturate(1.02);
           }
           66% { 
             background-position: 100% 100%;
             filter: hue-rotate(2deg) saturate(1.04);
           }
           100% { 
             background-position: 0% 0%;
             filter: hue-rotate(0deg) saturate(1);
           }
         }
         
         /* Flowing Lines Keyframes */
         @keyframes flowingLines {
           0% {
             background-position: 0% 0%, 100% 100%, 50% 50%;
           }
           50% {
             background-position: 100% 100%, 0% 0%, 100% 0%;
           }
           100% {
             background-position: 0% 0%, 100% 100%, 50% 50%;
           }
         }
         
         @keyframes organicShapes {
           0% {
             background-position: 20% 30%, 80% 70%, 50% 20%;
             opacity: 0.8;
           }
           50% {
             background-position: 80% 70%, 20% 30%, 80% 80%;
             opacity: 1;
           }
           100% {
             background-position: 20% 30%, 80% 70%, 50% 20%;
             opacity: 0.8;
           }
         }
         
        .left-hero-inner { 
          position: relative; 
          z-index: 1; 
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          text-align: center;
        }
        
        .bottom-text {
          position: relative;
          bottom: auto;
          left: auto;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 3;
          margin-top: 20px;
        }
        
        .logo {
          font-size: 32px;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 16px;
          text-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
        }
        
        .brand-pill {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
        }
        
        .hero-title { 
          font-size: 28px; 
          line-height: 1.05; 
          letter-spacing: var(--tracking-tight); 
          margin: 4px 0 8px; 
          color: #1e293b; 
        }
        
        .hero-title .accent { 
          color: #22c55e; 
          text-shadow: 0 4px 20px rgba(34, 197, 94, 0.3); 
        }
        
        /* Payment card - mobile optimized */
        .pay-card { 
          background: var(--color-white); 
          border: 0.666667px solid var(--color-border-primary-muted);
          border-radius: 20px;
          padding: 24px 20px;
          margin: 0;
          max-height: none;
          overflow-y: visible;
          position: relative;
          right: auto;
          top: auto;
          width: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          z-index: 10;
          transition: all 0.3s var(--ease-out-cubic);
        }
        
        .pay-card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
         }
         
         .pay-card h3 {
           color: #000000;
           margin: 0 0 20px 0;
           font-size: 24px;
           text-align: center;
         }
        
        .form-block { 
          display: grid; 
          gap: 12px; 
          margin-top: 20px; 
        }
        
        .label { 
          font-weight: 700; 
          color: #000000; 
          font-size: 16px; 
        }
        
        .input, .select { 
          width: 100%; 
          background: var(--color-white); 
          color: var(--color-dark); 
          border: 0.666667px solid var(--color-border-primary-muted); 
          border-radius: 12px; 
          padding: 18px 20px; 
          outline: none;
          font-family: inherit;
          font-size: 16px;
          transition: all 0.3s var(--ease-out-cubic);
          min-height: 56px;
          box-sizing: border-box;
        }
        
        .input:focus, .select:focus {
          border-color: var(--color-green-dark);
          box-shadow: 0 0 0 3px rgba(35, 49, 55, 0.1);
          transform: translateY(-1px);
        }
        
        .input::placeholder { 
          color: var(--color-gray-light); 
        }
        
        .card-shell { 
          border: 1px dashed var(--border); 
          border-radius: 12px; 
          padding: 14px; 
          background: #0e1530; 
        }
         
        .card-inputs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .card-input-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .card-input-group {
          flex: 1;
          min-width: 0;
          width: 100%;
        }
        
        .card-label {
          display: block;
          font-weight: 600;
          color: #000000;
          font-size: 12px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .card-input {
          width: 100%;
          background: #ffffff;
          color: #000000 !important;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 18px 14px;
          outline: none;
          font-size: 16px;
          font-family: 'Courier New', monospace;
          min-height: 56px;
          box-sizing: border-box;
        }
        
        .card-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(78, 123, 255, 0.1);
        }
        
        .card-input::placeholder {
          color: #9ca3af;
        }
        
        .floating-label-container {
          position: relative;
          width: 100%;
        }
        
        .floating-input {
          padding: 32px 14px 14px 14px;
          position: relative;
          z-index: 3;
          color: #000000 !important;
          background: #ffffff !important;
          min-height: 56px;
          width: 100%;
          box-sizing: border-box;
          border-width: 2px;
        }
        
        .floating-label {
          position: absolute;
          left: 14px;
          top: 20px;
          color: #9ca3af;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          pointer-events: none;
          background: #ffffff;
          padding: 0 4px;
          z-index: 5;
          user-select: none;
        }
        
        .floating-input:focus + .floating-label,
        .floating-input:not(:placeholder-shown) + .floating-label {
          top: 10px;
          font-size: 12px;
          color: var(--brand);
          font-weight: 600;
        }
        
        /* Special handling for select elements to prevent label overlap */
        select.floating-input:not([size]) + .floating-label {
          top: 10px;
          font-size: 12px;
          color: var(--brand);
          font-weight: 600;
        }
        
        /* Ensure select elements have proper padding to avoid text overlap */
        select.floating-input {
          padding: 32px 14px 14px 14px;
          min-height: 56px;
        }
        
        /* Mobile-specific adjustments for floating labels */
        @media (max-width: 767px) {
          .floating-label {
            top: 18px;
            font-size: 13px;
          }
          
          .floating-input:focus + .floating-label,
          .floating-input:not(:placeholder-shown) + .floating-label,
          select.floating-input + .floating-label {
            top: 8px;
            font-size: 11px;
          }
          
          select.floating-input {
            padding: 30px 14px 12px 14px;
          }
          
          /* Hide country label on mobile to prevent overlap */
          select.floating-input + .floating-label {
            display: none;
          }
        }
        
        .floating-input::placeholder {
          color: transparent;
          opacity: 0;
        }
        
        .floating-input:focus::placeholder {
          opacity: 0;
        }
        
        .card-number-label {
          position: relative;
          color: #000000;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
          display: block;
          text-align: left;
        }
        
        .input-example {
          position: absolute;
          top: 28px;
          left: 14px;
          color: #9ca3af;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          pointer-events: none;
          z-index: 6;
          animation: fadeIn 0.2s ease-in;
        }
        
        .card-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
        }
        
        .cvc-icon {
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .floating-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(78, 123, 255, 0.1);
          outline: 2px solid rgba(78, 123, 255, 0.35);
        }
        
        .floating-input:active {
          border-color: var(--brand);
          box-shadow: 0 0 0 4px rgba(78, 123, 255, 0.2);
          outline: 2px solid rgba(78, 123, 255, 0.35);
          transition: all 0.1s ease;
        }
        
        .floating-input:focus:active {
          border-color: var(--brand);
          box-shadow: 0 0 0 4px rgba(78, 123, 255, 0.3);
          outline: 2px solid rgba(78, 123, 255, 0.35);
          transition: all 0.1s ease;
        }
        
        .floating-input select {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .floating-input select option {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        select.floating-input {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        }
        
        .plan-grid { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 16px; 
        }
        
        .plan-card { 
          text-align: left; 
          border: 0.666667px solid var(--color-border-primary-muted); 
          background: var(--color-white); 
          padding: 24px 20px; 
          border-radius: 16px; 
          cursor: pointer; 
          color: var(--color-dark);
          transition: all 0.3s var(--ease-out-cubic);
          position: relative;
          overflow: hidden;
        }
        
        .plan-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent, rgba(35, 49, 55, 0.02), transparent);
          opacity: 0;
          transition: opacity 0.3s var(--ease-out-cubic);
        }
        
        .plan-card:hover::before {
          opacity: 1;
        }
        
        .plan-card:hover { 
          border-color: var(--color-green-dark); 
          box-shadow: 0 8px 24px rgba(35, 49, 55, 0.15);
          transform: translateY(-2px);
        }
        
        .plan-card.selected { 
          border-color: var(--color-green-dark); 
          outline: 2px solid rgba(35, 49, 55, 0.3);
          background: var(--color-primary-100);
        }
        
        .plan-title { 
          font-weight: 800; 
          margin-bottom: 8px; 
          font-size: 18px;
        }
        
        .plan-price { 
          font-weight: 800; 
          font-size: 24px; 
        }
        
        .plan-period { 
          font-weight: 600; 
          font-size: 14px; 
          color: #6b7280; 
          margin-left: 6px; 
        }
        
        .plan-points { 
          margin: 12px 0 0; 
          padding-left: 18px; 
          color: #6b7280; 
          font-size: 14px;
        }
        
        .payment-method {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
        }
        
        .payment-method input[type="radio"] {
          width: 18px;
          height: 18px;
          accent-color: var(--brand);
        }
        
        .payment-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #000000;
          cursor: pointer;
        }
        
        .secure-checkout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: var(--color-primary-100);
          border: 0.666667px solid var(--color-border-primary-muted);
          border-radius: 12px;
          color: var(--color-green-dark);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s var(--ease-out-cubic);
          cursor: pointer;
        }
        
        .secure-checkout:hover {
          background: var(--color-bg-subtle);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(35, 49, 55, 0.1);
         }
         
         .lock-icon {
           font-size: 16px;
         }
         
         .secure-text {
           flex: 1;
         }
         
         .dropdown {
           font-size: 12px;
           color: #6b7280;
         }
         
         .disclaimer {
           font-size: 12px;
           color: var(--color-text-secondary);
           line-height: 1.5;
           margin: 0;
           text-align: center;
         }
        
        /* Enhanced button styles for payment page */
        .pay-card .btn {
          background: var(--color-green-dark);
          color: var(--color-white);
          border: none;
          border-radius: 12px;
          padding: 20px 28px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s var(--ease-out-cubic);
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pay-card .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s var(--ease-out-cubic);
        }
        
        .pay-card .btn:hover::before {
          left: 100%;
        }
        
        .pay-card .btn:hover {
          background: var(--color-green-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(35, 49, 55, 0.3);
        }
        
        .pay-card .btn:disabled {
          background: var(--color-gray-light);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        /* Tablet styles */
        @media (min-width: 768px) {
          .section {
            padding: 40px 20px;
          }
          
          .grid-2 {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          
          .left-hero {
            min-height: 300px;
            padding: 60px 40px;
          }
          
          .logo {
            font-size: 40px;
          }
          
          .bottom-text {
            font-size: 20px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .pay-card {
            padding: 32px 28px;
          }
          
          .pay-card h3 {
            font-size: 28px;
          }
          
          .plan-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .plan-card {
            padding: 28px 24px;
          }
          
          .plan-title {
            font-size: 20px;
          }
          
          .plan-price {
            font-size: 28px;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 1024px) {
          .section {
            padding: 60px 40px;
          }
          
          .left-hero {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100%;
            min-height: 100vh;
            padding: 48px;
            border-radius: 0;
            margin-bottom: 0;
          }
          
          .left-hero-inner {
            align-items: flex-start;
            text-align: left;
            justify-content: space-between;
          }
          
          .logo {
            font-size: 48px;
            margin-bottom: 24px;
          }
          
          .bottom-text {
            position: absolute;
            bottom: 48px;
            left: 48px;
            font-size: 24px;
            margin-top: 0;
          }
          
          .hero-title {
            font-size: 44px;
          }
          
          .pay-card {
            position: fixed;
            right: 20px;
            top: 10px;
            width: 35%;
            max-height: calc(100vh - 20px);
            overflow-y: auto;
            margin-right: -20px;
            padding-right: 42px;
            border-radius: 20.4587px;
          }
          
          .pay-card h3 {
            text-align: left;
            font-size: 24px;
          }
          
          .plan-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          
          .plan-card {
            padding: 20px;
          }
          
          .plan-title {
            font-size: 18px;
          }
          
          .plan-price {
            font-size: 20px;
          }
        }
        
        /* Large desktop styles */
        @media (min-width: 1200px) {
          .hero-title {
            font-size: 56px;
          }
          
          .pay-card {
            width: 400px;
            right: 40px;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .card-input,
          .floating-input,
          .input,
          .select {
            min-height: 60px;
            font-size: 16px;
          }
          
          .btn {
            min-height: 60px;
            font-size: 18px;
          }
          
          .plan-card {
            padding: 28px 24px;
          }
          
          .form-block {
            gap: 16px;
            margin-top: 24px;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .card-input,
          .floating-input,
          .input,
          .select {
            border-width: 0.5px;
          }
        }
        
        .stripe-card-element {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 18px 14px;
          background: #ffffff;
          min-height: 56px;
          display: flex;
          align-items: center;
          transition: all 0.3s var(--ease-out-cubic);
        }
        
        .stripe-card-element:focus-within {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(78, 123, 255, 0.1);
          outline: 2px solid rgba(78, 123, 255, 0.35);
          transform: translateY(-1px);
        }
        
        .stripe-card-element .StripeElement {
          width: 100%;
        }
        
        .stripe-card-element .StripeElement--focus {
          outline: none;
        }
        
        .stripe-card-element .StripeElement--invalid {
          border-color: #ff6b6b;
        }
        
        .stripe-card-element .StripeElement--complete {
          border-color: #22c55e;
        }
        
        .stripe-card-element .StripeElement--complete {
          border-color: #22c55e;
        }
        
        .card-input-label {
          font-weight: 600;
          color: #000000;
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </Elements>
  )
}


