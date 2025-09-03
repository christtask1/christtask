'use client'

import { useEffect, useMemo, useState } from 'react'

type Scenario = { claim: string; verse: string; answer: string; bullets: string[] }

const SCENARIOS: Scenario[] = [
  {
    claim: '“Jesus never claimed to be God.”',
    verse: 'John 10:30; John 8:58',
    answer:
      'Short answer: He did—clearly and in ways His audience understood.',
    bullets: [
      'Identity: “I and the Father are one” and “Before Abraham was, I AM” (echoing Exodus 3:14).',
      'Reaction: The crowd tried to stone Him—because they understood He was claiming deity (John 10:33).',
      'Titles & worship: “Son of Man” of Daniel 7; He forgave sins and received worship.'
    ]
  },
  {
    claim: '“The Resurrection is a myth.”',
    verse: '1 Corinthians 15:3–8',
    answer:
      'Short answer: The best early sources point to a real, public event.',
    bullets: [
      'Earliest creed: Paul quotes a formula within years of the event, not centuries later.',
      'Eyewitnesses: Over 500 people; many were still alive when published—inviting fact‑checking.',
      'Impact: Cowardly disciples became bold witnesses; the movement exploded in hostile territory.'
    ]
  },
  {
    claim: '“The Bible was changed over time.”',
    verse: 'Isaiah 40:8',
    answer:
      'Short answer: The text is remarkably stable across thousands of manuscripts.',
    bullets: [
      'Manuscripts: We have an unparalleled number of copies across centuries and regions.',
      'Dead Sea Scrolls: OT texts match later copies closely—showing long‑term stability.',
      'Variants: Mostly spelling/word order; no core doctrine hangs on a disputed reading.'
    ]
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
        {/* Header */}
        <div style={styles.headerRow}>
          <span style={styles.headerTitle}>Debate</span>
        </div>
        <div style={styles.headerDivider} />
        {/* Claim row */}
        <div style={styles.rowClaim}>
          <span style={styles.badgeNeutral}>Claim</span>
          <div style={styles.bubbleClaim}>
            <div key={`claim-${index}`} style={styles.revealText}>{scenario.claim}</div>
          </div>
        </div>

        <div style={{ height: 12 }} />

        {/* Answer row */}
        <div style={styles.rowAnswer}>
          <span style={styles.badgeScripture}>ChristTask</span>
          <div style={styles.bubbleAnswer}>
            <div key={`ans-${index}`} style={{ width: '100%' }}>
              <div style={styles.revealTextDelayed}>
                <strong style={{ color: '#ffffff' }}>{scenario.verse}</strong>
                <span style={{ color: '#F2F4F8' }}> — {scenario.answer}</span>
              </div>
              <ul style={styles.pointsList}>
                {scenario.bullets.map((p, i) => (
                  <li
                    key={i}
                    style={{
                      ...styles.pointItem,
                      ...styles.pointReveal,
                      animationDelay: `${160 + i * 100}ms`
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes blurReveal { 
          from { 
            opacity: 0; 
            filter: blur(10px); 
            transform: translate3d(0, 0, 0);
          } 
          to { 
            opacity: 1; 
            filter: blur(0); 
            transform: translate3d(0, 0, 0);
          } 
        }
      `}</style>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '400px',
    position: 'relative'
  },
  card: {
    width: 'min(700px, 92vw)',
    borderRadius: 24,
    padding: 18,
    minHeight: 320,
    border: '1px solid rgba(255,255,255,0.22)',
    background: 'rgba(255,255,255,0.08)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)',
    color: '#ffffff',
    fontFamily: '-apple-system, system-ui, Segoe UI, Roboto, Inter, Arial, sans-serif',
    position: 'relative'
  },
  headerRow: { display: 'flex', alignItems: 'center' },
  headerTitle: { fontSize: 14, fontWeight: 600, color: '#4E7BFF', letterSpacing: 0.2, textShadow: '0 1px 1px rgba(0,0,0,0.25)' },
  headerDivider: {
    height: 1,
    width: '100%',
    background: 'rgba(255,255,255,0.14)',
    borderRadius: 1,
    margin: '8px 0 12px',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.22)'
  },
  rowClaim: { display: 'flex', alignItems: 'center', gap: 10 },
  rowAnswer: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  badgeNeutral: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.10)'
  },
  badgeScripture: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.10)'
  },
  bubbleClaim: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.20)',
    padding: '10px 12px',
    borderRadius: 14,
    color: '#ffffff',
    maxWidth: '100%',
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    overflow: 'visible',
    textShadow: '0 1px 1px rgba(0,0,0,0.25)'
  },
  bubbleAnswer: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.20)',
    padding: '10px 12px',
    borderRadius: 14,
    color: '#ffffff',
    maxWidth: '100%',
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    overflow: 'visible',
    textShadow: '0 1px 1px rgba(0,0,0,0.25)'
  },
  pointsList: {
    margin: '8px 0 0',
    padding: '0 0 0 16px',
    color: '#EAEFF9',
    fontSize: 13,
    lineHeight: 1.35
  },
  pointItem: {
    marginBottom: 6
  },
  pointReveal: {
    animation: 'blurReveal 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
    willChange: 'filter, opacity',
    transform: 'translate3d(0, 0, 0)'
  },
  revealText: {
    animation: 'blurReveal 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
    willChange: 'filter, opacity',
    transform: 'translate3d(0, 0, 0)'
  },
  revealTextDelayed: {
    animation: 'blurReveal 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
    animationDelay: '120ms',
    willChange: 'filter, opacity',
    transform: 'translate3d(0, 0, 0)'
  }
}


