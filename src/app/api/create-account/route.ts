import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'
import { getAuthUserFromRequest } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getAuthUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingAccount) {
      return NextResponse.json({ message: 'Account already exists', account_id: existingAccount.id })
    }

    // Create account in stripe1.accounts table
    const { data: newAccount, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create account:', error)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Account created successfully', 
      account: newAccount 
    })

  } catch (error: any) {
    console.error('Create account error:', error)
    return NextResponse.json(
      { error: `Failed to create account: ${error.message}` },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
