import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Replace this URL with your actual RAG backend endpoint
    const RAG_BACKEND_URL = process.env.RAG_BACKEND_URL || 'http://localhost:8000/chat'
    
    const response = await fetch(RAG_BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers your backend needs
        // 'Authorization': `Bearer ${process.env.RAG_API_KEY}`
      },
      body: JSON.stringify({
        message: message,
        // Add any other fields your RAG backend expects
      })
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    
    // Return the response from your RAG backend
    return NextResponse.json({ 
      content: data.response || data.answer || data.content || 'No response from backend'
    })

  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from chatbot' },
      { status: 500 }
    )
  }
}
