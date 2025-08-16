import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserFromRequest } from '../../../lib/auth'
import { allowRequest } from '../../../lib/ratelimit'
import { supabase } from '../../../lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    // Basic rate limit per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!allowRequest(ip, 60, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Try to identify user (optional). Do not block if unauthenticated.
    const user = await getAuthUserFromRequest(request)
    
    // Check subscription status if user is authenticated
    if (user) {
      // Find user's Stripe customer by email
      const { data: customers } = await supabase
        .from('customers')
        .select('id')
        .eq('email', user.email)

      let hasActiveSubscription = false
      
      if (customers && customers.length > 0) {
        // Check for active subscriptions
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('customer', customers[0].id)
          .in('status', ['active', 'trialing'])
          .limit(1)

        hasActiveSubscription = subscriptions && subscriptions.length > 0
      }

      if (!hasActiveSubscription) {
        return NextResponse.json({ 
          error: 'Subscription required. Please subscribe to continue using ChristTask.',
          code: 'SUBSCRIPTION_REQUIRED'
        }, { status: 403 })
      }
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
