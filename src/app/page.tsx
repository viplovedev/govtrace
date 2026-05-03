'use client'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { StatCard } from '@/components/ui/StatCard'
import { useStore } from '@/lib/store'
import {
  CURRENT_USER, SPENDING_ITEMS, MANIFESTO_PROMISES, BILLS, NOTIFICATIONS,
  computeVoteWeights, formatCurrency,
} from '@/lib/data'
import { formatPct } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const notifications = useStore((s) => s.notifications)

  const weights    = computeVoteWeights(CURRENT_USER.totalTax)
  const unread     = notifications.filter((n) => !n.read).length
  const totalSpent = SPENDING_ITEMS.reduce((a, b) => a + b.amount, 0)
  const recentBills = BILLS.slice(0, 3)

  return (
    <div>
      <PageTitleBar
        title="Dashboard"
        subtitle={`Welcome back, ${CURRENT_USER.name} · FY 2024–25`}
      />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Stat cards row */}
        <div className="grid grid-cols-2 gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <StatCard
            label="Total Tax Paid"
            value={formatCurrency(CURRENT_USER.totalTax, true)}
            subtext="Direct + Indirect · FY 2024–25"
            accentColor="#FF9933"
          />
          <StatCard
            label="Direct Tax"
            value={formatCurrency(CURRENT_USER.directTax, true)}
            subtext={`Income Tax · ${CURRENT_USER.taxBracket} slab`}
            accentColor="#000080"
          />
          <StatCard
            label="Indirect Tax"
            value={formatCurrency(CURRENT_USER.indirectTax, true)}
            subtext="GST estimate on consumption"
            accentColor="#138808"
          />
          <StatCard
            label="Annual Income"
            value={formatCurrency(CURRENT_USER.annualIncome, true)}
            subtext={CURRENT_USER.occupationType}
            accentColor="#D32F2F"
          />
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Left column */}
          <div className="flex flex-col gap-4">

            {/* Vote weights */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#FF9933' }} />
              <div className="p-4">
                <p className="uppercase text-muted mb-3"
                   style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  Your Vote Weight
                </p>
                <div className="flex gap-4 flex-wrap">
                  {[
                    { label: 'Hoodi Ward (BBMP)', pct: weights.ward, color: '#FF9933', decimals: 3 },
                    { label: 'Krishnarajapura (Vidhan Sabha)', pct: weights.assembly, color: '#000080', decimals: 4 },
                    { label: 'Bangalore East (Lok Sabha)', pct: weights.lokSabha, color: '#138808', decimals: 5 },
                  ].map(({ label, pct, color, decimals }) => (
                    <div key={label} style={{ flex: 1, minWidth: 160 }}>
                      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>
                        {formatPct(pct, decimals)}
                      </p>
                      <div style={{ height: 4, background: '#f5f7fa', borderRadius: 2, marginTop: 6 }}>
                        <div style={{ height: '100%', width: `${Math.min(pct * 100, 100)}%`, background: color, borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 10 }}>
                  Formula: totalTax ÷ constituencyTaxPool × 100 · TRACES-verified
                </p>
              </div>
            </div>

            {/* Spending summary */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#000080' }} />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3" style={{ borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  <p className="uppercase text-muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
                    Ward Spending Snapshot
                  </p>
                  <Link href="/spending" style={{ fontSize: 11, color: '#000080', textDecoration: 'none' }}>
                    View all →
                  </Link>
                </div>
                {SPENDING_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 mb-2">
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: item.accentColor, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, flex: 1, color: '#374151' }}>{item.head}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>
                      {formatCurrency(item.amount, true)}
                    </p>
                    <p style={{ fontSize: 11, color: '#6b7280', width: 32, textAlign: 'right' }}>{item.pct}%</p>
                    <div style={{ width: 60, height: 4, background: '#f5f7fa', borderRadius: 2 }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.accentColor, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: '#6b7280', marginTop: 8, borderTop: '0.5px solid #e0e4ec', paddingTop: 8 }}>
                  Total ward expenditure: {formatCurrency(totalSpent, true)}
                </p>
              </div>
            </div>

            {/* Recent bills */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#138808' }} />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3" style={{ borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  <p className="uppercase text-muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
                    Recent Bills & Votes
                  </p>
                  <Link href="/bills" style={{ fontSize: 11, color: '#000080', textDecoration: 'none' }}>
                    View all →
                  </Link>
                </div>
                {recentBills.map((bill) => {
                  const voteColor = bill.repVote === 'aye' ? '#138808' : bill.repVote === 'nay' ? '#D32F2F' : '#FF9933'
                  const voteBg   = bill.repVote === 'aye' ? '#e8f5e9' : bill.repVote === 'nay' ? '#ffebee' : '#fff3e0'
                  return (
                    <div key={bill.id} className="flex items-start gap-3 mb-3 pb-3"
                         style={{ borderBottom: '0.5px solid #e0e4ec' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>{bill.title}</p>
                        <p style={{ fontSize: 11, color: '#6b7280' }}>
                          {new Date(bill.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}
                          <span className="capitalize">{bill.level === 'ls' ? 'Lok Sabha' : bill.level}</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
                          background: voteBg, color: voteColor,
                          border: `0.5px solid ${voteColor}`,
                        }}>
                          {bill.repVote.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
                          background: bill.result === 'passed' ? '#e8f5e9' : '#ffebee',
                          color: bill.result === 'passed' ? '#138808' : '#D32F2F',
                        }}>
                          {bill.result === 'passed' ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Manifesto summary */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#FF9933' }} />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3" style={{ borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  <p className="uppercase text-muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
                    Manifesto Score
                  </p>
                  <Link href="/manifesto" style={{ fontSize: 11, color: '#000080', textDecoration: 'none' }}>View →</Link>
                </div>
                {(['delivered','partial','not','allocated'] as const).map((status) => {
                  const count = MANIFESTO_PROMISES.filter((p) => p.status === status).length
                  const colors: Record<string, string> = { delivered: '#138808', partial: '#E65100', not: '#D32F2F', allocated: '#000080' }
                  const labels: Record<string, string> = { delivered: 'Delivered', partial: 'Partial', not: 'Not Delivered', allocated: 'Allocated' }
                  return (
                    <div key={status} className="flex items-center gap-2 mb-2">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[status], flexShrink: 0 }} />
                      <p style={{ fontSize: 12, flex: 1, color: '#374151' }}>{labels[status]}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: colors[status] }}>{count}</span>
                    </div>
                  )
                })}
                <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: '#f5f7fa', marginTop: 8, display: 'flex' }}>
                  {(['delivered','partial','not','allocated'] as const).map((status) => {
                    const count = MANIFESTO_PROMISES.filter((p) => p.status === status).length
                    const colors: Record<string, string> = { delivered: '#138808', partial: '#E65100', not: '#D32F2F', allocated: '#000080' }
                    return <div key={status} style={{ flex: count, background: colors[status] }} />
                  })}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#D32F2F' }} />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3" style={{ borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  <p className="uppercase text-muted" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
                    Recent Activity
                  </p>
                  {unread > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#D32F2F', color: '#fff', borderRadius: 99, padding: '2px 7px' }}>
                      {unread} new
                    </span>
                  )}
                </div>
                {notifications.slice(0, 4).map((n) => {
                  const icons: Record<string, string> = { bill: '🗳️', status: '🚧', agenda: '📢' }
                  return (
                    <div key={n.id} className="flex gap-2 mb-3 pb-3" style={{ borderBottom: '0.5px solid #e0e4ec' }}>
                      <span style={{ fontSize: 15 }}>{icons[n.type]}</span>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: n.read ? 400 : 600, color: '#1a1a2e', marginBottom: 2 }}>
                          {n.title}
                        </p>
                        <p style={{ fontSize: 10, color: '#9ca3af' }}>
                          {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      {!n.read && (
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#000080', marginLeft: 'auto', marginTop: 4, flexShrink: 0 }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* PAN & verification */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#138808' }} />
              <div className="p-4">
                <p className="uppercase text-muted mb-3"
                   style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  Identity & Verification
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span style={{ fontSize: 12, color: '#6b7280' }}>PAN</span>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{CURRENT_USER.maskedPanId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 12, color: '#6b7280' }}>TRACES Verified</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#138808' }}>✓ Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Tax Bracket</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{CURRENT_USER.taxBracket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 12, color: '#6b7280' }}>Occupation</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{CURRENT_USER.occupationType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
