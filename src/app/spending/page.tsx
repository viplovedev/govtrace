'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { RatingBar } from '@/components/ui/RatingBar'
import { getSpendingWithLineItems } from '@/lib/queries'
import { formatCrore } from '@/lib/utils'
import type { SpendingItem } from '@/lib/types'

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  'Completed':          { color: '#1B5E20', bg: '#E8F5E9' },
  'Under Construction': { color: '#0D47A1', bg: '#E3F2FD' },
  'Tendered':           { color: '#4A148C', bg: '#F3E5F5' },
  'Allocated':          { color: '#E65100', bg: '#FFF3E0' },
  'Stalled':            { color: '#B71C1C', bg: '#FFEBEE' },
}

function daysColor(status: string, days: number): string {
  if (status === 'Stalled' && days > 365) return '#B71C1C'
  if (status === 'Stalled' && days > 180) return '#E65100'
  if (status === 'Stalled') return '#F57F17'
  if (status === 'Under Construction' && days > 730) return '#E65100'
  return '#1B5E20'
}

export default function SpendingPage() {
  const { openAccordionId, setOpenAccordionId } = useStore()
  const [spending, setSpending] = useState<SpendingItem[]>([])
  const [loading, setLoading]  = useState(true)

  useEffect(() => {
    getSpendingWithLineItems().then((data) => { setSpending(data); setLoading(false) })
  }, [])

  const totalBudget = spending.reduce((a, b) => a + b.amount, 0)

  return (
    <div>
      <PageTitleBar
        title="Government Spending"
        subtitle={loading ? 'Loading…' : `Hoodi Ward (BBMP) · FY 2024–25 · Total: ${formatCrore(totalBudget)}`}
      />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Fetching spending data…</div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="gt-card mb-4">
              <div className="p-4">
                <p className="uppercase text-muted mb-2" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
                  Budget Allocation
                </p>
                <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 1 }}>
                  {spending.map((item) => (
                    <div
                      key={item.id}
                      style={{ flex: item.pct, background: item.accentColor, cursor: 'pointer' }}
                      title={`${item.head}: ${item.pct}%`}
                      onClick={() => setOpenAccordionId(item.id)}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {spending.map((item) => (
                    <div key={item.id} className="flex items-center gap-1">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: item.accentColor }} />
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{item.head} {item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="flex flex-col gap-3">
              {spending.map((section) => {
                const isOpen = openAccordionId === section.id
                return (
                  <div key={section.id} className="gt-card overflow-hidden">
                    <div
                      onClick={() => setOpenAccordionId(section.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', cursor: 'pointer',
                        borderLeft: `4px solid ${section.accentColor}`,
                        background: isOpen ? '#f8f9ff' : '#fff',
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 14, color: '#6b7280', flexShrink: 0 }}>{isOpen ? '▾' : '▸'}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', flex: 1 }}>{section.head}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: section.accentColor }}>{formatCrore(section.amount)}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: section.accentColor + '22', color: section.accentColor, padding: '2px 8px', borderRadius: 3 }}>
                        {section.pct}% of budget
                      </span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{section.items.length} projects</span>
                    </div>

                    {isOpen && (
                      <div style={{ background: '#f5f7fa', padding: '6px 8px 8px' }}>
                        {section.items.map((item) => {
                          const ss = STATUS_STYLE[item.status] ?? { color: '#6b7280', bg: '#f5f7fa' }
                          return (
                            <div key={item.id} className="gt-card mb-2">
                              <div className="p-[12px_14px]">
                                <div className="flex items-start gap-3 mb-2 flex-wrap">
                                  <div style={{ flex: 1, minWidth: 200 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>{item.name}</p>
                                    <p style={{ fontSize: 11, color: '#6b7280' }}>
                                      Vendor:{' '}
                                      <a href={item.vendorLink} style={{ color: '#000080', textDecoration: 'underline' }}>{item.vendor}</a>
                                    </p>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', flexShrink: 0 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3, color: ss.color, background: ss.bg }}>{item.status}</span>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: daysColor(item.status, item.daysInStatus) }}>{item.daysInStatus}d</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{formatCrore(item.amount)}</span>
                                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{item.pctOfHead}% of head</span>
                                  </div>
                                </div>

                                <div style={{ height: 4, background: '#f5f7fa', borderRadius: 2, marginBottom: 10 }}>
                                  <div style={{
                                    height: '100%',
                                    width: item.status === 'Completed' ? '100%'
                                      : item.status === 'Under Construction' ? '60%'
                                      : item.status === 'Tendered' ? '20%'
                                      : item.status === 'Allocated' ? '5%' : '0%',
                                    background: section.accentColor, borderRadius: 2, transition: 'width 0.3s',
                                  }} />
                                </div>

                                <RatingBar itemId={item.id} ratings={item.citizenRatings} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 16, textAlign: 'center' }}>
              Citizen ratings are tax-weighted · Data sourced from BBMP project portal · RTI-verifiable
            </p>
          </>
        )}
      </div>
    </div>
  )
}
