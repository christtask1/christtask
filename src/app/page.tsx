'use client'

import { useState, useEffect } from 'react'

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
        }, 15)
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
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        // Wait before starting to delete
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 800)
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
            fontSize: '60px',
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

      
    </>
  )
}


