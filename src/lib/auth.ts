import { cookies } from 'next/headers'

// Simple session-based auth system (temporary replacement for Supabase)
export interface User {
  id: string
  email: string
  name?: string
}

// Simple session storage (in production, you'd use a proper session store)
const sessions = new Map<string, User>()

export async function getAuthUser(request: Request): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    
    // Get session token from cookies
    const sessionToken = cookieStore.get('session-token')?.value
    
    if (!sessionToken) {
      return null
    }
    
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


