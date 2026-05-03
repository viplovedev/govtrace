import { IndianFlag } from '@/components/ui/IndianFlag'

export function Footer() {
  return (
    <footer
      style={{
        background: '#ffffff',
        borderTop: '0.5px solid #e0e4ec',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IndianFlag />
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          GovTrace v1.0 — Tax-weighted democracy for Indian citizens
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {['TRACES', 'UIDAI', 'GSTN', 'CAG', 'RTI Act 2005'].map((src) => (
          <span key={src} style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>
            {src}
          </span>
        ))}
      </div>
    </footer>
  )
}
