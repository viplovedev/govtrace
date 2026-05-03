interface StatCardProps {
  label: string
  value: string
  subtext?: string
  accentColor: string
  children?: React.ReactNode
}

export function StatCard({ label, value, subtext, accentColor, children }: StatCardProps) {
  return (
    <div className="gt-card">
      <div style={{ height: 3, background: accentColor }} />
      <div className="p-[12px_14px]">
        <p
          className="uppercase tracking-widest text-muted mb-1"
          style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em' }}
        >
          {label}
        </p>
        <p className="text-text-dark" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
          {value}
        </p>
        {subtext && (
          <p className="text-dim mt-1" style={{ fontSize: 11 }}>
            {subtext}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
