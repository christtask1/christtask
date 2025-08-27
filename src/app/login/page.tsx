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
      
      // Store where to redirect after login
      localStorage.setItem('whop_redirect_after_login', '/chat')
      
      // Redirect to Whop
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
          <p className="text-xl text-gray-600">
            Master Apologetics Today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Sign In
          </h2>
          
          <button
            onClick={handleWhopLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Continue with Whop'
            )}
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            You'll be redirected to Whop to complete your sign in
          </p>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Don't have an account?{' '}
            <button 
              onClick={() => router.push('/')}
              className="text-blue-600 hover:underline"
            >
              Go back home
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
