'use client'

// ChristTask homepage - helping users defend their faith with Scripture and AI assistance

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
        <div className="container hero-container">

          <div className="hero-title">
            Jesus
          </div>
          <div className="hero-subtitle">
            {currentText}
            <span style={{ animation: 'blink 1s infinite' }}>|</span>
          </div>

          <p className="hero-description">
            Simply ask it a question, and it counters with Scripture, morality, and proof.
          </p>

          <a href="/payment" className="hero-button">
            Never lose a debate
          </a>
          <div className="muted" style={{ marginTop: '8px', fontSize: '14px' }}>(Instantly)</div>
        </div>
        {/* Trigger deployment */}
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

      {/* Trust bar */}
      <section className="section">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div className="muted" style={{ fontWeight: 600 }}>Trusted for clarity by</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>        
            <span className="pill">Students</span>
            <span className="pill">Pastors</span>
            <span className="pill">Creators</span>
            <span className="pill">Small groups</span>
          </div>
        </div>
      </section>

      {/* Built for real conversations */}
      <section className="section">
        <div className="container">
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>Built for real conversations</h2>
          <p className="muted" style={{ margin: '6px 0 16px' }}>Clear answers. Scripture citations. A respectful tone you can use anywhere.</p>
          <div className="grid grid-3">
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Cited with Scripture</div>
              <div className="muted">Every response includes chapter and verse so you can verify fast.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Ready to share</div>
              <div className="muted">Lead sentence + 2–3 crisp points that fit chats, posts, and talks.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Respectful by design</div>
              <div className="muted">Firm, charitable answers—great for skeptics and interfaith dialogue.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>How it works</h2>
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>1. Ask a claim</div>
              <div className="muted">"God can't exist—children suffer." "Jesus is just a prophet." Ask anything.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>2. Retrieve Scripture</div>
              <div className="muted">ChristTask pulls relevant passages and supporting reasoning.</div>
            </div>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>3. Get your answer</div>
              <div className="muted">Concise bullets + citations you can verify and share.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section">
        <div className="container">
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>Where it helps most</h2>
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>Debates & dialogue</div><div className="muted">Answer tough claims with clarity and charity.</div></div>
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>Study & prep</div><div className="muted">Jump to the right passages without tab‑hopping.</div></div>
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>Teaching & content</div><div className="muted">Outline points quickly with sourced verses.</div></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>What people say</h2>
          <div className="grid grid-2" style={{ marginTop: 12 }}>
            <div className="card">
              <div className="muted">"It gives me verses faster than I could search, and the points are shareable as‑is."</div>
              <div style={{ marginTop: 8, fontWeight: 600 }}>Daniel — Student</div>
            </div>
            <div className="card">
              <div className="muted">"Respectful tone, clear logic, Scripture I can verify. I use it for real conversations."</div>
              <div style={{ marginTop: 8, fontWeight: 600 }}>Grace — Small‑group leader</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (links to /payment) */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 16 }}>      
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>Choose your plan</h2>
          <div className="grid grid-2">
            <a href="/payment" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Weekly</div>   
                <div style={{ fontSize: 28, fontWeight: 700 }}>£4.50</div>    
              </div>
              <div className="muted" style={{ marginTop: 6 }}>Billed weekly</div>
              <div style={{ marginTop: 12 }}><span className="btn" style={{ padding: '10px 14px', borderRadius: 10 }}>Get Access</span></div>
            </a>
            <a href="/payment" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Monthly</div>  
                <div style={{ fontSize: 28, fontWeight: 700 }}>£11.99</div>   
              </div>
              <div className="muted" style={{ marginTop: 6 }}>Billed monthly</div>
              <div style={{ marginTop: 12 }}><span className="btn" style={{ padding: '10px 14px', borderRadius: 10 }}>Get Access</span></div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 16 }}>      
          <h2 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.01em' }}>FAQ</h2>
          <div className="grid grid-2">
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>Does this replace Scripture?</div><div className="muted">No—ChristTask is a study assistant; Scripture remains primary.</div></div>
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>Can I verify sources?</div><div className="muted">Yes. Answers include chapter and verse so you can check context.</div></div>
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>Is it respectful?</div><div className="muted">The tone aims for clarity, charity, and confidence.</div></div>
            <div className="card"><div style={{ fontWeight: 700, marginBottom: 6 }}>What about denominations?</div><div className="muted">We focus on historic, core Christianity and plain‑sense exegesis.</div></div>
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

      <style>{`
        /* Responsive Hero Styles */
        .hero-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          margin-top: 1cm;
          padding: 0 20px;
        }
        
        .hero-title {
          font-size: 84px;
          font-weight: bold;
          color: #8B5CF6;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .hero-subtitle {
          font-size: 60px;
          color: white;
          font-weight: bold;
          min-height: 75px;
          text-align: center;
          margin-top: 10px;
        }
        
        .hero-description {
          margin-top: 26px;
          font-size: 20px;
          max-width: 920px;
          text-align: center;
          color: #ffffff;
          line-height: 1.5;
        }
        
        .hero-button {
          margin-top: 24px;
          padding: 14px 40px;
          border-radius: 12px;
          background: linear-gradient(180deg, #3a4a5c 0%, #2a3a4c 50%, #1a2a3c 100%);
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          border: 1px solid #4a5a6c;
          border-top: 1px solid rgba(255, 255, 255, 1);
          box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 2px 8px rgba(0, 0, 0, 0.25);
          transition: all 0.2s ease;
          min-width: 220px;
          text-align: center;
        }
        
        /* Tablet Styles (768px - 1024px) */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 64px;
          }
          .hero-subtitle {
            font-size: 44px;
            min-height: 60px;
          }
          .hero-description {
            font-size: 18px;
            max-width: 680px;
          }
          .hero-button {
            padding: 12px 32px;
            min-width: 200px;
          }
          .hero-container {
            margin-top: 40px;
            min-height: 50vh;
          }
        }
        
        /* Mobile Styles (max-width: 768px) */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .hero-subtitle {
            font-size: 32px;
            min-height: 45px;
            margin-top: 8px;
          }
          .hero-description {
            font-size: 16px;
            margin-top: 20px;
            max-width: 90%;
            padding: 0 10px;
          }
          .hero-button {
            margin-top: 20px;
            padding: 12px 28px;
            min-width: 180px;
            font-size: 16px;
          }
          .hero-container {
            margin-top: 20px;
            min-height: 40vh;
            padding: 0 15px;
          }
        }
        
        /* Small Mobile (max-width: 480px) */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 36px;
            margin-bottom: 12px;
          }
          .hero-subtitle {
            font-size: 24px;
            min-height: 35px;
          }
          .hero-description {
            font-size: 14px;
            margin-top: 16px;
            line-height: 1.4;
          }
          .hero-button {
            padding: 10px 24px;
            min-width: 160px;
            font-size: 14px;
          }
          .hero-container {
            margin-top: 10px;
            min-height: 35vh;
            padding: 0 10px;
          }
        }
      `}</style>
    </>
  )
}
