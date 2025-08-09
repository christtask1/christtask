'use client'

export default function SuccessPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <h2>Payment successful</h2>
        <p className="muted" style={{ marginTop: 10 }}>
          Thank you! Your payment was processed. You now have access to your subscription.
        </p>
        <div style={{ marginTop: 20 }}>
          <a className="btn" href="/">Go to home</a>
        </div>
      </div>
    </section>
  )
}


