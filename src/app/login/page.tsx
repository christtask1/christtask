'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleWhopLogin = async () => {
    setIsLoading(true)
    
    try {
      // Redirect to Whop OAuth
      const whopOAuthUrl = `https://oauth.api.whop.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_WHOP_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://christtask.com/chat')}&response_type=code&scope=read`
      
      // Store the intended destination
      localStorage.setItem('whop_redirect_after_login', '/chat')
      
      // Redirect to Whop OAuth
      window.location.href = whopOAuthUrl
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ChristTask
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Master Apologetics Today
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access your subscription
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={handleWhopLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Continue with Whop
              </div>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/payment')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Get Access
              </button>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              What you'll get:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full access to ChristTask chatbot</li>
              <li>• Unlimited questions and responses</li>
              <li>• Secure authentication via Whop</li>
              <li>• Manage your subscription easily</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
