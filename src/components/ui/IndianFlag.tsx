export function IndianFlag({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex flex-col border border-border overflow-hidden ${className}`}
      style={{ width: 20, height: 13, flexShrink: 0 }}
      aria-label="Indian Flag"
    >
      <div style={{ flex: 1, background: '#FF9933' }} />
      <div style={{ flex: 1, background: '#ffffff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#000080' }} />
      </div>
      <div style={{ flex: 1, background: '#138808' }} />
    </div>
  )
}
