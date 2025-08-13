import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export type AuthUser = { id: string; email?: string | null }

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value || cookieStore.get('supabase-auth-token')?.value
    if (!accessToken) return null

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false, detectSessionInUrl: false },
    })

    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user ? { id: data.user.id, email: data.user.email } : null
  } catch {
    return null
  }
}


