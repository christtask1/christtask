'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/payment')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    
    // Whitelist allowed redirects to prevent open redirect attacks
    const allowedRedirects = ['/chat', '/payment', '/', '/success', '/loading']
    if (redirect && allowedRedirects.includes(redirect)) {
      setRedirectTo(redirect)
    }
    // Otherwise keep default '/payment'
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = redirectTo
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <h2>Create account</h2>
        <form onSubmit={onSubmit} className="form" style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          Have an account? <a href={`/login?redirect=${encodeURIComponent(redirectTo)}`}>Log in</a>
        </div>
      </div>
    </section>
  )
}


