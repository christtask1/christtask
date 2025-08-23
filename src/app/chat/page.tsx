'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// Component for typing animation effect like demo box
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 20 + delay) // 20ms per character + initial delay
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, delay])

  return (
    <div style={{
      animation: 'blurReveal 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
      animationDelay: `${delay}ms`,
      willChange: 'filter, opacity'
    }}>
      {displayedText}
      {currentIndex < text.length && (
        <span style={{ 
          animation: 'blink 1s infinite',
          marginLeft: '1px'
        }}>|</span>
      )}
    </div>
  )
}

// GPT-5 style loading animation with white glow sweep
function LoadingAnimation() {
  return (
    <div className="loading-animation">
      <div className="loading-message">
        <span className="loading-message-base">Analyzing your text...</span>
        <span 
          className="loading-message-glow"
          aria-hidden="true"
        >
          Analyzing your text...
        </span>
      </div>
    </div>
  )
}

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

// Specific list for Gospels
const GOSPELS = ['Matthew', 'Mark', 'Luke', 'John']

export default function ChatPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Welcome to ChristTask chat. How can I help you today?' },
  ])
  const [input, setInput] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  // Sidebar + Bible panel state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isBibleOpen, setIsBibleOpen] = useState<boolean>(false)
  const [isBibleFullscreen, setIsBibleFullscreen] = useState<boolean>(false)
  const [isBookPickerOpen, setIsBookPickerOpen] = useState<boolean>(false)
  const [isForumOpen, setIsForumOpen] = useState<boolean>(false)
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
    setIsTyping(true)

    try {
      // Get auth token for backend
      const { data: { session } } = await supabase.auth.getSession()
      
      // Call your RAG backend through the API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          message: text
        })
      })

      if (!response.ok) {
        // Handle specific error cases with clear messages
        try {
          const errorData = await response.json()
          
          if (errorData.code === 'SUBSCRIPTION_REQUIRED') {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: 'You need an active subscription to use the chatbot. Please visit the payment page to subscribe and unlock access.' }
            ])
            return
          }
          
          if (errorData.code === 'LOGIN_REQUIRED') {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: 'Please log in to use the chatbot. Click the login button in the top right corner.' }
            ])
            return
          }
          
          // Show the specific error message if available
          const errorMessage = errorData.error || 'Failed to get response from chatbot'
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: `Error: ${errorMessage}` }
          ])
          return
          
        } catch (parseError) {
          // If we can't parse the error response, fall through to generic error
          console.error('Could not parse error response:', parseError)
        }
        
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
      setIsTyping(false)
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
    setIsBookPickerOpen(false)
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
    setIsForumOpen(false)
    setTimeout(() => {
      biblePanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }
  const goToForum = () => {
    setIsForumOpen(true)
    setIsBibleOpen(false)
    setIsSidebarOpen(false)
    setTimeout(() => {
      chatTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }
  const goToChat = () => {
    setIsBibleOpen(false)
    setIsSidebarOpen(false)
    setIsForumOpen(false)
    setTimeout(() => {
      chatTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div data-page="chat" style={{
      height: '100vh',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div
        aria-hidden
        onMouseEnter={openSidebar}
        style={{ 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          bottom: 0, 
          width: 12, 
          zIndex: 250, 
          background: 'transparent',
          display: 'none' // Hidden by default
        }}
        className="desktop-sidebar-trigger"
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
        className="desktop-sidebar"
      >
        <div style={{ fontWeight: 800, letterSpacing: '0.2px' }}>ChristTask</div>
        <nav style={{ display: 'grid', gap: 8 }}>
          {[
            { key: 'bible', label: 'Bible', onClick: goToBible },
            { key: 'forum', label: 'Forum', onClick: goToForum },
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
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {userEmail && (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                textAlign: 'left',
                background: 'transparent',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                padding: '8px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 160ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 107, 107, 0.12)'
                e.currentTarget.style.borderColor = '#ff6b6b'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.3)'
              }}
            >
              Sign Out
            </button>
          )}
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>
          Signed in: {userEmail || 'Anonymous'}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(180deg, rgba(23,35,74,0.95), rgba(16,24,48,0.98))',
        borderTop: '1px solid var(--border)',
        padding: '6px 12px',
        display: 'none', // Hidden by default
        zIndex: 400,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button
            type="button"
            onClick={goToBible}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              background: 'transparent',
              border: 'none',
              color: isBibleOpen ? '#7aa2ff' : '#a8b3cf',
              padding: '4px 8px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: 16 }}>📖</div>
            <div style={{ fontSize: 10, fontWeight: 500 }}>Bible</div>
          </button>
          
          <button
            type="button"
            onClick={goToForum}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              background: 'transparent',
              border: 'none',
              color: isForumOpen ? '#7aa2ff' : '#a8b3cf',
              padding: '4px 8px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: 16 }}>💬</div>
            <div style={{ fontSize: 10, fontWeight: 500 }}>Forum</div>
          </button>
          
          <button
            type="button"
            onClick={goToChat}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              background: 'transparent',
              border: 'none',
              color: !isBibleOpen && !isForumOpen ? '#7aa2ff' : '#a8b3cf',
              padding: '4px 8px',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: 16 }}>🤖</div>
            <div style={{ fontSize: 10, fontWeight: 500 }}>AI Chat</div>
          </button>
        </div>
      </nav>

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
          <div
            ref={biblePanelRef}
                  style={{
              position: isBibleFullscreen ? 'fixed' : 'relative',
              inset: isBibleFullscreen ? 0 : 'auto',
              zIndex: isBibleFullscreen ? 450 : 'auto',
              background: isBibleFullscreen ? 'rgba(7,11,31,0.98)' : 'transparent',
              borderRadius: isBibleFullscreen ? 0 : undefined,
              display: 'flex',
              flexDirection: 'column',
              flex: isBibleFullscreen ? 'none' : 1
            }}
          >
            <div className="card" style={{ padding: 16, marginBottom: 0, display: 'flex', flexDirection: 'column', gap: 12, height: isBibleFullscreen ? '100%' : '100%', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                    onClick={() => setIsBookPickerOpen(true)}
                  style={{
                      background: 'rgba(122,162,255,0.12)',
                    border: '1px solid var(--border)',
                    color: '#eef1f8',
                    padding: '8px 12px',
                    borderRadius: 10,
                    cursor: 'pointer'
                  }}
                >
                    Books
                </button>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {selectedBook ? `${selectedBook.name} • Chapters: ${selectedBook.chapters}` : 'Choose a book'}
                  </div>
              </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                    onClick={() => setIsBibleFullscreen((v) => !v)}
                    className="btn secondary"
                    style={{ padding: '8px 12px', borderRadius: 10 }}
                  >
                    {isBibleFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsBibleOpen(false); setIsBibleFullscreen(false) }}
                  className="btn secondary"
                  style={{ padding: '8px 12px', borderRadius: 10 }}
                >
                  Close
                </button>
              </div>
            </div>

              <div style={{ flex: 1, minHeight: 200, display: 'flex' }}>
                <div style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  width: '100%',
                  height: '100%',
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

            {/* Slide-up Book Picker */}
            <div
              aria-hidden={!isBookPickerOpen}
              onClick={() => setIsBookPickerOpen(false)}
              style={{
                position: 'fixed', left: 0, right: 0, top: 0, bottom: 0,
                background: isBookPickerOpen ? 'rgba(0,0,0,0.45)' : 'transparent',
                transition: 'background 180ms ease',
                pointerEvents: isBookPickerOpen ? 'auto' : 'none',
                zIndex: 500
              }}
            >
              <div
                role="dialog"
                aria-label="Choose book"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  transform: isBookPickerOpen ? 'translateY(0)' : 'translateY(100%)',
                  transition: 'transform 220ms ease',
                  background: '#0e1530',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: '70%',
                  overflowY: 'auto',
                  borderTop: '1px solid var(--border)',
                  boxShadow: '0 -18px 40px rgba(0,0,0,0.45)'
                }}
              >
                <div style={{ padding: 14, display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700 }}>Select Book</div>
                    <button type="button" className="btn secondary" onClick={() => setIsBookPickerOpen(false)} style={{ padding: '6px 10px', borderRadius: 10 }}>Close</button>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div className="muted" style={{ marginTop: 4 }}>Gospels</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                      {GOSPELS.map((name) => {
                        const book = NEW_TESTAMENT.find((b) => b.name === name)!
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => handleSelectBook(book)}
                            style={{
                              textAlign: 'left',
                              background: selectedBook?.name === name ? 'rgba(122,162,255,0.12)' : 'transparent',
                              color: '#eef1f8',
                              border: '1px solid var(--border)',
                              padding: '10px 12px',
                              borderRadius: 10,
                              cursor: 'pointer'
                            }}
                          >
                            {name}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 8 }}>
                    <div className="muted" style={{ marginTop: 10 }}>Old Testament</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                      {OLD_TESTAMENT.map((b) => (
                        <button
                          key={b.name}
                          type="button"
                          onClick={() => handleSelectBook(b)}
                          style={{
                            textAlign: 'left',
                            background: selectedBook?.name === b.name ? 'rgba(122,162,255,0.12)' : 'transparent',
                            color: '#eef1f8',
                            border: '1px solid var(--border)',
                            padding: '10px 12px',
                            borderRadius: 10,
                            cursor: 'pointer'
                          }}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 8 }}>
                    <div className="muted" style={{ marginTop: 10 }}>New Testament</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                      {NEW_TESTAMENT.filter((b) => !GOSPELS.includes(b.name)).map((b) => (
                        <button
                          key={b.name}
                          type="button"
                          onClick={() => handleSelectBook(b)}
                          style={{
                            textAlign: 'left',
                            background: selectedBook?.name === b.name ? 'rgba(122,162,255,0.12)' : 'transparent',
                            color: '#eef1f8',
                            border: '1px solid var(--border)',
                            padding: '10px 12px',
                            borderRadius: 10,
                            cursor: 'pointer'
                          }}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isForumOpen && (
          <div className="card" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚧</div>
              <h2 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                margin: '0 0 16px 0',
                background: 'linear-gradient(135deg, #7aa2ff, #bb86fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Forum Coming Soon
              </h2>
              <p style={{ 
                fontSize: '18px', 
                color: '#a8b3cf', 
                margin: '0 0 32px 0',
                maxWidth: '500px',
                lineHeight: '1.6'
              }}>
                We're building an amazing community forum where you can discuss apologetics, 
                share insights, and connect with fellow believers. Stay tuned for updates!
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                flexWrap: 'wrap', 
                justifyContent: 'center' 
              }}>
                <div style={{
                  background: 'rgba(122, 162, 255, 0.1)',
                  border: '1px solid rgba(122, 162, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Community Discussions</div>
                  <div style={{ fontSize: '14px', color: '#a8b3cf' }}>Share insights & ask questions</div>
                </div>
                <div style={{
                  background: 'rgba(187, 134, 252, 0.1)',
                  border: '1px solid rgba(187, 134, 252, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤝</div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Study Groups</div>
                  <div style={{ fontSize: '14px', color: '#a8b3cf' }}>Form small groups & learn together</div>
                </div>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Resource Sharing</div>
                  <div style={{ fontSize: '14px', color: '#a8b3cf' }}>Share books, articles & videos</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isBibleOpen && !isForumOpen && (
        <div className="card" style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="claude-chat" style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
            <div className="stream">
              {messages.map((m, idx) => (
                <div key={idx} className={`bubble ${m.role}`}>
                  <div className="bubble-inner">
                      <div className="bubble-text">
                        {m.role === 'assistant' ? (
                          <TypingText text={m.content} delay={0} />
                        ) : (
                          m.content
                        )}
                      </div>
                      {m.role === 'assistant' && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.content).then(() => {
                              // Optional: Add visual feedback here
                            }).catch(err => {
                              console.error('Failed to copy text: ', err);
                            });
                          }}
                          className="copy-button"
                          title="Copy response"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="bubble assistant">
                  <div className="bubble-inner">
                    <LoadingAnimation />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input rail */}
          <div className="input-rail">
              <form onSubmit={onSend} style={{ display: 'flex', gap: 10, width: '100%' }}>
                <input
                  className="input fancy"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn" type="submit" disabled={sending || !input.trim()}>
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* extra spacing for small screens */}
        <div style={{ height: 8 }} />
      </div>
      <style>{`
        .claude-chat .stream { display: grid; gap: 12px; }
        .bubble { display: flex; }
        .bubble.assistant { justify-content: flex-start; }
        .bubble.user { justify-content: flex-end; }
        .bubble-inner { max-width: min(780px, 85%); border: 1px solid var(--border); border-radius: 16px; padding: 12px 14px; position: relative; }
        .bubble.assistant .bubble-inner { background: #0e1530; }
        .bubble.user .bubble-inner { background: rgba(78,123,255,0.12); }
        .bubble-text { font-size: 14px; white-space: pre-wrap; line-height: 1.6; }
        @keyframes blurReveal { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .copy-button { 
          position: absolute; 
          bottom: 6px; 
          right: 6px; 
          background: rgba(255, 255, 255, 0.1); 
          border: 1px solid rgba(255, 255, 255, 0.2); 
          border-radius: 4px; 
          padding: 4px; 
          color: #a8b3cf; 
          cursor: pointer; 
          transition: all 0.2s ease; 
          opacity: 0.7;
        }
        .copy-button:hover { 
          background: rgba(255, 255, 255, 0.15); 
          color: #ffffff; 
          opacity: 1; 
          transform: translateY(-1px);
        }
        .typing { display:flex; gap:6px; align-items:center; }
        .dot { width:6px; height:6px; border-radius:50%; background: var(--brand); animation: typing 1.4s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: .2s }
        .dot:nth-child(3) { animation-delay: .4s }
        
        /* GPT-5 Style Loading Animation */
        .loading-animation {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-height: 24px;
        }
        
        .loading-message {
          position: relative;
          font-size: 14px;
          color: #eef1f8;
          font-weight: 500;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }

        .loading-message-base { color: #6b7280; }

        .loading-message-glow {
          position: absolute;
          inset: 0;
          color: transparent;
          background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 48%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.4) 52%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          background-position: 0% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .input-rail { position: sticky; bottom: 0; background: linear-gradient(180deg, rgba(4,4,6,0), rgba(4,4,6,0.8) 40%); padding: 12px 12px 0 12px; border-top: 1px solid var(--border); }
        .input.fancy { flex: 1; border-radius: 999px; border: 1px solid var(--border); background: #0e1530; color: #eef1f8; padding: 12px 16px; outline: none; font-size: 16px; }
        @media(min-width: 900px){ .input.fancy { padding: 14px 18px; } }
        .stripe-card-element .StripeElement--complete {
          border-color: #22c55e;
        }
        
        /* Desktop Sidebar - Show on larger screens */
        @media (min-width: 768px) {
          .desktop-sidebar-trigger {
            display: block !important;
          }
          
          .desktop-sidebar {
            display: flex !important;
          }
          
          .mobile-bottom-nav {
            display: none !important;
          }
        }
        
        /* Mobile Bottom Navigation - Show on mobile */
        @media (max-width: 767px) {
          .desktop-sidebar-trigger {
            display: none !important;
          }
          
          .desktop-sidebar {
            display: none !important;
          }
          
          .mobile-bottom-nav {
            display: block !important;
          }
          
          /* Add bottom padding to main content to account for bottom nav */
          .section {
            padding-bottom: 120px;
          }
          
          /* Ensure chatbot input is visible above bottom navigation */
          .input-rail {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  )
}
