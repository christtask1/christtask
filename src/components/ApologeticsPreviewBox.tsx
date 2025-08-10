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
  const [phase, setPhase] = useState<'think' | 'type' | 'hold'>('think')
  const [typed, setTyped] = useState('')

  const scenario = useMemo(() => SCENARIOS[index], [index])

  // Thinking pause before typing begins
  useEffect(() => {
    if (phase !== 'think') return
    setTyped('')
    const t = setTimeout(() => setPhase('type'), 800)
    return () => clearTimeout(t)
  }, [phase])

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'type') return
    if (typed.length >= scenario.answer.length) {
      const t = setTimeout(() => setPhase('hold'), 900)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setTyped(scenario.answer.slice(0, typed.length + 1))
    }, 35)
    return () => clearTimeout(t)
  }, [phase, typed, scenario.answer])

  // Hold, then advance to next scenario
  useEffect(() => {
    if (phase !== 'hold') return
    const t = setTimeout(() => {
      setIndex((prev) => (prev + 1) % SCENARIOS.length)
      setPhase('think')
    }, 1400)
    return () => clearTimeout(t)
  }, [phase])

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
            {phase === 'think' ? (
              <TypingIndicator />
            ) : (
              <div>
                <strong style={{ color: '#0f172a' }}>{scenario.verse}</strong>
                <span style={{ color: '#111827' }}> — {typed}</span>
                <span style={styles.cursor}>|</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
        @keyframes dot { 0%, 20% { transform: translateY(0); opacity: .6 } 50% { transform: translateY(-3px); opacity: 1 } 80%, 100% { transform: translateY(0); opacity: .6 } }
      `}</style>
    </div>
  )
}

function TypingIndicator() {
  const dotStyle: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: '#8E8E93',
    margin: '0 3px',
    display: 'inline-block'
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: 22 }}>
      <span style={{ ...dotStyle, animation: 'dot 1s infinite .0s' }} />
      <span style={{ ...dotStyle, animation: 'dot 1s infinite .15s' }} />
      <span style={{ ...dotStyle, animation: 'dot 1s infinite .3s' }} />
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
    border: '1px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'saturate(180%) blur(12px)',
    WebkitBackdropFilter: 'saturate(180%) blur(12px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
    color: '#0f172a'
  },
  rowClaim: { display: 'flex', alignItems: 'center', gap: 10 },
  rowAnswer: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  badgeNeutral: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    color: '#007AFF', // iOS blue
    border: '1px solid rgba(0,122,255,0.25)',
    background: 'rgba(0,122,255,0.10)'
  },
  badgeScripture: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    color: '#34C759', // iOS green
    border: '1px solid rgba(52,199,89,0.28)',
    background: 'rgba(52,199,89,0.12)'
  },
  bubbleClaim: {
    background: 'rgba(0,0,0,0.04)',
    border: '1px solid rgba(0,0,0,0.08)',
    padding: '10px 12px',
    borderRadius: 14,
    color: '#1f2937',
    maxWidth: 380
  },
  bubbleAnswer: {
    background: 'rgba(52,199,89,0.08)',
    border: '1px solid rgba(52,199,89,0.22)',
    padding: '10px 12px',
    borderRadius: 14,
    color: '#1f2937',
    maxWidth: 380
  },
  cursor: { marginLeft: 2, animation: 'blink 1s infinite' }
}


