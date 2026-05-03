'use client'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { markNotificationReadDB, markAllNotificationsReadDB } from '@/lib/queries'
import { useRouter } from 'next/navigation'
import { timeAgo } from '@/lib/utils'

const TYPE_STYLE: Record<string, { icon: string; color: string }> = {
  bill:   { icon: '🗳️', color: '#000080' },
  status: { icon: '🚧', color: '#FF9933' },
  agenda: { icon: '📢', color: '#138808' },
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const { notifications, markNotificationRead, markAllRead } = useStore()
  const unread = notifications.filter((n) => !n.read).length
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  async function handleClickNotification(id: string, targetTab: string) {
    markNotificationRead(id)
    markNotificationReadDB(id)   // fire-and-forget DB write
    setOpen(false)
    router.push(targetTab)
  }

  async function handleMarkAllRead() {
    markAllRead()
    markAllNotificationsReadDB()  // fire-and-forget DB write
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 4 }}
        aria-label="Notifications"
      >
        <span style={{ fontSize: 20 }}>🔔</span>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            background: '#D32F2F', color: '#fff',
            borderRadius: 99, width: 16, height: 16,
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 8,
          width: 360, maxHeight: 380, overflowY: 'auto',
          background: '#fff', border: '0.5px solid #e0e4ec', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 1000,
        }}>
          <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #e0e4ec' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Notifications</span>
            <button onClick={handleMarkAllRead} style={{ fontSize: 11, color: '#000080', background: 'none', border: 'none', cursor: 'pointer' }}>
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p style={{ padding: 16, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>No notifications</p>
          ) : (
            notifications.map((n) => {
              const { icon, color } = TYPE_STYLE[n.type] ?? TYPE_STYLE.bill
              return (
                <div
                  key={n.id}
                  onClick={() => handleClickNotification(n.id, n.targetTab)}
                  style={{
                    display: 'flex', gap: 10, padding: '10px 14px', cursor: 'pointer',
                    background: n.read ? '#fff' : '#f0f4ff', borderBottom: '0.5px solid #e0e4ec', transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? '#fff' : '#f0f4ff')}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 2 }}>{n.title}</p>
                    <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>{n.description}</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{timeAgo(n.timestamp)}</p>
                  </div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#000080', flexShrink: 0, marginTop: 4 }} />}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
