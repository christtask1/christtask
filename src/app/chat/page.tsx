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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
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

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Thanks! You said: "${text}". (Hook this to your AI/knowledge base.)` },
      ])
      setSending(false)
    }, 500)
  }

  return (
    <div data-page="chat" style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <aside
        aria-label="Chat navigation"
        aria-hidden={!isSidebarOpen}
        style={{
          width: isSidebarOpen ? 240 : 0,
          background: '#0e1530',
          borderRight: isSidebarOpen ? '1px solid var(--border)' : 'none',
          padding: isSidebarOpen ? 16 : 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflow: 'hidden',
          transition: 'width 180ms ease, padding 180ms ease, border-color 180ms ease',
          pointerEvents: isSidebarOpen ? 'auto' : 'none'
        }}
      >
        <div style={{ fontWeight: 800, letterSpacing: '0.2px' }}>ChristTask</div>
        <nav style={{ display: 'grid', gap: 8 }}>
          {[
            { key: 'new', label: 'New' },
            { key: 'documents', label: 'Documents' },
            { key: 'library', label: 'Library' },
            { key: 'ai', label: 'AI Chat', active: true },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              style={{
                textAlign: 'left',
                background: item.active ? 'rgba(122,162,255,0.12)' : 'transparent',
                color: item.active ? '#eef1f8' : 'var(--muted)',
                border: '1px solid var(--border)',
                padding: '10px 12px',
                borderRadius: 10,
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', color: 'var(--muted)', fontSize: 12 }}>
          Signed in: {userEmail || 'Anonymous'}
        </div>
      </aside>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        minWidth: 0
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              onClick={() => setIsSidebarOpen((v) => !v)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                padding: '8px 10px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              {isSidebarOpen ? (
                // « icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              ) : (
                // » icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </button>
            <h2 style={{ margin: 0 }}>Chat</h2>
          </div>
          <div className="muted" style={{ fontSize: 14 }}>
            {userEmail ? `Signed in as ${userEmail}` : 'Not signed in'}
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: 16,
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: m.role === 'user' ? 'rgba(78,123,255,0.15)' : '#0e1530',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontSize: 14, whiteSpace: 'pre-wrap' }}>{m.content}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <form
          onSubmit={onSend}
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 16,
            flexShrink: 0
          }}
        >
          <input
            className="input"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn" type="submit" disabled={sending || !input.trim()}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}
