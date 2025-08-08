import React from 'react'

export const metadata = { title: 'ChristTask', description: 'Simple site' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, Arial, sans-serif' }}>
        <header style={{ position: 'sticky', top: 0, padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontWeight: 700 }}>ChristTask</div>
        </header>
        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  )
}


