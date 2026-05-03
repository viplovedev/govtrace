'use client'
import { useEffect } from 'react'
import { TopBar } from './TopBar'
import { NavBar } from './NavBar'
import { TricolourStripe } from './TricolourStripe'
import { Footer } from './Footer'
import { useStore } from '@/lib/store'
import { getNotifications } from '@/lib/queries'

export function AppShell({ children }: { children: React.ReactNode }) {
  const initNotifications = useStore((s) => s.initNotifications)

  useEffect(() => {
    getNotifications().then((notifs) => {
      if (notifs.length > 0) initNotifications(notifs)
    })
  }, [initNotifications])

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
