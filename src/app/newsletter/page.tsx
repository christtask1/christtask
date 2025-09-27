'use client'

import { useState } from 'react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    // Simulate form submission (we'll add real integration later)
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            YOU'RE IN
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Welcome to the most dangerous marketing newsletter on the internet. 
            Check your email for confirmation.
          </p>
          <button 
            onClick={() => {
              setIsSubmitted(false)
              setEmail('')
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            SUBSCRIBE ANOTHER EMAIL
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          THE MOST DANGEROUS MARKETING NEWSLETTER ON THE INTERNET
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join my private email list and get the unfiltered, tactical breakdowns on ecom, AI, making money online, and what's actually working right now. No fluff. No fake screenshots. Just real sh*t that makes you money.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-4 text-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              disabled={isSubmitting}
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            {isSubmitting ? 'SUBSCRIBING...' : 'ACCESS NOW'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          No spam. Unsubscribe anytime. Your email is safe with us.
        </p>
      </div>
    </div>
  )
}
