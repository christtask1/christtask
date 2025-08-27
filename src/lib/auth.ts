// Simple session-based auth system (temporary replacement for Supabase)
export interface User {
  id: string
  email: string
  name?: string
}

// Simple session storage (in production, you'd use a proper session store)
const sessions = new Map<string, User>()

// Client-side function to get user from session token
export function getAuthUserFromToken(): User | null {
  try {
    // Get session token from cookies (client-side)
    const cookies = document.cookie.split(';')
    const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session-token='))
    
    if (!sessionCookie) {
      return null
    }
    
    const sessionToken = sessionCookie.split('=')[1]
    
    // Check if session exists
    const user = sessions.get(sessionToken)
    if (!user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// Server-side function (for API routes)
export async function getAuthUser(request: Request): Promise<User | null> {
  try {
    // For API routes, we can use headers or cookies
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      return null
    }
    
    const cookies = cookieHeader.split(';')
    const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('session-token='))
    
    if (!sessionCookie) {
      return null
    }
    
    const sessionToken = sessionCookie.split('=')[1]
    
    // Check if session exists
    const user = sessions.get(sessionToken)
    if (!user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

// Helper function to create a session (for testing)
export function createTestSession(email: string): string {
  const sessionToken = `test-session-${Date.now()}`
  const user: User = {
    id: `user-${Date.now()}`,
    email: email,
    name: 'Test User'
  }
  
  sessions.set(sessionToken, user)
  return sessionToken
}

// Helper function to validate a session token
export function validateSessionToken(token: string): User | null {
  return sessions.get(token) || null
}


