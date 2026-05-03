'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { getBills, getRepresentatives, getCurrentUser } from '@/lib/queries'
import { computeVoteWeights } from '@/lib/data'
import { formatDate, formatPct } from '@/lib/utils'
import type { Bill, Representative, Citizen } from '@/lib/types'

const VOTE_TAG: Record<string, { bg: string; color: string; border: string; label: string }> = {
  aye:     { bg: '#e8f5e9', color: '#138808', border: '#138808', label: 'AYE' },
  nay:     { bg: '#ffebee', color: '#D32F2F', border: '#D32F2F', label: 'NAY' },
  abstain: { bg: '#fff3e0', color: '#c45800', border: '#FF9933', label: 'ABSTAIN' },
}
const RESULT_TAG: Record<string, { bg: string; color: string }> = {
  passed: { bg: '#e8f5e9', color: '#138808' },
  failed: { bg: '#ffebee', color: '#D32F2F' },
}
const LEVEL_TABS: { key: 'ward' | 'assembly' | 'ls'; label: string; color: string }[] = [
  { key: 'ward',     label: 'Ward (BBMP)',            color: '#FF9933' },
  { key: 'assembly', label: 'Assembly (Vidhan Sabha)', color: '#000080' },
  { key: 'ls',       label: 'Lok Sabha',              color: '#138808' },
]

export default function BillsPage() {
  const { billLevelTab, setBillLevelTab } = useStore()

  const [bills, setBills]         = useState<Bill[]>([])
  const [reps, setReps]           = useState<Representative[]>([])
  const [user, setUser]           = useState<Citizen | null>(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([getBills(), getRepresentatives(), getCurrentUser()]).then(([b, r, u]) => {
      setBills(b); setReps(r); if (u) setUser(u); setLoading(false)
    })
  }, [])

  const weights = user ? computeVoteWeights(user.totalTax) : { ward: 0, assembly: 0, lokSabha: 0 }
  const filteredBills = bills.filter((b) => b.level === billLevelTab)

  const activeWeightLabel = billLevelTab === 'ward'
    ? `Ward: ${formatPct(weights.ward, 3)}`
    : billLevelTab === 'assembly'
    ? `Assembly: ${formatPct(weights.assembly, 4)}`
    : `Lok Sabha: ${formatPct(weights.lokSabha, 5)}`

  return (
    <div>
      <PageTitleBar title="Bills & Votes" subtitle="Voting record of your representatives" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Level tabs */}
        <div style={{ borderBottom: '0.5px solid #e0e4ec', marginBottom: 20, display: 'flex', gap: 0 }}>
          {LEVEL_TABS.map(({ key, label, color }) => {
            const active = billLevelTab === key
            return (
              <button
                key={key}
                onClick={() => setBillLevelTab(key)}
                style={{
                  padding: '8px 20px', fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? color : '#6b7280',
                  background: 'none', border: 'none',
                  borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            )
          })}
          <div style={{ flex: 1 }} />
          {!loading && (
            <div style={{ padding: '8px 0', fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center' }}>
              Your vote weight at this level:{' '}
              <strong style={{ color: '#000080', marginLeft: 4 }}>{activeWeightLabel}</strong>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Fetching bills…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredBills.map((bill) => {
              const vt  = VOTE_TAG[bill.repVote]
              const rt  = RESULT_TAG[bill.result]
              const rep = reps.find((r) => r.id === bill.repId)
              const totalVotes = bill.ayeCount + bill.nayCount + bill.abstainCount
              const levelColor = billLevelTab === 'ward' ? '#FF9933' : billLevelTab === 'assembly' ? '#000080' : '#138808'

              return (
                <div key={bill.id} className="gt-card overflow-hidden">
                  <div style={{ height: 3, background: levelColor }} />
                  <div className="p-4">
                    <div className="flex items-start gap-3 flex-wrap mb-3">
                      <div style={{ flex: 1, minWidth: 280 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>{bill.title}</p>
                        <p style={{ fontSize: 11, color: '#6b7280' }}>
                          {formatDate(bill.date)}{rep && ` · Voted by ${rep.name} (${rep.party})`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, background: vt.bg, color: vt.color, border: `0.5px solid ${vt.border}` }}>
                          Rep: {vt.label}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, background: rt.bg, color: rt.color }}>
                          {bill.result === 'passed' ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 12, background: '#f5f7fa', borderRadius: 4, padding: '8px 12px' }}>
                      {bill.description}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>House Vote</p>
                        <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', width: 200, gap: 1 }}>
                          <div style={{ flex: bill.ayeCount, background: '#2E7D32' }} />
                          <div style={{ flex: bill.abstainCount, background: '#F57F17' }} />
                          <div style={{ flex: bill.nayCount, background: '#C62828' }} />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <span style={{ fontSize: 12 }}>
                          <span style={{ color: '#138808', fontWeight: 700 }}>✓ {bill.ayeCount}</span>
                          <span style={{ color: '#6b7280' }}> Aye</span>
                        </span>
                        {bill.abstainCount > 0 && (
                          <span style={{ fontSize: 12 }}>
                            <span style={{ color: '#FF9933', fontWeight: 700 }}>~ {bill.abstainCount}</span>
                            <span style={{ color: '#6b7280' }}> Abstain</span>
                          </span>
                        )}
                        <span style={{ fontSize: 12 }}>
                          <span style={{ color: '#D32F2F', fontWeight: 700 }}>✗ {bill.nayCount}</span>
                          <span style={{ color: '#6b7280' }}> Nay</span>
                        </span>
                      </div>
                      {user && (
                        <div style={{ marginLeft: 'auto' }}>
                          <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Your constituency weight</p>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#000080' }}>{activeWeightLabel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredBills.length === 0 && (
              <div className="gt-card p-8 text-center">
                <p style={{ color: '#9ca3af', fontSize: 13 }}>No bills at this level yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
