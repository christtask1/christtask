import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export type AuthUser = { id: string; email?: string | null }

export async function getAuthUser(request?: Request): Promise<AuthUser | null> {
  try {
    let accessToken: string | null = null

    // Try to get token from Authorization header first (more reliable)
    if (request) {
      const authHeader = request.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7)
        console.log('Debug - Found Authorization header token')
      }
    }

    // Fallback to cookies if no Authorization header
    if (!accessToken) {
      const cookieStore = await cookies()
      const allCookies = Object.fromEntries(cookieStore.getAll().map(cookie => [cookie.name, cookie.value]))
      console.log('Debug - All cookies:', Object.keys(allCookies))
      
      accessToken =
        cookieStore.get('sb-access-token')?.value ||
        cookieStore.get('supabase-auth-token')?.value ||
        null
      
      console.log('Debug - Found cookie token:', !!accessToken)
    }
    
    if (!accessToken) return null

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, detectSessionInUrl: false },
    })

    const { data, error } = await supabase.auth.getUser(accessToken)
    if (error) {
      console.log('Debug - Supabase auth error:', error.message)
      return null
    }
    return data.user ? { id: data.user.id, email: data.user.email } : null
  } catch (e) {
    console.log('Debug - Auth error:', e)
    return null
  }
}


