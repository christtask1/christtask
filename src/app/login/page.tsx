'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/payment')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect) setRedirectTo(redirect)
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = redirectTo
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 420 }}>
        <h2>Log in</h2>
        <form onSubmit={onSubmit} className="form" style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <div style={{ color: '#ff6b6b' }}>{error}</div>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div style={{ marginTop: 12 }}>
          No account? <a href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}>Sign up</a>
        </div>
      </div>
    </section>
  )
}


