export default function PaymentPage() {
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
          {/* Left Side - Plan Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choose Your Plan
            </h2>
            
            <div className="space-y-6">
              <div className="p-6 border-2 border-blue-500 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Weekly Plan
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $5.99
                </div>
                <div className="text-gray-600 mb-3">
                  per week
                </div>
                <p className="text-gray-600 text-sm">
                  Perfect for trying out ChristTask
                </p>
              </div>

              <div className="p-6 border-2 border-gray-200 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Monthly Plan
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $15.99
                </div>
                <div className="text-gray-600 mb-3">
                  per month
                </div>
                <p className="text-gray-600 text-sm">
                  Best value for regular users
                </p>
              </div>
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

          {/* Right Side - Whop Embedded Checkout */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Your Purchase
            </h2>
            
            <p className="text-gray-600 mb-6">
              Choose your plan and complete your subscription below.
            </p>

            {/* Weekly Plan Checkout */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Weekly Plan - $5.99/week</h3>
              <div
                data-whop-checkout-plan-id="plan_ySRIwkPeJwJer"
                data-whop-checkout-theme="light"
                data-whop-checkout-hide-price="false"
                style={{ height: 'fit-content', overflow: 'hidden', maxWidth: '100%' }}
              ></div>
            </div>

            {/* Monthly Plan Checkout */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Monthly Plan - $15.99/month</h3>
              <div
                data-whop-checkout-plan-id="plan_Hg3En8tlylYa9"
                data-whop-checkout-theme="light"
                data-whop-checkout-hide-price="false"
                style={{ height: 'fit-content', overflow: 'hidden', maxWidth: '100%' }}
              ></div>
            </div>

            {/* Security badges */}
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 0 012 2v5a2 0 01-2 2H5a2 0 01-2-2v-5a2 0 012-2zm8-2v2H7V7a3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 0 011-1h12a1 0 110 2H4a1 0 01-1-1zm0 4a1 0 011-1h12a1 0 110 2H4a1 0 01-1-1zm0 4a1 0 011-1h12a1 0 110 2H4a1 0 01-1-1z" clipRule="evenodd" />
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
