'use client'
import { useEffect, useState } from 'react'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { getRepresentatives, getBills } from '@/lib/queries'
import { formatCrore, formatDate } from '@/lib/utils'
import type { Representative, Bill } from '@/lib/types'

const PARTY_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  BJP: { bg: '#fff3e0', color: '#FF9933', border: '#FF9933' },
  INC: { bg: '#e8f5e9', color: '#138808', border: '#138808' },
}
const LEVEL_LABELS: Record<string, string> = {
  ward: 'BBMP Corporator', assembly: 'MLA', ls: 'MP (Lok Sabha)', rs: 'MP (Rajya Sabha)',
}
const LEVEL_COLOR: Record<string, string> = {
  ward: '#FF9933', assembly: '#000080', ls: '#138808', rs: '#9ca3af',
}
const VOTE_TAG_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  aye:     { bg: '#e8f5e9', color: '#138808', border: '#138808' },
  nay:     { bg: '#ffebee', color: '#D32F2F', border: '#D32F2F' },
  abstain: { bg: '#fff3e0', color: '#c45800', border: '#FF9933' },
}

export default function RepresentativesPage() {
  const [reps, setReps]       = useState<Representative[]>([])
  const [bills, setBills]     = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getRepresentatives(), getBills()]).then(([r, b]) => {
      setReps(r); setBills(b); setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div>
        <PageTitleBar title="Representatives" subtitle="Loading…" />
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24, textAlign: 'center', color: '#6b7280' }}>
          Fetching representatives…
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageTitleBar title="Representatives" subtitle="Your elected representatives across all 4 levels" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {reps.map((rep) => {
            const repBills  = bills.filter((b) => b.repId === rep.id)
            const ayeCount  = repBills.filter((b) => b.repVote === 'aye').length
            const nayCount  = repBills.filter((b) => b.repVote === 'nay').length
            const ps        = PARTY_STYLE[rep.party] ?? { bg: '#f5f7fa', color: '#6b7280', border: '#e0e4ec' }
            const levelColor = LEVEL_COLOR[rep.level] ?? '#6b7280'

            return (
              <div key={rep.id} className="gt-card overflow-hidden">
                <div style={{ height: 3, background: levelColor }} />
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: levelColor + '22', color: levelColor,
                      fontWeight: 700, fontSize: 16, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {rep.photoInitials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{rep.name}</p>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 3, background: ps.bg, color: ps.color, border: `0.5px solid ${ps.border}` }}>
                          {rep.party}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: levelColor, fontWeight: 600 }}>{LEVEL_LABELS[rep.level]}</p>
                      <p style={{ fontSize: 11, color: '#6b7280' }}>{rep.constituency} · {rep.constituencyBody}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 12,
                    borderLeft: `3px solid ${levelColor}`, paddingLeft: 10, background: '#f8f9ff', borderRadius: '0 4px 4px 0', padding: '8px 10px' }}>
                    {rep.bio}
                  </p>

                  <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {[
                      { label: 'Elected',                value: formatDate(rep.elected) },
                      { label: 'Term',                   value: rep.term },
                      { label: 'Constituency Tax Pool',  value: formatCrore(rep.constituencyTaxPool) },
                      { label: 'House Vote Weight',      value: `${rep.houseVoteWeight.toFixed(4)}%` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {repBills.length > 0 && (
                    <div style={{ borderTop: '0.5px solid #e0e4ec', paddingTop: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        Voting Record ({repBills.length} bills)
                      </p>
                      <div className="flex gap-3 mb-3">
                        <span style={{ fontSize: 12, color: '#138808', fontWeight: 700 }}>✓ {ayeCount} Aye</span>
                        <span style={{ fontSize: 12, color: '#D32F2F', fontWeight: 700 }}>✗ {nayCount} Nay</span>
                      </div>
                      {repBills.slice(0, 3).map((bill) => {
                        const vts = VOTE_TAG_STYLE[bill.repVote]
                        return (
                          <div key={bill.id} className="flex items-center gap-2 mb-2">
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: vts.bg, color: vts.color, border: `0.5px solid ${vts.border}`, flexShrink: 0 }}>
                              {bill.repVote.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 11, color: '#374151', flex: 1 }}>{bill.title}</span>
                            <span style={{ fontSize: 10, color: '#9ca3af', flexShrink: 0 }}>{new Date(bill.date).getFullYear()}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
