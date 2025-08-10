'use client'

import { useEffect, useMemo, useState } from 'react'

type Scenario = { claim: string; verse: string; answer: string }

const SCENARIOS: Scenario[] = [
  {
    claim: '“Jesus never claimed to be God.”',
    verse: 'John 10:30; John 8:58',
    answer:
      'Jesus said “I and the Father are one” and “Before Abraham was, I AM.” His listeners recognized the divine claim.'
  },
  {
    claim: '“The Resurrection is a myth.”',
    verse: '1 Corinthians 15:3–8',
    answer:
      'Paul cites an early creed and hundreds of eyewitnesses; many were alive to be questioned, anchoring the claim in history.'
  },
  {
    claim: '“The Bible was changed over time.”',
    verse: 'Isaiah 40:8',
    answer:
      'Thousands of early manuscripts, including the Dead Sea Scrolls, show stability; differences are minor and do not alter core doctrine.'
  }
]

export default function ApologeticsPreviewBox() {
  const [index, setIndex] = useState(0)
  const scenario = useMemo(() => SCENARIOS[index], [index])

  // Auto-advance scenarios with a calm cadence
  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((prev) => (prev + 1) % SCENARIOS.length)
    }, 3200)
    return () => clearTimeout(t)
  }, [index])

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Claim row */}
        <div style={styles.rowClaim}>
          <span style={styles.badgeNeutral}>Claim</span>
          <div style={styles.bubbleClaim}>{scenario.claim}</div>
        </div>

        <div style={{ height: 12 }} />

        {/* Answer row */}
        <div style={styles.rowAnswer}>
          <span style={styles.badgeScripture}>Scripture</span>
          <div style={styles.bubbleAnswer}>
            <div key={`ans-${index}`} style={styles.revealTextDelayed}>
              <strong style={{ color: '#ffffff' }}>{scenario.verse}</strong>
              <span style={{ color: '#F2F4F8' }}> — {scenario.answer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes reveal { from { opacity: 0; transform: translateY(8px); filter: blur(6px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
      `}</style>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  card: {
    width: 'min(560px, 92vw)',
    borderRadius: 24,
    padding: 18,
    height: 240,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'transparent',
    // Fully see-through card, no glass blur
    backdropFilter: undefined as unknown as string,
    WebkitBackdropFilter: undefined as unknown as string,
    boxShadow: '0 10px 30px rgba(0,0,0,0.20)',
    color: '#ffffff'
  },
  rowClaim: { display: 'flex', alignItems: 'center', gap: 10 },
  rowAnswer: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  badgeNeutral: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.10)'
  },
  badgeScripture: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,255,255,0.12)'
  },
  bubbleClaim: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.25)',
    padding: '10px 12px',
    borderRadius: 14,
    color: '#ffffff',
    maxWidth: 380,
    minHeight: 48,
    maxHeight: 64,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden'
  },
  bubbleAnswer: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.28)',
    padding: '10px 12px',
    borderRadius: 14,
    color: '#ffffff',
    maxWidth: 380,
    minHeight: 48,
    maxHeight: 96,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden'
  },
  revealTextDelayed: {
    animation: 'reveal .42s ease-out both',
    animationDelay: '0.08s',
    willChange: 'transform, filter, opacity'
  }
}


