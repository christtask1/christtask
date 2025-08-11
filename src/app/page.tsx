'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ApologeticsPreviewBox = dynamic(() => import('../components/ApologeticsPreviewBox'), { ssr: false })

export default function Home() {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const phrases = [
    "is just a prophet",
    "is only human", 
    "never claimed he was God"
  ]

  useEffect(() => {
    const currentPhrase = phrases[currentIndex]
    
    if (isDeleting) {
      // Delete text
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, 20)
        return () => clearTimeout(timeout)
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
      }
    } else {
      // Type text
      if (currentText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
        }, 35)
        return () => clearTimeout(timeout)
      } else {
        // Wait before starting to delete
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 1000)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentText, currentIndex, isDeleting, phrases])

  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          marginTop: '1cm'
        }}>

                                           <div style={{
              fontSize: '84px',
              fontWeight: 'bold',
              color: '#8B5CF6',
              marginBottom: '20px'
            }}>
              Jesus
            </div>
          <div style={{
            fontSize: '60px',
            color: 'white',
            fontWeight: 'bold',
            minHeight: '75px',
            textAlign: 'center',
            marginTop: '10px'
          }}>
            {currentText}
            <span style={{ animation: 'blink 1s infinite' }}>|</span>
          </div>

          <p className="muted" style={{
            marginTop: '26px',
            fontSize: '20px',
            maxWidth: '920px',
            textAlign: 'center'
          }}>
            Simply ask it a question, and it counters with Scripture, morality, and proof.
          </p>

          <a href="/payment" className="btn" style={{ marginTop: '24px', padding: '12px 22px', borderRadius: '12px' }}>
            Never lose a debate
          </a>
          <div className="muted" style={{ marginTop: '8px', fontSize: '14px' }}>(Instantly)</div>
        </div>
      </section>

      {/* Demo Box Section (light, Apple-style) */}
      <section className="section">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              color: '#4d96ff',
              fontWeight: 'var(--font-weight-medium)',
              letterSpacing: 'var(--tracking-tight)',
              lineHeight: 'var(--leading-snug)',
              fontSize: '1.125rem',
              display: 'block'
            }}
          >
            Answer False Claims
          </div>
          <ApologeticsPreviewBox />
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.01em' }}>Choose your plan</h2>
          <div className="grid grid-2">
            <a href="/payment" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Weekly</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>£4.50</div>
              </div>
              <div className="muted" style={{ marginTop: 6 }}>Billed weekly</div>
              <div style={{ marginTop: 12 }}>
                <span className="btn" style={{ padding: '10px 14px', borderRadius: 10 }}>Get Access</span>
              </div>
            </a>

            <a href="/payment" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Monthly</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>£11.99</div>
              </div>
              <div className="muted" style={{ marginTop: 6 }}>Billed monthly</div>
              <div style={{ marginTop: 12 }}>
                <span className="btn" style={{ padding: '10px 14px', borderRadius: 10 }}>Get Access</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Why pay? */}
      <section className="section">
        <div className="container">
          <h2 style={{ margin: '0 0 14px', fontSize: 24, letterSpacing: '-0.01em' }}>Why pay?</h2>
          <div className="grid grid-3">
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Cites Scripture</div>
              <div className="muted">Every answer includes chapter and verse you can verify.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Clear structure</div>
              <div className="muted">Lead sentence + 2–3 crisp points you can share.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Saves hours</div>
              <div className="muted">Pulls relevant passages fast—no tab‑hopping.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.01em' }}>How it works</h2>
          <ol style={{ margin: 0, paddingLeft: 18, color: 'var(--text)' }}>
            <li style={{ marginBottom: 6 }}>Ask any claim or question.</li>
            <li style={{ marginBottom: 6 }}>ChristTask retrieves relevant Scripture and trusted sources.</li>
            <li>Get a concise answer with citations and shareable bullets.</li>
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.01em' }}>Features</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li className="muted">Bible integration: instant verse citations in multiple translations.</li>
            <li className="muted">Modes: Quick Answer or Deep Dive with references.</li>
            <li className="muted">Share & Save: copy answers, save threads, revisit citations.</li>
            <li className="muted">Tone control: respectful, firm, or academic.</li>
            <li className="muted">Privacy: your chats aren’t shared; you control exports.</li>
          </ul>
        </div>
      </section>

      {/* Who it's for */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.01em' }}>Who it’s for</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li className="muted">Christians in conversations and debates</li>
            <li className="muted">Students and small‑group leaders</li>
            <li className="muted">Pastors and creators who need quick, sourced outlines</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.01em' }}>FAQ</h2>
          <div className="grid grid-2">
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Is this replacing Scripture?</div>
              <div className="muted">No—ChristTask is a study assistant; Scripture stays primary.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Is it accurate?</div>
              <div className="muted">Answers include citations so you can verify. You’re in control.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Denominational concerns?</div>
              <div className="muted">We prioritize core, historic Christianity and plain‑sense exegesis.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Will it be combative?</div>
              <div className="muted">No—answers aim for clarity, charity, and confidence.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>Be ready with an answer—today</h2>
          <a href="/payment" className="btn" style={{ marginTop: 14 }}>Get Access</a>
        </div>
      </section>

    </>
  )
}


