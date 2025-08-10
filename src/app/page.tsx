export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'center', gap: 28 }}>
          <div>
            <div style={{ 
              minHeight: '200px', 
              border: '2px dashed var(--border)', 
              borderRadius: '12px', 
              padding: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--muted)',
              fontSize: '16px'
            }}>
              Your text content goes here
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <a className="btn" href="/payment">Get access</a>
              <a className="btn secondary" href="/login">Log in</a>
            </div>
          </div>
          <div className="card" style={{ padding: 28 }}>
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
        <div className="container" style={{ textAlign: 'left', padding: 28 }}>
          <h2>Ready to dive in?</h2>
          <p className="muted" style={{ marginTop: 6 }}>Subscribe to access the full library and new weekly content.</p>
          <div style={{ marginTop: 14, display: 'flex', gap: 12 }}>
            <a className="btn" href="/payment">Get access</a>
            <a className="btn secondary" href="/login">Log in</a>
          </div>
        </div>
      </section>
    </>
  )
}


