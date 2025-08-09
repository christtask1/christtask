'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ChatPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Welcome to ChristTask chat. How can I help you today?' },
  ])
  const [input, setInput] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setUserEmail(data.session?.user?.email || '')
    }
    init()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    setMessages((prev) => [...prev, { role: 'user', content: text }])

    // Placeholder assistant response. Replace with your backend/AI call when ready.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Thanks! You said: "${text}". (Hook this to your AI/knowledge base.)` },
      ])
      setSending(false)
    }, 500)
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2>Chat</h2>
          <div className="muted" style={{ fontSize: 14 }}>{userEmail ? `Signed in as ${userEmail}` : 'Not signed in'}</div>
        </div>

        <div className="card" style={{ padding: 16, height: 480, overflowY: 'auto' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '10px 12px',
                borderRadius: 12,
                background: m.role === 'user' ? 'rgba(78,123,255,0.15)' : '#0e1530',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={onSend} style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <input
            className="input"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn" type="submit" disabled={sending || !input.trim()}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </form>
      </div>
    </section>
  )
}
