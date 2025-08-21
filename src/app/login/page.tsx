'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirectTo, setRedirectTo] = useState('/chat')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    
    // Whitelist allowed redirects to prevent open redirect attacks
    const allowedRedirects = ['/chat', '/payment', '/', '/success', '/loading']
    if (redirect && allowedRedirects.includes(redirect)) {
      setRedirectTo(redirect)
    }
    // Otherwise keep default '/chat'
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
    <section className="section" data-page="login">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <div className="welcome-text">Welcome back</div>
            <h2 className="login-title">Sign in to ChristTask</h2>
          </div>

          <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input password-input"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="password-toggle"
                >
                  {showPassword ? (
                    // Eye off icon
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.86 2.98-5.06 5.22-6.41" />
                      <path d="M1 1l22 22" />
                      <path d="M9.88 9.88A3 3 0 0 0 12 15c1.66 0 3-1.34 3-3 0-.53-.14-1.02-.38-1.45" />
                      <path d="M22.11 11.99C20.39 7.99 16.12 5 12 5c-.82 0-1.62.1-2.38.3" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="signup-link">
            No account?{' '}
            <a href="/payment" className="link">Sign up</a>
          </div>
        </div>
      </div>

      <style>{`
        /* Mobile-first responsive design */
        .section {
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }
        
        .login-card {
          width: 100%;
          max-width: 440px;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          backdrop-filter: saturate(180%) blur(16px);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        
        .login-header {
          margin-bottom: 24px;
          text-align: center;
        }
        
        .welcome-text {
          color: #a8b3cf;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .login-title {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        
        .login-form {
          display: grid;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .form-group {
          display: grid;
          gap: 8px;
        }
        
        .form-label {
          font-size: 14px;
          color: #c9d1e7;
          font-weight: 500;
        }
        
        .form-input {
          height: 56px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          color: #eef1f8;
          outline: none;
          font-size: 16px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px rgba(122, 162, 255, 0.1);
          transform: translateY(-1px);
        }
        
        .form-input::placeholder {
          color: rgba(238, 241, 248, 0.5);
        }
        
        .password-container {
          position: relative;
        }
        
        .password-input {
          padding-right: 56px;
          width: 100%;
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #c9d1e7;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          min-height: 40px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .password-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }
        
        .password-toggle:active {
          transform: translateY(-50%) scale(0.95);
        }
        
        .error-message {
          background: rgba(255,99,99,0.08);
          border: 1px solid rgba(255,99,99,0.25);
          color: #ff8080;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          text-align: center;
        }
        
        .login-button {
          height: 56px;
          background: linear-gradient(180deg, var(--brand), var(--brand-strong));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        
        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(78, 123, 255, 0.3);
        }
        
        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .signup-link {
          text-align: center;
          color: #a8b3cf;
          font-size: 14px;
        }
        
        .link {
          color: var(--brand);
          text-decoration: none;
          font-weight: 500;
        }
        
        .link:hover {
          text-decoration: underline;
        }
        
        /* Tablet styles */
        @media (min-width: 768px) {
          .section {
            padding: 40px 20px;
          }
          
          .login-card {
            padding: 32px;
          }
          
          .login-title {
            font-size: 28px;
          }
          
          .welcome-text {
            font-size: 16px;
          }
          
          .form-input {
            height: 60px;
            font-size: 16px;
          }
          
          .login-button {
            height: 60px;
            font-size: 18px;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 1024px) {
          .section {
            padding: 60px 40px;
          }
          
          .login-card {
            padding: 40px;
          }
          
          .login-title {
            font-size: 32px;
          }
          
          .form-input {
            height: 64px;
          }
          
          .login-button {
            height: 64px;
            font-size: 18px;
          }
        }
        
        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .form-input {
            min-height: 56px;
            font-size: 16px;
          }
          
          .login-button {
            min-height: 56px;
            font-size: 16px;
          }
          
          .password-toggle {
            min-height: 48px;
            min-width: 48px;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .form-input {
            border-width: 0.5px;
          }
        }
      `}</style>
    </section>
  )
}


