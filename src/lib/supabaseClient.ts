import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Main client for stripe1 schema (subscriptions, payments, etc.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'stripe1'
  }
})

// Auth client for public schema (user authentication)
export const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
