'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// Minimal book metadata for Old and New Testament (book name + number of chapters)
const OLD_TESTAMENT: Array<{ name: string; chapters: number }> = [
  { name: 'Genesis', chapters: 50 }, { name: 'Exodus', chapters: 40 }, { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 }, { name: 'Deuteronomy', chapters: 34 }, { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 }, { name: 'Ruth', chapters: 4 }, { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 }, { name: '1 Kings', chapters: 22 }, { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 }, { name: '2 Chronicles', chapters: 36 }, { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 }, { name: 'Esther', chapters: 10 }, { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 }, { name: 'Proverbs', chapters: 31 }, { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 }, { name: 'Isaiah', chapters: 66 }, { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 }, { name: 'Ezekiel', chapters: 48 }, { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 }, { name: 'Joel', chapters: 3 }, { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 }, { name: 'Jonah', chapters: 4 }, { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 }, { name: 'Habakkuk', chapters: 3 }, { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 }, { name: 'Zechariah', chapters: 14 }, { name: 'Malachi', chapters: 4 }
]

const NEW_TESTAMENT: Array<{ name: string; chapters: number }> = [
  { name: 'Matthew', chapters: 28 }, { name: 'Mark', chapters: 16 }, { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 }, { name: 'Acts', chapters: 28 }, { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 }, { name: '2 Corinthians', chapters: 13 }, { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 }, { name: 'Philippians', chapters: 4 }, { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 }, { name: '2 Thessalonians', chapters: 3 }, { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 }, { name: 'Titus', chapters: 3 }, { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 }, { name: 'James', chapters: 5 }, { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 }, { name: '1 John', chapters: 5 }, { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 }, { name: 'Jude', chapters: 1 }, { name: 'Revelation', chapters: 22 }
]

export default function ChatPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Welcome to ChristTask chat. How can I help you today?' },
  ])
  const [input, setInput] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)

  // Sidebar + Bible panel state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isBibleOpen, setIsBibleOpen] = useState<boolean>(false)
  const [activeTestament, setActiveTestament] = useState<'OT' | 'NT'>('OT')
  const [selectedBook, setSelectedBook] = useState<{ name: string; chapters: number } | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [bibleLoading, setBibleLoading] = useState<boolean>(false)
  const [bibleError, setBibleError] = useState<string | null>(null)
  const [bibleText, setBibleText] = useState<string>('')

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const chatTopRef = useRef<HTMLDivElement | null>(null)
  const biblePanelRef = useRef<HTMLDivElement | null>(null)

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

    try {
      // Call your RAG backend through the API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content }
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ])
    } finally {
      setSending(false)
    }
  }

  const openSidebar = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current) }
    setIsSidebarOpen(true)
  }
  const scheduleCloseSidebar = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current) }
    closeTimer.current = setTimeout(() => setIsSidebarOpen(false), 250)
  }

  const books = activeTestament === 'OT' ? OLD_TESTAMENT : NEW_TESTAMENT

  const loadBibleChapter = async (bookName: string, chapter: number) => {
    try {
      setBibleLoading(true)
      setBibleError(null)
      setBibleText('')
      const ref = encodeURIComponent(`${bookName} ${chapter}`)
      const url = `https://bible-api.com/${ref}?translation=kjv`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to load ${bookName} ${chapter}`)
      const data = await res.json()
      const text = (data.verses || [])
        .map((v: any) => `${v.verse}. ${v.text.trim()}`)
        .join('\n')
      setBibleText(text || data.text || '')
    } catch (e: any) {
      setBibleError(e?.message || 'Unable to load passage')
    } finally {
      setBibleLoading(false)
    }
  }

  const handleSelectBook = (book: { name: string; chapters: number }) => {
    setSelectedBook(book)
    setSelectedChapter(1)
    setIsBibleOpen(true)
    loadBibleChapter(book.name, 1)
    setTimeout(() => {
      biblePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const handleChangeChapter = (chapter: number) => {
    if (!selectedBook) return
    setSelectedChapter(chapter)
    loadBibleChapter(selectedBook.name, chapter)
  }

  // Sidebar navigation actions
  const goToBible = () => {
    setIsBibleOpen(true)
    setIsSidebarOpen(false)
    setTimeout(() => {
      biblePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }
  const goToChat = () => {
    setIsBibleOpen(false)
    setIsSidebarOpen(false)
    setTimeout(() => {
      chatTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  return (
    <div data-page="chat" style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div
        aria-hidden
        onMouseEnter={openSidebar}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 12, zIndex: 250, background: 'transparent' }}
      />

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
            { key: 'bible', label: 'Bible', onClick: goToBible },
            { key: 'ai', label: 'AI Chat', onClick: goToChat, active: !isBibleOpen },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick as any}
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

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        minWidth: 0
      }}>
        <div ref={chatTopRef} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexShrink: 0
        }}>
          <h2 style={{ margin: 0 }}>Chat</h2>
        </div>

        {isBibleOpen && (
          <div ref={biblePanelRef} className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setActiveTestament('OT')}
                  style={{
                    background: activeTestament === 'OT' ? 'rgba(122,162,255,0.12)' : 'transparent',
                    border: '1px solid var(--border)',
                    color: '#eef1f8',
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                >
                  Old Testament
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTestament('NT')}
                  style={{
                    background: activeTestament === 'NT' ? 'rgba(122,162,255,0.12)' : 'transparent',
                    border: '1px solid var(--border)',
                    color: '#eef1f8',
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                >
                  New Testament
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedBook && (
                  <select
                    value={selectedChapter}
                    onChange={(e) => handleChangeChapter(Number(e.target.value))}
                    style={{ background: '#0e1530', color: '#eef1f8', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px' }}
                  >
                    {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                      <option key={ch} value={ch}>Chapter {ch}</option>
                    ))}
                  </select>
                )}
                <button
                  type="button"
                  onClick={() => setIsBibleOpen(false)}
                  className="btn secondary"
                  style={{ padding: '8px 12px', borderRadius: 10 }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 260px', minWidth: 220 }}>
                <div className="muted" style={{ marginBottom: 6 }}>Books</div>
                <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 12 }}>
                  {books.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleSelectBook(b)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        background: selectedBook?.name === b.name ? 'rgba(122,162,255,0.12)' : 'transparent',
                        color: '#eef1f8',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer'
                      }}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: '3 1 420px', minWidth: 300 }}>
                <div className="muted" style={{ marginBottom: 6 }}>
                  {selectedBook ? `${selectedBook.name} ${selectedChapter}` : 'Select a book'}
                </div>
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  minHeight: 200,
                  maxHeight: 300,
                  overflowY: 'auto',
                  background: '#0e1530'
                }}>
                  {bibleLoading && <div className="muted">Loading passage…</div>}
                  {bibleError && <div style={{ color: '#ff6b6b' }}>{bibleError}</div>}
                  {!bibleLoading && !bibleError && bibleText && (
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.6 }}>{bibleText}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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
