import Link from "next/link";

export default function Pricing() {
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
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Start with our free plan and upgrade as your business grows
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Weekly Subscription */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Weekly</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                £4.50
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/week</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Perfect for short-term projects</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full access to all features
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Weekly billing cycle
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </li>
            </ul>
            
            <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Start Weekly Plan
            </button>
          </div>

          {/* Monthly Subscription */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow transform scale-105">
            <div className="text-center mb-8">
              <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-4xl font-bold text-white mb-2">
                £11.99
                <span className="text-lg font-normal text-blue-100">/month</span>
              </div>
              <p className="text-blue-100">Best value for long-term use</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full access to all features
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Monthly billing cycle
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save 33% vs weekly
              </li>
            </ul>
            
            <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Monthly Plan
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, all paid plans come with a 14-day free trial. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 YourBrand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 