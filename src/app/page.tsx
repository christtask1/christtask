export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'center', gap: 28 }}>
          <div>
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
          </div>
          <div className="card">
          </div>
          <div className="card">
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container card" style={{ textAlign: 'center', padding: 28 }}>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <a className="btn" href="/payment">Get access</a>
            <a className="btn secondary" href="/login">Log in</a>
          </div>
        </div>
      </section>
    </>
  )
}


