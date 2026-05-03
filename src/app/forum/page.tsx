'use client'
import { useEffect, useState } from 'react'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { getForumAgenda } from '@/lib/queries'
import type { ForumAgendaItem } from '@/lib/types'

const LEVEL_COLOR: Record<string, string> = { ward: '#FF9933', assembly: '#000080', ls: '#138808' }
const LEVEL_LABEL: Record<string, string> = { ward: 'Ward',    assembly: 'Assembly', ls: 'Lok Sabha' }

export default function ForumPage() {
  const [agenda, setAgenda]   = useState<ForumAgendaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getForumAgenda().then((data) => { setAgenda(data); setLoading(false) })
  }, [])

  const sorted    = [...agenda].sort((a, b) => b.aggregatedTokens - a.aggregatedTokens)
  const maxTokens = sorted.length > 0 ? sorted[0].aggregatedTokens : 1

  return (
    <div>
      <PageTitleBar title="Citizen Forum" subtitle="AI-aggregated election agenda — ranked by citizen token allocation" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Intro card */}
        <div className="gt-card mb-5">
          <div style={{ height: 3, background: 'linear-gradient(90deg, #FF9933, #ffffff, #138808)' }} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <span style={{ fontSize: 28, flexShrink: 0 }}>🏛️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                  The People&apos;s Election Mandate
                </p>
                <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
                  This forum aggregates citizen token allocations from the Agenda page into a ranked list of priorities.
                  On election day, the snapshot of this ranking forms the binding mandate for the winning candidate.
                  Rankings are weighted by the tax contribution of each citizen&apos;s tokens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Loading forum agenda…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map((item, idx) => {
              const color = LEVEL_COLOR[item.level]
              const pct   = (item.aggregatedTokens / maxTokens) * 100

              return (
                <div key={item.id} className="gt-card overflow-hidden">
                  <div style={{ height: 3, background: color }} />
                  <div className="p-4">
                    <div className="flex items-start gap-4 flex-wrap">
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: idx === 0 ? '#FF9933' : idx === 1 ? '#9ca3af' : idx === 2 ? '#c45800' : '#f5f7fa',
                        color: idx < 3 ? '#fff' : '#6b7280',
                        fontWeight: 700, fontSize: 18, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        #{idx + 1}
                      </div>

                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: color + '22', color }}>
                            {LEVEL_LABEL[item.level]}
                          </span>
                          <span style={{ fontSize: 10, color: '#9ca3af' }}>{item.topRaisedBy}</span>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{item.description}</p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 24, fontWeight: 700, color, lineHeight: 1 }}>
                          {item.aggregatedTokens.toLocaleString('en-IN')}
                        </p>
                        <p style={{ fontSize: 10, color: '#6b7280' }}>aggregate tokens</p>
                      </div>
                    </div>

                    <div style={{ height: 6, background: '#f5f7fa', borderRadius: 3, marginTop: 12 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="gt-card mt-5">
          <div className="p-4" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.7 }}>
              <strong style={{ color: '#1a1a2e' }}>Disclaimer:</strong> The AI aggregation above identifies patterns from citizen token allocations.
              It does not constitute legal or policy advice. All elected officials are bound by constitutional duties regardless of mandate.
              Citizens retain the right to update their token allocations at any time before the election-day snapshot.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
