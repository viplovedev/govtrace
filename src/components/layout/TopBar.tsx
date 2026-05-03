'use client'
import { useStore } from '@/lib/store'
import { LANGUAGE_NAMES, type LangCode } from '@/lib/i18n'
import { IndianFlag } from '@/components/ui/IndianFlag'
import { NotificationDropdown } from '@/components/ui/NotificationDropdown'
import { CURRENT_USER } from '@/lib/data'

export function TopBar() {
  const { language, setLanguage } = useStore()

  return (
    <div
      style={{
        background: '#ffffff',
        borderBottom: '0.5px solid #e0e4ec',
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IndianFlag />
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#000080', lineHeight: 1, margin: 0 }}>
            GovTrace
          </p>
          <p
            style={{
              fontSize: 9, color: '#9ca3af', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginTop: 1, margin: 0,
            }}
          >
            Citizen Tax Transparency Portal
          </p>
        </div>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LangCode)}
          style={{
            fontSize: 12, fontWeight: 600,
            padding: '5px 10px',
            border: '1px solid #e0e4ec',
            borderRadius: 6,
            background: '#ffffff',
            color: '#000080',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {(Object.entries(LANGUAGE_NAMES) as [LangCode, string][]).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>

        <NotificationDropdown />

        {/* User info */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: '#1a1a2e' }}>
            {CURRENT_USER.name}
          </p>
          <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>
            {CURRENT_USER.maskedPanId} · {CURRENT_USER.occupationType}
          </p>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#FF9933', color: '#ffffff',
            fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {CURRENT_USER.avatarInitials}
        </div>
      </div>
    </div>
  )
}
