'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  // Simple comment to trigger deployment
  const { data: session, status } = useSession()
  const router = useRouter()

  // Debug: Log environment variables (remove this later)
  useEffect(() => {
    console.log('Environment check:', {
      hasSession: !!session,
      status,
      windowData: typeof window !== 'undefined' ? !!window.__NEXT_DATA__ : 'server'
    })
  }, [session, status])

  useEffect(() => {
    if (session) {
      router.push('/chat')
    }
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to access your account</p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div>
            <button 
              onClick={() => {
                console.log('Login button clicked')
                signIn('whop', { callbackUrl: '/chat' })
              }}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Login with Whop
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="/payment" className="text-blue-400 hover:text-blue-300">
                Get started here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
