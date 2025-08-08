'use client'

import { useState } from 'react'

interface PaymentFormProps {
  selectedPlan: 'weekly' | 'monthly'
  email: string
  onSuccess: () => void
  onError: (error: string) => void
}

const PaymentForm = ({ selectedPlan, email, onSuccess, onError }: PaymentFormProps) => {
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [country, setCountry] = useState('GB')
  const [postalCode, setPostalCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [couponValidation, setCouponValidation] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid'
    message?: string
    discount?: string
  }>({ status: 'idle' })

  // Handle coupon code changes
  const handleCouponChange = (value: string) => {
    setCouponCode(value)
    
    if (!value.trim()) {
      setCouponValidation({ status: 'idle' })
      return
    }

    // Simple coupon validation (hardcoded for now)
    if (value.trim() === 'TEST50' || value.trim() === 'SALAMOVIC') {
      setCouponValidation({ 
        status: 'valid', 
        message: '✓ Valid coupon', 
        discount: '50% off'
      })
    } else {
      setCouponValidation({ 
        status: 'invalid', 
        message: 'Invalid coupon code'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!cardNumber || !expiryDate || !cvc || !postalCode) {
      onError('Please fill in all required fields.')
      return
    }

    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="MM / YY"
              maxLength={7}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="123"
              maxLength={4}
            />
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="SW1A 1AA"
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
          onChange={(e) => handleCouponChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter coupon code"
        />
        {couponValidation.status === 'valid' && (
          <p className="text-green-600 dark:text-green-400 text-sm mt-1">
            {couponValidation.message} - {couponValidation.discount}
          </p>
        )}
        {couponValidation.status === 'invalid' && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            {couponValidation.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        {loading ? 'Processing...' : `Pay ${selectedPlan === 'weekly' ? '£4.50' : '£11.99'}`}
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
    <div className="w-full">
      <PaymentForm
        selectedPlan={selectedPlan}
        email={email}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  )
}
