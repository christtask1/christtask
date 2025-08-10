'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/chat')

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
    <section className="section" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: 'min(440px, 94vw)',
            borderRadius: 20,
            padding: 24,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'saturate(180%) blur(16px)',
            WebkitBackdropFilter: 'saturate(180%) blur(16px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)'
          }}
        >
          <div style={{ marginBottom: 6, color: '#a8b3cf', fontSize: 14 }}>Welcome back</div>
          <h2 style={{ margin: 0, fontSize: 22, letterSpacing: '-0.01em' }}>Sign in to ChristTask</h2>

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 18 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#c9d1e7' }}>Email</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  height: 44,
                  padding: '0 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#eef1f8',
                  outline: 'none'
                }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#c9d1e7' }}>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  height: 44,
                  padding: '0 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#eef1f8',
                  outline: 'none'
                }}
              />
            </label>

            {error && (
              <div style={{
                background: 'rgba(255,99,99,0.08)',
                border: '1px solid rgba(255,99,99,0.25)',
                color: '#ff8080',
                padding: '8px 10px',
                borderRadius: 10
              }}>
                {error}
              </div>
            )}

            <button
              className="btn"
              type="submit"
              disabled={loading || !email || !password}
              style={{ justifyContent: 'center' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 14, color: '#a8b3cf' }}>
            No account?{' '}
            <a href={`/signup?redirect=${encodeURIComponent(redirectTo)}`} className="link">Sign up</a>
          </div>
        </div>
      </div>
    </section>
  )
}


