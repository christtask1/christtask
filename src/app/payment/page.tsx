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
  plan,
  coupon,
  onClientSecret,
  user,
  email,
  password,
}: {
  clientSecret: string | null
  country: string
  plan: string
  coupon: string
  onClientSecret: (secret: string) => void
  user: any
  email: string
  password: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const confirm = async () => {
    if (!user && (!email || !password)) {
      alert('Please enter your email and password')
      return
    }
    
    if (!cardNumber || !expiryDate || !cvc) {
      setError('Please fill in all card details')
      return
    }
    
    setError(null) // Clear any previous errors
    setLoading(true)
    try {

      let secret = clientSecret
      if (!secret) {
        // Create Stripe subscription via API route (no account creation yet)
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
          // When no payment is due, Stripe returns a SetupIntent client_secret
          // For now, we'll redirect to loading since we don't have Stripe Elements
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

      // For now, we'll redirect to loading since we don't have Stripe Elements
      // In a real implementation, you'd use the card details with Stripe API
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
      window.location.href = '/loading'
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err?.message || 'Unable to start payment')
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
                               <input
                  type="text"
                  className="card-input floating-input"
                  placeholder=" "
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  id="card-number"
                />
               <label htmlFor="card-number" className="floating-label">Card Number</label>
             </div>
           </div>
         </div>
         
         <div className="card-input-row">
           <div className="card-input-group">
             <div className="floating-label-container">
                               <input
                  type="text"
                  className="card-input floating-input"
                  placeholder=" "
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                  id="expiry-date"
                />
               <label htmlFor="expiry-date" className="floating-label">Expiry Date</label>
             </div>
           </div>
           
           <div className="card-input-group">
             <div className="floating-label-container">
               <input
                 type="text"
                 className="card-input floating-input"
                 placeholder=" "
                 value={cvc}
                 onChange={(e) => setCvc(e.target.value)}
                 maxLength={4}
                 id="cvc"
               />
               <label htmlFor="cvc" className="floating-label">CVC</label>
             </div>
           </div>
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
                     <div className="card left-hero" style={{ padding: 28 }}>
             <div className="left-hero-inner">
               <div className="logo">CT</div>
               <div className="brand-pill">CHRISTIAN APOLOGETICS</div>
               <h1 className="hero-title">
                 Start Your <span className="accent">Transformation</span> Today
               </h1>
               <p className="muted" style={{ marginTop: 10, maxWidth: 640 }}>
                 Get your personalized apologetics training and transformation plan based on biblical truth and 2000+ years of Christian wisdom.
               </p>
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
                 .left-hero {
           position: fixed;
           top: 20px;
           left: 20px;
           height: calc(100vh - 40px);
           width: 55%;
           overflow: hidden;
           background: linear-gradient(135deg, #f8fafc, #e2e8f0, #cbd5e1, #94a3b8);
           border:1px solid var(--border);
           border-radius:16px;
         }
        .left-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(800px 600px at 20% 30%, rgba(34, 197, 94, 0.15), transparent 60%),
                      radial-gradient(600px 500px at 80% 70%, rgba(59, 130, 246, 0.12), transparent 60%),
                      linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.4));
          animation: gradientShift 20s ease-in-out infinite alternate;
        }
                 .left-hero-inner { position: relative; z-index: 1; }
         .logo {
           font-size: 48px;
           font-weight: 900;
           color: #ffffff;
           margin-bottom: 24px;
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
                 .hero-title { font-size: 44px; line-height: 1.05; letter-spacing: var(--tracking-tight); margin: 4px 0 8px; color: #1e293b; }
         .hero-title .accent { color: #22c55e; text-shadow: 0 4px 20px rgba(34, 197, 94, 0.3); }
        @media(min-width: 1024px) { .hero-title { font-size: 56px; } }
        @keyframes gradientShift { 0% { transform: translate3d(0,0,0) } 100% { transform: translate3d(-2%, -1%, 0) } }

                 .pay-card { 
           background: #ffffff; 
           border:1px solid var(--border); 
           border-radius:16px 0 0 16px; 
           padding:22px;
           margin-right: -20px;
           padding-right: 42px;
           max-height: calc(100vh - 40px);
           overflow-y: auto;
           position: fixed;
           right: 20px;
           top: 20px;
           width: 40%;
         }
         
         .pay-card h3 {
           color: #000000;
           margin: 0 0 20px 0;
         }
        .form-block { display:grid; gap:8px; margin-top:14px; }
        .label { font-weight:700; color: #000000; font-size:14px; }
        .input, .select { width:100%; background:#ffffff; color:#1e293b; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; outline:none; }
        .input::placeholder { color: var(--muted); }
                 .card-shell { border:1px dashed var(--border); border-radius:12px; padding:14px; background:#0e1530; }
         
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
           color: #1e293b;
           border: 1px solid #e2e8f0;
           border-radius: 8px;
           padding: 12px 14px;
           outline: none;
           font-size: 14px;
           font-family: 'Courier New', monospace;
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
         }
         
         .floating-input {
           padding-top: 20px;
           padding-bottom: 8px;
           position: relative;
           z-index: 2;
         }
         
         .floating-label {
           position: absolute;
           left: 14px;
           top: 50%;
           transform: translateY(-50%);
           color: #9ca3af;
           font-size: 14px;
           font-weight: 500;
           transition: all 0.2s ease;
           pointer-events: none;
           background: #ffffff;
           padding: 0 4px;
           z-index: 1;
           user-select: none;
         }
         
         .floating-input:focus + .floating-label,
         .floating-input:not(:placeholder-shown) + .floating-label {
           top: 8px;
           font-size: 12px;
           color: var(--brand);
           font-weight: 600;
         }
         
         .floating-input:focus {
           border-color: var(--brand);
           box-shadow: 0 0 0 3px rgba(78, 123, 255, 0.1);
         }
        .plan-grid { display:grid; grid-template-columns: 1fr; gap:12px; }
        @media(min-width:700px){ .plan-grid { grid-template-columns: 1fr 1fr; } }
        .plan-card { text-align:left; border:1px solid #e2e8f0; background:#ffffff; padding:16px; border-radius:12px; cursor:pointer; color:#000000; }
        .plan-card:hover { border-color: var(--brand); box-shadow: 0 8px 24px rgba(78,123,255,0.18) }
        .plan-card.selected { border-color: var(--brand); outline: 2px solid rgba(78,123,255,0.35); }
        .plan-title { font-weight:800; margin-bottom:6px; }
        .plan-price { font-weight:800; font-size:20px; }
        .plan-period { font-weight:600; font-size:12px; color: #6b7280; margin-left:6px; }
                 .plan-points { margin:10px 0 0; padding-left:18px; color: #6b7280; }
         
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
         
         .card-icon {
           font-size: 20px;
         }
         
         .secure-checkout {
           display: flex;
           align-items: center;
           gap: 8px;
           padding: 12px 16px;
           background: #f0fdf4;
           border: 1px solid #bbf7d0;
           border-radius: 8px;
           color: #166534;
           font-size: 14px;
           font-weight: 500;
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
           color: #6b7280;
           line-height: 1.5;
           margin: 0;
           text-align: center;
         }
         
                  @media (max-width: 900px) {
           .left-hero { 
             position: relative; 
             top: 0; 
             left: 0;
             height: auto; 
             width: 100%;
           }
           .hero-title { font-size: 36px; }
           .pay-card { 
             position: relative;
             right: auto;
             top: auto;
             width: 100%;
             margin-right: 0; 
             padding-right: 22px; 
             border-radius: 16px; 
             max-height: none;
             overflow-y: visible;
           }
           
           .card-input-row {
             flex-direction: column;
             gap: 12px;
           }
         }
      `}</style>
    </Elements>
  )
}


