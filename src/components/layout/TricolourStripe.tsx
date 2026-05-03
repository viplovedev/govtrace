export function TricolourStripe() {
  return (
    <div style={{ display: 'flex', height: 3, flexShrink: 0 }}>
      <div style={{ flex: 1, background: '#FF9933' }} />
      <div style={{ flex: 1, background: '#ffffff' }} />
      <div style={{ flex: 1, background: '#138808' }} />
    </div>
  )
}
