import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth.api.whop.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.WHOP_OAUTH_CLIENT_ID!,
        client_secret: process.env.WHOP_OAUTH_CLIENT_SECRET!,
        code: code,
        redirect_uri: 'https://christtask.com/chat',
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text())
      return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 500 })
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token } = tokenData

    // Get user information from Whop
    const userResponse = await fetch('https://api.whop.com/api/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.error('User info fetch failed:', await userResponse.text())
      return NextResponse.json({ error: 'Failed to fetch user information' }, { status: 500 })
    }

    const userData = await userResponse.json()
    
    // Create a session token
    const sessionToken = `whop-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Redirect to chat page with session cookies
    const response = NextResponse.redirect(new URL('/chat', request.url))
    
    // Set secure session cookies
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    response.cookies.set('whop-access-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    
    if (refresh_token) {
      response.cookies.set('whop-refresh-token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
    }
    
    return response

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
