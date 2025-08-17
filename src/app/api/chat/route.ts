import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '../../../lib/auth'
import { allowRequest } from '../../../lib/ratelimit'
import { getStripe } from '../../../lib/stripe'

// Reverted to original working chatbot code - no subscription gate

export async function POST(request: NextRequest) {
  try {
    // Basic rate limit per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!allowRequest(ip, 60, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Try to identify user (optional). Do not block if unauthenticated.
   // Require authenticated user for chatbot access
const user = await getAuthUser(request)
console.log('Debug - User from getAuthUser():', user)
if (!user) {
  console.log('Debug - No user found, returning 401')
  return NextResponse.json({ error: 'Please log in to use the chatbot.', code: 'LOGIN_REQUIRED' }, { status: 401 })
}

// Check subscription status with Stripe API
const stripe = getStripe()
if (!user.email) {
  return NextResponse.json({ error: 'User email is required for subscription check.', code: 'EMAIL_REQUIRED' }, { status: 400 })
}

const customers = await stripe.customers.list({
  email: user.email,
  limit: 10
})

      let hasActiveSubscription = false
for (const customer of customers.data) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: 'active'
  })
  if (subscriptions.data.length > 0) {
              hasActiveSubscription = true
              break
        }
      }

      if (!hasActiveSubscription) {
  return NextResponse.json({ error: 'Active subscription required to use the chatbot.', code: 'SUBSCRIPTION_REQUIRED' }, { status: 403 })
    }
    
    const { message, question, conversation_history = [] } = await request.json()
    
    // Your actual RAG backend endpoint
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://christtask-backend-8xky.onrender.com'
    const CHAT_ENDPOINT = `${BASE_URL}/api/v1/chat`
    
    console.log('Calling backend:', CHAT_ENDPOINT)
    
    // Use AbortController for timeout (works reliably on Node runtime)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30_000)

    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add any auth headers your backend needs
        // 'Authorization': `Bearer ${process.env.RAG_API_KEY}`
        ...(user ? { 'X-User-Id': user.id, 'X-User-Email': user.email || '' } : {}),
      },
      body: JSON.stringify({
        question: message ?? question,
        conversation_history,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!response.ok) {
      // Bubble up backend error body to help diagnose quickly
      let backendError: any = null
      try {
        backendError = await response.json()
      } catch {
        backendError = await response.text()
      }
      return NextResponse.json(
        { error: backendError || `Backend returned ${response.status}` },
        { status: response.status }
      )
    }

    let data: any
    let text: string | null = null
    try {
      data = await response.json()
    } catch {
      text = await response.text()
    }

    console.log('Backend response:', data ?? text)
    
    // Return normalized response for the chat UI
    const content = data?.response || data?.answer || data?.content || data?.message || text || 'No response from backend'
    return NextResponse.json({ content })

  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // More detailed error handling
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - backend took too long to respond' },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { error: `Failed to get response from chatbot: ${error.message}` },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
