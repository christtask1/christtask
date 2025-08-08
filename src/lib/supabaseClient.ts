import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Create a singleton Supabase client for the browser
// Requires env vars:
// - NEXT_PUBLIC_SUPABASE_URL
// - NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local.'
  )
}

declare global {
  // eslint-disable-next-line no-var
  var __supabase__: SupabaseClient | undefined
}

export const supabase: SupabaseClient =
  (typeof window !== 'undefined' && window.__supabase__) || createClient(supabaseUrl, supabaseAnonKey)

if (typeof window !== 'undefined') {
  window.__supabase__ = supabase
}


