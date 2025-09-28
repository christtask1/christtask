

import AuthProvider from '../components/AuthProvider'

export const metadata = { 
  title: 'ChristTask', 
  description: 'Christian apologetics, thoughtfully.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  }
}

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Anton:wght@400&display=swap" rel="stylesheet" />
        <script
          async
          defer
          src="https://js.whop.com/static/checkout/loader.js"
        ></script>
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
          .site-footer { border-top: 1px solid var(--border); background: #080808; }
          .footer-inner { height: 100px; display: flex; align-items: center; justify-content: space-between; color: var(--muted); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .footer-left { display: flex; align-items: center; }
          .footer-right { display: flex; align-items: center; gap: 20px; }
          .footer-info { display: flex; flex-direction: column; align-items: flex-end; }
          .footer-title { margin: 0 0 6px; font-size: 14px; font-weight: 500; color: var(--text); letter-spacing: 0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .footer-links { display: flex; flex-direction: column; gap: 4px; }
          .footer-links .link { font-size: 13px; color: var(--muted); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 400; }
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
          
          /* Mobile Header Responsive Styles */
          @media (max-width: 768px) {
            .header-inner { 
              height: 48px; 
            }
            .brand {
              font-size: 18px;
              line-height: 22px;
              padding: 4px 8px;
              margin-left: 0.5cm;
            }
            .nav {
              gap: 8px;
            }
            .nav-link {
              padding: 6px 8px;
              font-size: 14px;
            }
            .nav-cta {
              padding: 6px 10px;
              font-size: 14px;
            }
          }
          
          @media (max-width: 480px) {
            .header-inner { 
              height: 44px; 
            }
            .brand {
              font-size: 16px;
              line-height: 20px;
              padding: 3px 6px;
              margin-left: 0.5cm;
            }
            .nav {
              gap: 6px;
            }
            .nav-link {
              padding: 5px 6px;
              font-size: 13px;
            }
            .nav-cta {
              padding: 5px 8px;
              font-size: 13px;
            }
          }
        `}</style>
      </head>
            <body>
        <AuthProvider>
          <header className="site-header">
            <div className="container header-inner">
              <a href="/" className="brand">ChristTask</a>
              <nav className="nav">
                <a href="/login" className="nav-link">Login</a>
                <a href="/payment" className="nav-cta">Get Access</a>
              </nav>
            </div>
          </header>
          <main>{children}</main>

          <footer className="site-footer">
            <div className="container footer-inner">
              <div className="footer-left">
              <span>© {new Date().getFullYear()} ChristTask</span>
              </div>
              <div className="footer-right">
                <div className="footer-info">
                  <h4 className="footer-title">Information</h4>
                  <div className="footer-links">
                    <a href="/privacy" className="link">Privacy Policy</a>
                    <a href="/terms" className="link">Terms</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>



        <style>{`
          /* Hide header and footer on chat page only */
          body:has([data-page="chat"]) .site-header,
          body:has([data-page="chat"]) .site-footer {
            display: none !important;
          }
          
          /* Hide header and footer on payment page */
          body:has([data-page="payment"]) .site-header,
          body:has([data-page="payment"]) .site-footer {
            display: none !important;
          }
          
          /* Hide header and footer on newsletter page */
          body:has([data-page="newsletter"]) .site-header,
          body:has([data-page="newsletter"]) .site-footer {
            display: none !important;
          }
          
          /* Newsletter page specific styles */
          body:has([data-page="newsletter"]) {
            background: #000000 !important;
          }
          
          body:has([data-page="newsletter"]) input[type="email"] {
            background: transparent !important;
            color: #ffffff !important;
            border: 1px solid #ffffff !important; /* thin white line */
            border-radius: 0.75rem !important;
            padding: 1rem !important;
            font-size: 1.1rem !important;
            backdrop-filter: blur(4px) !important;
            width: 60% !important;
            margin: 0 auto !important;
            display: block !important;
            text-align: left !important; /* left align text */
            caret-color: #ffffff !important; /* left-start caret, white */
          }

          /* Desktop-specific form sizing */
          @media (min-width: 769px) {
            body:has([data-page="newsletter"]) input[type="email"] {
              width: 40% !important;
              padding-top: 1.25rem !important;  /* taller top */
              padding-bottom: 1.25rem !important; /* taller bottom */
              border-radius: 0.5rem !important; /* more square */
            }
            
            body:has([data-page="newsletter"]) button[type="submit"] {
              width: 40% !important;
              max-width: 40% !important;
            }
          }
          
          body:has([data-page="newsletter"]) input[type="email"]:focus {
            outline: none !important;
            border-color: #ffffff !important;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2) !important;
          }
          
          body:has([data-page="newsletter"]) input[type="email"]::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          
          body:has([data-page="newsletter"]) button[type="submit"] {
            background: #dc2626 !important;
            color: white !important;
            border: 2px solid #dc2626 !important;
            border-radius: 1rem !important;
            padding: 1rem !important;
            font-size: 1.1rem !important;
            width: 60% !important;
            margin: 2rem auto 0 auto !important;
            display: block !important;
            font-weight: bold !important;
          }
          
          body:has([data-page="newsletter"]) button[type="submit"]:hover {
            background: #b91c1c !important;
            border-color: #b91c1c !important;
          }
          
          body:has([data-page="newsletter"]) button[type="submit"]:disabled {
            background: #991b1b !important;
            border-color: #991b1b !important;
          }
          
          
          body:has([data-page="newsletter"]) .newsletter-headline {
            font-family: 'Anton', sans-serif !important;
            font-size: 72px !important;
            font-weight: 400 !important;
            text-transform: uppercase !important;
            letter-spacing: -2px !important;
            line-height: 0.9 !important;
            margin-bottom: 40px !important;
            color: #F5F5F5 !important;
            text-align: center !important;
            margin-left: 0 !important;
            text-shadow: none !important;
          }

          /* Desktop-specific line positioning */
          @media (min-width: 769px) {
            body:has([data-page="newsletter"]) .desktop-text {
              position: relative !important;
              left: -1cm !important;
            }
            body:has([data-page="newsletter"]) .desktop-text > br:first-child + * {
              margin-left: 2cm !important;
            }
            body:has([data-page="newsletter"]) .desktop-middle-line {
              margin-left: 2.5cm !important;
            }
            
            body:has([data-page="newsletter"]) .desktop-bottom-line {
              margin-left: -3.5cm !important;
            }
          }
          
      body:has([data-page="newsletter"]) .newsletter-content {
        padding-top: 0 !important;
      }

      body:has([data-page="newsletter"]) .christtask-brand {
        font-family: 'Inter', sans-serif !important;
        font-size: 24px !important;
        font-weight: 400 !important;
        text-transform: none !important;
        letter-spacing: normal !important;
        color: #F5F5F5 !important;
        margin-bottom: 5cm !important;
        text-align: center !important;
        margin-left: 0 !important;
      }

      /* Subcopy staircase styling */
      body:has([data-page="newsletter"]) .newsletter-subcopy {
        max-width: 48rem !important;
        margin: 0 auto 3rem auto !important;
        color: #d1d5db !important; /* gray-300 */
        line-height: 1.75 !important;
        font-size: 1.125rem !important; /* text-lg */
        text-align: center !important;
      }

      @media (min-width: 769px) {
        body:has([data-page="newsletter"]) .newsletter-subcopy {
          text-align: left !important;
          position: relative !important;
          left: 3cm !important; /* shift whole block right */
        }
        body:has([data-page="newsletter"]) .newsletter-subcopy .sub-line-1 { margin-left: 0 !important; }
        body:has([data-page="newsletter"]) .newsletter-subcopy .sub-line-2 { margin-left: 0.6cm !important; }
        body:has([data-page="newsletter"]) .newsletter-subcopy .sub-line-3 { margin-left: 1.2cm !important; }
        body:has([data-page="newsletter"]) .newsletter-subcopy .sub-line-4 { margin-left: 1.8cm !important; }
      }

      @media (max-width: 768px) {
        body:has([data-page="newsletter"]) .newsletter-subcopy { text-align: center !important; }
        body:has([data-page="newsletter"]) .newsletter-subcopy .sub-line { margin-left: 0 !important; }
      }
          
          /* Show desktop text by default, hide mobile text */
          body:has([data-page="newsletter"]) .desktop-text {
            display: block !important;
          }
          
          body:has([data-page="newsletter"]) .mobile-text {
            display: none !important;
          }
          
          
          @media (max-width: 768px) {
        body:has([data-page="newsletter"]) .newsletter-headline {
          font-size: 44px !important;
          margin-bottom: 30px !important;
          letter-spacing: -1px !important;
          text-align: center !important;
          margin-left: 0 !important;
        }
            
            /* Show mobile text, hide desktop text on mobile */
            body:has([data-page="newsletter"]) .desktop-text {
              display: none !important;
            }
            
            body:has([data-page="newsletter"]) .mobile-text {
              display: block !important;
            }
            
        /* Center all mobile lines */
        body:has([data-page="newsletter"]) .mobile-bottom-line {
          margin-left: 0 !important;
        }

        body:has([data-page="newsletter"]) .mobile-middle-line {
          margin-left: 0 !important;
        }
            
        body:has([data-page="newsletter"]) .christtask-brand {
          font-size: 20px !important;
          margin-left: 0 !important;
          margin-bottom: 1.5rem !important;
          text-align: center !important;
        }

        body:has([data-page="newsletter"]) .newsletter-content {
          padding-top: 4rem !important;
        }
          }
          
          @media (max-width: 480px) {
        body:has([data-page="newsletter"]) .newsletter-headline {
          font-size: 34px !important;
          text-align: center !important;
          margin-left: 0 !important;
        }
            
            body:has([data-page="newsletter"]) .newsletter-content {
              padding-top: 3rem !important;
            }
          }
        `}</style>
      </body>
    </html>
  )
}


