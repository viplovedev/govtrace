'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { CommentThread } from '@/components/ui/CommentThread'
import { getAgendaItems } from '@/lib/queries'
import { formatCrore } from '@/lib/utils'
import type { AgendaItem } from '@/lib/types'

const LEVEL_COLOR: Record<string, string> = {
  ward:     '#FF9933',
  assembly: '#000080',
  ls:       '#138808',
}
const LEVEL_LABEL: Record<string, string> = {
  ward:     'Ward',
  assembly: 'Assembly',
  ls:       'Lok Sabha',
}

export default function AgendaPage() {
  const { tokenAllocations, allocateTokens } = useStore()
  const [items, setItems]     = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAgendaItems().then((data) => { setItems(data); setLoading(false) })
  }, [])

  const totalUsed = Object.values(tokenAllocations).reduce((a, b) => a + b, 0)
  const remaining = 100 - totalUsed

  return (
    <div>
      <PageTitleBar
        title="Agenda & Tokens"
        subtitle="Distribute 100 tokens to set your constituency mandate"
      />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Token balance bar */}
        <div className="gt-card mb-5">
          <div style={{ height: 3, background: '#FF9933' }} />
          <div className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Token Budget
                </p>
                <p style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>
                  Allocate your 100 tokens across agenda items — allocation becomes the elected candidate&apos;s mandate on election day.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#000080', lineHeight: 1 }}>{totalUsed}</p>
                  <p style={{ fontSize: 10, color: '#6b7280' }}>Allocated</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 28, fontWeight: 700, color: remaining > 0 ? '#FF9933' : '#138808', lineHeight: 1 }}>{remaining}</p>
                  <p style={{ fontSize: 10, color: '#6b7280' }}>Remaining</p>
                </div>
              </div>
            </div>

            <div style={{ height: 8, background: '#f5f7fa', borderRadius: 4, marginTop: 12, overflow: 'hidden', display: 'flex' }}>
              {items.map((item) => {
                const tokens = tokenAllocations[item.id] ?? 0
                const color  = LEVEL_COLOR[item.level]
                return tokens > 0 ? (
                  <div key={item.id} style={{ flex: tokens, background: color, transition: 'flex 0.3s' }} title={`${item.title}: ${tokens} tokens`} />
                ) : null
              })}
              {remaining > 0 && <div style={{ flex: remaining, background: '#e0e4ec' }} />}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Fetching agenda…</div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const tokens = tokenAllocations[item.id] ?? 0
              const color  = LEVEL_COLOR[item.level]

              return (
                <div key={item.id} className="gt-card overflow-hidden">
                  <div style={{ height: 3, background: color }} />
                  <div className="p-4">
                    <div className="flex items-start gap-4 flex-wrap mb-3">
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: color + '22', color }}>
                            {LEVEL_LABEL[item.level]}
                          </span>
                          <span style={{ fontSize: 10, color: '#9ca3af' }}>Raised by {item.raisedBy}</span>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{item.title}</p>
                        <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{item.description}</p>
                      </div>

                      {/* Token allocator */}
                      <div style={{ flexShrink: 0, textAlign: 'center', background: '#f5f7fa', borderRadius: 8, padding: '12px 16px', minWidth: 140 }}>
                        <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>My Tokens</p>
                        <p style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1, marginBottom: 8 }}>{tokens}</p>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button
                            onClick={() => allocateTokens(item.id, Math.max(0, tokens - 5))}
                            style={{ width: 28, height: 28, borderRadius: 4, background: '#fff', border: '1px solid #e0e4ec', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#6b7280' }}
                          >−</button>
                          <button
                            onClick={() => allocateTokens(item.id, tokens + 5)}
                            disabled={remaining < 5}
                            style={{ width: 28, height: 28, borderRadius: 4, background: remaining >= 5 ? color : '#e0e4ec', border: 'none', cursor: remaining >= 5 ? 'pointer' : 'not-allowed', fontSize: 14, fontWeight: 700, color: '#fff' }}
                          >+</button>
                        </div>
                        <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 6 }}>in steps of 5</p>
                      </div>
                    </div>

                    <div style={{ borderTop: '0.5px solid #e0e4ec', paddingTop: 10 }}>
                      <div className="flex items-center gap-3">
                        <div>
                          <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Cumulative Weighted Vote</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color }}>{formatCrore(item.cumulativeWeightedVote)}</p>
                        </div>
                        <div style={{ flex: 1, height: 4, background: '#f5f7fa', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${Math.min((item.cumulativeWeightedVote / 5_000_000) * 100, 100)}%`, background: color, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <CommentThread threadId={item.id} />
                </div>
              )
            })}
          </div>
        )}

        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 16, textAlign: 'center' }}>
          Token snapshot taken on election day · Becomes elected candidate&apos;s mandate
        </p>
      </div>
    </div>
  )
}
