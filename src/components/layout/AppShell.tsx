'use client'
import { TopBar } from './TopBar'
import { NavBar } from './NavBar'
import { TricolourStripe } from './TricolourStripe'
import { Footer } from './Footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <NavBar />
      <TricolourStripe />
      <main style={{ flex: 1, background: '#f5f7fa' }}>{children}</main>
      <Footer />
    </div>
  )
}
