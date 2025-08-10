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
        }, 50)
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
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        // Wait before starting to delete
        const timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 2000)
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
          marginTop: '-2cm'
        }}>
          <div style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#8B5CF6',
            marginBottom: '20px'
          }}>
            Jesus
          </div>
          <div style={{
            fontSize: '72px',
            color: 'white',
            minHeight: '90px',
            textAlign: 'center',
            marginTop: '10px'
          }}>
            {currentText}
            <span style={{ animation: 'blink 1s infinite' }}>|</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="container">
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
        </div>
      </section>
    </>
  )
}


