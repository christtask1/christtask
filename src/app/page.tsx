export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'center', gap: 28 }}>
          <div>
            <span className="pill">“Always be prepared to give an answer” — 1 Peter 3:15</span>
            <h1 style={{ fontSize: 44, marginTop: 12 }}>Christian apologetics, made clear.</h1>
            <p className="muted" style={{ marginTop: 8, maxWidth: 560 }}>
              Evidence, history, and philosophy—presented simply. Explore curated
              arguments, quick references, and practical guides to answer common
              questions about the faith.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <a className="btn" href="/payment">Get access</a>
              <a className="btn secondary" href="#features">Learn more</a>
            </div>
          </div>
          <div className="card" style={{ padding: 28 }}>
            <h3>What you’ll learn</h3>
            <ul className="muted" style={{ marginTop: 8, lineHeight: 1.9 }}>
              <li>Historical case for the Resurrection</li>
              <li>Problem of evil—coherent responses</li>
              <li>Existence of God: cosmological, moral, fine‑tuning</li>
              <li>Reliability of Scripture and early witnesses</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="container grid grid-3">
          <div className="card">
            <h3>Concise</h3>
            <p className="muted">Clear, short explanations with sources—made for real conversations.</p>
          </div>
          <div className="card">
            <h3>Grounded</h3>
            <p className="muted">History, scripture, and analytic philosophy—balanced, informed, and careful.</p>
          </div>
          <div className="card">
            <h3>Practical</h3>
            <p className="muted">Organized by questions people actually ask, with step‑by‑step answers.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container card" style={{ textAlign: 'center', padding: 28 }}>
          <h2>Ready to dive in?</h2>
          <p className="muted" style={{ marginTop: 6 }}>Subscribe to access the full library and new weekly content.</p>
          <div style={{ marginTop: 14 }}>
            <a className="btn" href="/payment">Get access</a>
          </div>
        </div>
      </section>
    </>
  )
}


