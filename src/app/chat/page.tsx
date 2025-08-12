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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const openSidebar = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current) }
    setIsSidebarOpen(true)
  }
  const scheduleCloseSidebar = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current) }
    closeTimer.current = setTimeout(() => setIsSidebarOpen(false), 250)
  }

  return (
    <div data-page="chat" style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Hover hotspot to reveal the sidebar when cursor hits left edge */}
      <div
        aria-hidden
        onMouseEnter={openSidebar}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 12, zIndex: 250, background: 'transparent' }}
      />

      {/* Floating Sidebar (overlay) */}
      <aside
        aria-label="Chat navigation"
        onMouseEnter={openSidebar}
        onMouseLeave={scheduleCloseSidebar}
        style={{
          position: 'fixed',
          left: 12,
          top: 12,
          bottom: 12,
          width: isSidebarOpen ? 260 : 0,
          background: 'linear-gradient(180deg, rgba(23,35,74,0.85), rgba(16,24,48,0.95))',
          border: isSidebarOpen ? '1px solid var(--border)' : '1px solid transparent',
          borderRadius: 16,
          boxShadow: isSidebarOpen ? '0 16px 50px rgba(0,0,0,0.45)' : 'none',
          padding: isSidebarOpen ? 14 : 0,
          overflow: 'hidden',
          transition: 'width 160ms ease, padding 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
          pointerEvents: isSidebarOpen ? 'auto' : 'none',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
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
          <h2 style={{ margin: 0 }}>Chat</h2>
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
