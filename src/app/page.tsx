export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>This is a fresh site. Header at top-left shows "ChristTask".</p>
      <a href="/payment" style={{
        display: 'inline-block',
        marginTop: 16,
        padding: '10px 16px',
        background: '#2563eb',
        color: '#fff',
        borderRadius: 6,
        textDecoration: 'none'
      }}>Go to payment</a>
    </div>
  )
}


