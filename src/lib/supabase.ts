import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for Stripe wrapper tables
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          customer_id: string
          status: string
          price_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: string
          price_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: string
          price_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      prices: {
        Row: {
          id: string
          product: string
          unit_amount: number
          currency: string
          type: string
          active: boolean
          created: string
        }
        Insert: {
          id?: string
          product: string
          unit_amount: number
          currency: string
          type: string
          active?: boolean
          created?: string
        }
        Update: {
          id?: string
          product?: string
          unit_amount?: number
          currency?: string
          type?: string
          active?: boolean
          created?: string
        }
      }
    }
  }
}
