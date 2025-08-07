'use client'

import Link from "next/link";
import { useState } from "react";

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Add Stripe Checkout integration here
    console.log('Payment form submitted:', {
      plan: selectedPlan,
      email,
      password
    });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            ChristTask
          </Link>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Start with our flexible subscription options
          </p>
        </div>

        {/* Pricing Cards - Smaller */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {/* Weekly Subscription */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 ${
            selectedPlan === 'weekly' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
          }`} onClick={() => setSelectedPlan('weekly')}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Weekly</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                £4.50
                <span className="text-base font-normal text-gray-600 dark:text-gray-400">/week</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for short-term projects</p>
            </div>
            
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full access to all features
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </li>
            </ul>
          </div>

          {/* Monthly Subscription */}
          <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 ${
            selectedPlan === 'monthly' ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
          }`} onClick={() => setSelectedPlan('monthly')}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Monthly</h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                £11.99
                <span className="text-base font-normal text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best value for long-term use</p>
            </div>
            
            <ul className="space-y-3 mb-6 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All weekly features
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority customer support
              </li>
            </ul>
          </div>
        </div>

        {/* Account Creation Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create Your Account</h2>
            
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Account Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Create a password"
                  required
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      {selectedPlan === 'weekly' ? 'Weekly Plan' : 'Monthly Plan'}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedPlan === 'weekly' ? '£4.50' : '£11.99'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {selectedPlan === 'weekly' ? '£4.50' : '£11.99'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info about Stripe Checkout */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You&apos;ll be redirected to our secure payment page to complete your subscription.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {loading ? 'Processing...' : `Subscribe to ${selectedPlan === 'weekly' ? 'Weekly' : 'Monthly'} Plan`}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 