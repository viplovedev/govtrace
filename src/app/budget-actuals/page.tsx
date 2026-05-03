'use client'
import { useEffect, useState } from 'react'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { getBudgetActuals } from '@/lib/queries'
import { formatCrore } from '@/lib/utils'
import type { BudgetActual } from '@/lib/types'

function getStatus(budgeted: number, actual: number): 'onTrack' | 'overspent' | 'underspent' {
  const pct = ((actual - budgeted) / budgeted) * 100
  if (Math.abs(pct) <= 2) return 'onTrack'
  return pct > 0 ? 'overspent' : 'underspent'
}

const STATUS_CONFIG = {
  onTrack:    { label: 'On Track',   color: '#138808', bg: '#e8f5e9' },
  overspent:  { label: 'Overspent',  color: '#D32F2F', bg: '#ffebee' },
  underspent: { label: 'Underspent', color: '#E65100', bg: '#fff3e0' },
}

export default function BudgetActualsPage() {
  const [rows, setRows]       = useState<BudgetActual[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBudgetActuals().then((data) => { setRows(data); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div>
        <PageTitleBar title="Budget vs Actuals" subtitle="Loading…" />
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24, textAlign: 'center', color: '#6b7280' }}>
          Fetching budget data…
        </div>
      </div>
    )
  }

  const totalBudgeted = rows.reduce((a, b) => a + b.budgeted, 0)
  const totalActual   = rows.reduce((a, b) => a + b.actual, 0)
  const totalVariance = totalActual - totalBudgeted
  const totalPct      = (totalVariance / totalBudgeted) * 100

  return (
    <div>
      <PageTitleBar title="Budget vs Actuals" subtitle="Hoodi Ward (BBMP) · FY 2024–25" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Summary cards */}
        <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'Total Budgeted', value: formatCrore(totalBudgeted), color: '#000080' },
            { label: 'Total Actual', value: formatCrore(totalActual), color: '#138808' },
            {
              label: 'Net Variance',
              value: `${totalVariance >= 0 ? '+' : ''}${formatCrore(Math.abs(totalVariance))} (${totalPct.toFixed(1)}%)`,
              color: totalVariance > 0 ? '#D32F2F' : '#138808',
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="gt-card p-4">
              <p style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {label}
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Detailed cards */}
        <div className="flex flex-col gap-3">
          {rows.map((row) => {
            const variance       = row.actual - row.budgeted
            const variancePct    = (variance / row.budgeted) * 100
            const utilisationPct = (row.actual / row.budgeted) * 100
            const status         = getStatus(row.budgeted, row.actual)
            const sc             = STATUS_CONFIG[status]

            return (
              <div key={row.id} className="gt-card overflow-hidden">
                <div style={{ height: 3, background: row.accentColor }} />
                <div style={{ padding: '14px 16px' }}>
                  <div className="flex items-center gap-4 flex-wrap mb-3">
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', flex: 1, minWidth: 160 }}>{row.head}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 3, color: sc.color, background: sc.bg }}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="grid gap-4 mb-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {[
                      { label: 'Budgeted',     value: formatCrore(row.budgeted),   color: '#000080' },
                      { label: 'Actual Spend', value: formatCrore(row.actual),     color: '#138808' },
                      { label: 'Variance',     value: `${variance >= 0 ? '+' : ''}${formatCrore(Math.abs(variance))}`, color: variance > 0 ? '#D32F2F' : '#138808' },
                      { label: 'Variance %',   value: `${variancePct >= 0 ? '+' : ''}${variancePct.toFixed(1)}%`, color: Math.abs(variancePct) <= 2 ? '#138808' : variancePct > 0 ? '#D32F2F' : '#E65100' },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 11, color: '#6b7280' }}>Utilisation</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: sc.color }}>{utilisationPct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f5f7fa', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, background: '#e0e4ec', borderRadius: 3 }} />
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: `${Math.min(utilisationPct, 120)}%`,
                        background: utilisationPct > 102 ? '#D32F2F' : utilisationPct < 98 ? '#E65100' : '#138808',
                        borderRadius: 3, transition: 'width 0.3s',
                      }} />
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0, left: `${100 / 1.2}%`,
                        width: 2, background: '#9ca3af', opacity: utilisationPct > 100 ? 1 : 0,
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 16, textAlign: 'center' }}>
          Data sourced from BBMP Finance Department · Audited by CAG · RTI-verifiable
        </p>
      </div>
    </div>
  )
}
