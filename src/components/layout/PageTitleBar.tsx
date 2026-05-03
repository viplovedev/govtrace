'use client'
import { VoteWeightBadge } from '@/components/ui/VoteWeightBadge'
import { CURRENT_USER, computeVoteWeights } from '@/lib/data'
import { formatPct } from '@/lib/utils'

interface PageTitleBarProps {
  title: string
  subtitle?: string
}

const weights = computeVoteWeights(CURRENT_USER.totalTax)

export function PageTitleBar({ title, subtitle }: PageTitleBarProps) {
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
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 11, color: '#6b7280', margin: 0, marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <VoteWeightBadge label="Ward" value={formatPct(weights.ward, 3)} variant="ward" />
        <VoteWeightBadge label="Assembly" value={formatPct(weights.assembly, 4)} variant="assembly" />
        <VoteWeightBadge label="Lok Sabha" value={formatPct(weights.lokSabha, 5)} variant="lokSabha" />
      </div>
    </div>
  )
}
