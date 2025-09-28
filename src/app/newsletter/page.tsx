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
      <div className="h-screen bg-black flex items-center justify-center px-4" data-page="newsletter">
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
    <div className="h-screen bg-black flex items-center justify-center px-4" data-page="newsletter">
      <div className="text-center max-w-4xl newsletter-content">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-left">
            THE MOST DANGEROUS<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;MARKETING NEWSLETTER ON<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;THE INTERNET
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join my private email list and get the unfiltered, tactical breakdowns on ecom, AI, making money online, and what's actually working right now. No fluff. No fake screenshots. Just real sh*t that makes you money.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full bg-transparent text-white placeholder-gray-300 border-2 border-white/30 rounded-2xl px-6 py-6 text-xl focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all duration-300 backdrop-blur-sm"
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
      </div>
    </div>
  )
}
