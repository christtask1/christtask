import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

// Shared auth client instance to avoid multiple GoTrueClient instances
let authClient: ReturnType<typeof createClient> | null = null

function getAuthClient() {
  if (!authClient) {
    authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, detectSessionInUrl: false },
    })
  }
  return authClient
}

export type AuthUser = { id: string; email?: string | null }

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    // In Next 15, cookies() returns a Promise in route handlers
    const cookieStore = await cookies()
    const accessToken =
      cookieStore.get('sb-access-token')?.value ||
      cookieStore.get('supabase-auth-token')?.value ||
      null
    if (!accessToken) return null

    const supabase = getAuthClient()
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (error) return null
    return data.user ? { id: data.user.id, email: data.user.email } : null
  } catch {
    return null
  }
}

// Prefer this in API routes: reads Bearer token from the request header.
export async function getAuthUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || ''
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined

    if (!token) {
      // Fallback to cookie-based lookup
      return getAuthUser()
    }

    const supabase = getAuthClient()
    const { data, error } = await supabase.auth.getUser(token)
    if (error) return null
    return data.user ? { id: data.user.id, email: data.user.email } : null
  } catch {
    return null
  }
}


