type Variant = 'ward' | 'assembly' | 'lokSabha'

const COLORS: Record<Variant, { border: string; text: string }> = {
  ward:      { border: '#FF9933', text: '#FF9933' },
  assembly:  { border: '#000080', text: '#000080' },
  lokSabha:  { border: '#138808', text: '#138808' },
}

interface VoteWeightBadgeProps {
  label: string
  value: string
  variant: Variant
}

export function VoteWeightBadge({ label, value, variant }: VoteWeightBadgeProps) {
  const { border, text } = COLORS[variant]
  return (
    <div
      className="bg-white rounded-gt-md text-center"
      style={{ border: `1px solid ${border}`, padding: '4px 10px', minWidth: 80 }}
    >
      <p
        className="uppercase"
        style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: text }}
      >
        {label}
      </p>
      <p style={{ fontSize: 12, fontWeight: 700, color: text }}>{value}</p>
    </div>
  )
}
