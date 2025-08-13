import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '../../../lib/auth'
import { allowRequest } from '../../../lib/ratelimit'

export async function POST(request: NextRequest) {
  try {
    // Basic rate limit per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!allowRequest(ip, 60, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Require authentication to use chat
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { message, question, conversation_history = [] } = await request.json()
    
    // Your actual RAG backend endpoint
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://christtask-backend-8xky.onrender.com'
    const CHAT_ENDPOINT = `${BASE_URL}/api/v1/chat`
    
    console.log('Calling backend:', CHAT_ENDPOINT)
    
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add any auth headers your backend needs
        // 'Authorization': `Bearer ${process.env.RAG_API_KEY}`
        'X-User-Id': user.id,
        'X-User-Email': user.email || '',
      },
      body: JSON.stringify({
        question: message ?? question,
        conversation_history,
      }),
      // Add timeout
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

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
