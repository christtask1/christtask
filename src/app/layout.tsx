
export const metadata = { title: 'ChristTask', description: 'Christian apologetics, thoughtfully.' }

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg: #040406;
            --card: #101830;
            --muted: #a8b3cf;
            --text: #eef1f8;
            --brand: #7aa2ff;
            --brand-strong: #4e7bff;
            --border: #1c2544;
            /* typographic utilities */
            --tracking-tight: -0.01em;
            --font-weight-medium: 500;
            --leading-snug: 1.35;
          }
          * { box-sizing: border-box; }
          html, body { height: 100%; }
          body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: var(--bg); color: var(--text); }
          .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
          .site-header { position: sticky; top: 0; backdrop-filter: saturate(140%) blur(8px); background: #040406; z-index: 50; }
          .header-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
          .brand {
            font-weight: 600;
            letter-spacing: 0.3px;
            color: var(--text);
            font-size: 22px;
            font-family: Inter, "Inter Fallback", ui-sans-serif, system-ui, sans-serif;
            line-height: 28px;
            cursor: pointer;
            -webkit-font-smoothing: antialiased;
            padding: 6px 10px;
            border-radius: 6px;
            transition: all 0.2s ease;
            margin-left: -75px;
            text-decoration: none;
          }
          .brand:hover { background: rgba(122,162,255,0.08); transform: translateY(-1px); }
          .nav { display: flex; gap: 14px; align-items: center; }
          .nav-link { color: var(--muted); text-decoration: none; padding: 8px 10px; border-radius: 6px; }
          .nav-link:hover { color: var(--text); background: rgba(122,162,255,0.08); }
          .nav-cta { text-decoration: none; background: linear-gradient(180deg, var(--brand), var(--brand-strong)); color: white; padding: 8px 14px; border-radius: 8px; font-weight: 600; }
          main { min-height: calc(100vh - 64px - 64px); }
          .site-footer { border-top: 1px solid var(--border); background: #0b1020; }
          .footer-inner { height: 64px; display: flex; align-items: center; justify-content: space-between; color: var(--muted); }
          .link { color: var(--brand); text-decoration: none; }
          .link:hover { text-decoration: underline; }
          .btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(180deg, var(--brand), var(--brand-strong)); color: #fff; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 700; box-shadow: 0 10px 30px rgba(78,123,255,0.25); }
          .btn.secondary { background: transparent; border: 1px solid var(--border); color: var(--text); box-shadow: none; }
          .pill { display:inline-block; background: rgba(122,162,255,0.12); border:1px solid var(--border); padding:6px 10px; border-radius:999px; color: var(--brand); font-weight:700; letter-spacing:0.3px; }
          .section { padding: 72px 0; }
          .grid { display:grid; gap:20px; }
          @media(min-width: 900px){ .grid-2 { grid-template-columns: 1.2fr 1fr; } .grid-3 { grid-template-columns: repeat(3,1fr); } }
          .card { background: linear-gradient(180deg, rgba(23,35,74,0.55), rgba(16,24,48,0.8)); border:1px solid var(--border); border-radius:16px; padding:22px; }
          .muted { color: var(--muted); }
          h1, h2, h3 { margin: 0 0 10px; line-height: 1.15; }
          @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
          @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-10px); } }
        `}</style>
      </head>
            <body>
        <header className="site-header">
          <div className="container header-inner">
            <a href="/" className="brand">ChristTask</a>
            <nav className="nav">
              <a href="/login" className="nav-link">Login</a>
              <a href="/" className="nav-link">Home</a>
              <a href="/payment" className="nav-cta">Get Access</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <span>© {new Date().getFullYear()} ChristTask</span>
            <a href="/payment" className="link">Subscribe</a>
          </div>
        </footer>

        <style>{`
          /* Hide header and footer on chat page only */
          body:has([data-page="chat"]) .site-header,
          body:has([data-page="chat"]) .site-footer {
            display: none !important;
          }
        `}</style>
      </body>
    </html>
  )
}


