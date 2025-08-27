'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckoutEmbedControls, WhopCheckoutEmbed } from '@whop/react/checkout'

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'weekly'>('monthly')
  
  const router = useRouter()
  
  // Your Whop product ID
  const WHOP_PRODUCT_ID = 'prod_rF9SRBoGKYPsc'
  
  // Whop checkout controls
  const ref = useCheckoutEmbedControls()
  
  const plans = [
    {
      id: 'weekly',
      name: 'Weekly Plan',
      price: '$3',
      period: 'per week',
      description: 'Perfect for trying out ChristTask'
    },
    {
      id: 'monthly',
      name: 'Monthly Plan', 
      price: '$12',
      period: 'per month',
      description: 'Best value for regular users'
    }
  ]

  const handlePlanSelect = (planId: 'monthly' | 'weekly') => {
    setSelectedPlan(planId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ChristTask
          </h1>
          <p className="text-xl text-gray-600">
            Master Apologetics Today
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Plan Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choose Your Plan
            </h2>
            
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlanSelect(plan.id as 'monthly' | 'weekly')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plan.name}
                    </h3>
                    {selectedPlan === plan.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {plan.price}
                  </div>
                  <div className="text-gray-600 mb-3">
                    {plan.period}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What You Get
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full access to ChristTask chatbot
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited questions and responses
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Whop Checkout */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Your Purchase
            </h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Selected Plan:</span>
                <span className="font-semibold text-gray-900">
                  {plans.find(p => p.id === selectedPlan)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700">Price:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {plans.find(p => p.id === selectedPlan)?.price}
                  <span className="text-sm font-normal text-gray-600 ml-1">
                    {plans.find(p => p.id === selectedPlan)?.period}
                  </span>
                </span>
              </div>
            </div>

            {/* Whop Embedded Checkout */}
            <WhopCheckoutEmbed 
              ref={ref}
              planId={WHOP_PRODUCT_ID}
              onComplete={(plan_id, receipt_id) => {
                console.log('Checkout completed!', { plan_id, receipt_id })
                // Redirect to chat page after successful payment
                router.push('/chat')
              }}
              onStateChange={(state) => {
                console.log('Checkout state changed:', state)
              }}
            />

            {/* Security badges */}
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                PCI Compliant
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            By completing your purchase, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}


