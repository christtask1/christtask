'use client'

import { useEffect } from 'react'

export default function LoadingRedirect() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.replace('/chat')
    }, 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      color: '#fff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 0.5 }}>ChristTask</div>
        <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'center' }}>
          <div className="spinner" style={{ width: 10, height: 10, borderRadius: '50%', background: '#7aa2ff', animation: 'pulse 1.2s infinite ease-in-out' }} />
          <div className="spinner" style={{ width: 10, height: 10, borderRadius: '50%', background: '#7aa2ff', animation: 'pulse 1.2s infinite ease-in-out 0.15s' }} />
          <div className="spinner" style={{ width: 10, height: 10, borderRadius: '50%', background: '#7aa2ff', animation: 'pulse 1.2s infinite ease-in-out 0.3s' }} />
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0%, 60%, 100% { transform: scale(1); opacity: 1 } 30% { transform: scale(0.7); opacity: 0.7 } }
      `}</style>
    </div>
  )
}


