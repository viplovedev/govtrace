'use client'
import { useStore } from '@/lib/store'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { StatCard } from '@/components/ui/StatCard'
import { CURRENT_USER, CITIZENS, computeVoteWeights, computeRatingWeight } from '@/lib/data'
import { formatINR, formatPct, formatCrore } from '@/lib/utils'

const TAX_SLABS = [
  { range: '₹0 – ₹3,00,000',       rate: '0%',  taxable: 0,        tax: 0 },
  { range: '₹3,00,001 – ₹7,00,000',   rate: '5%',  taxable: 400_000,  tax: 20_000 },
  { range: '₹7,00,001 – ₹10,00,000',  rate: '10%', taxable: 300_000,  tax: 30_000 },
  { range: '₹10,00,001 – ₹12,00,000', rate: '15%', taxable: 200_000,  tax: 30_000 },
  { range: '₹12,00,001 – ₹15,00,000', rate: '20%', taxable: 300_000,  tax: 60_000 },
  { range: '₹15,00,001 – ₹24,00,000', rate: '30%', taxable: 900_000,  tax: 270_000 },
]

const INDIRECT_BREAKDOWN = [
  { category: 'Food & Groceries (5% GST)',       estimate: 18_000 },
  { category: 'Eating Out & Hotels (18% GST)',   estimate: 28_000 },
  { category: 'Electronics & Gadgets (18%)',     estimate: 22_000 },
  { category: 'Fuel (excise + VAT)',             estimate: 24_000 },
  { category: 'Clothing & Footwear (12%)',       estimate: 12_000 },
  { category: 'Entertainment & Services (18%)', estimate: 16_000 },
]

export default function TaxPage() {
  const { privacyMode, togglePrivacy } = useStore()
  const isPrivate = privacyMode === 'private'

  const weights      = computeVoteWeights(CURRENT_USER.totalTax)
  const ratingWeight = computeRatingWeight(CURRENT_USER.totalTax)
  const mask         = (val: string) => (isPrivate ? val : '██████')

  return (
    <div>
      <PageTitleBar title="Tax Breakdown" subtitle="FY 2024–25 · New Tax Regime" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Privacy toggle */}
        <div className="gt-card mb-4">
          <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>
              {isPrivate
                ? '🔒 Private View — your figures visible only to you'
                : '🌐 Public View — only masked PAN and vote weights shown'}
            </span>
            <button
              onClick={togglePrivacy}
              style={{
                marginLeft: 'auto',
                background: isPrivate ? '#000080' : '#f5f7fa',
                color: isPrivate ? '#fff' : '#374151',
                border: '1px solid #e0e4ec',
                borderRadius: 6,
                padding: '5px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isPrivate ? 'Switch to Public View' : 'Switch to Private View'}
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <StatCard label="Total Tax Paid"    value={isPrivate ? formatCrore(CURRENT_USER.totalTax)    : '██████'} accentColor="#FF9933" subtext="Direct + Indirect" />
          <StatCard label="Direct Tax (IT)"   value={isPrivate ? formatINR(CURRENT_USER.directTax)     : '██████'} accentColor="#000080" subtext={`Bracket: ${CURRENT_USER.taxBracket}`} />
          <StatCard label="Indirect Tax (GST)" value={isPrivate ? formatINR(CURRENT_USER.indirectTax) : '██████'} accentColor="#138808" subtext="Estimate on consumption" />
          <StatCard label="Annual Income"     value={isPrivate ? formatCrore(CURRENT_USER.annualIncome) : '██████'} accentColor="#D32F2F" subtext={CURRENT_USER.occupationType} />
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {/* Income tax slabs */}
          <div className="gt-card">
            <div style={{ height: 3, background: '#000080' }} />
            <div className="p-4">
              <p className="uppercase text-muted mb-3"
                 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                Income Tax Calculation (New Regime)
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {['Slab', 'Rate', 'Taxable Amount', 'Tax'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', paddingBottom: 8, color: '#6b7280', fontWeight: 600, fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TAX_SLABS.map((slab, i) => (
                    <tr key={i} style={{ borderTop: '0.5px solid #e0e4ec' }}>
                      <td style={{ padding: '6px 0', color: '#374151' }}>{slab.range}</td>
                      <td style={{ padding: '6px 0', fontWeight: 600, color: '#000080' }}>{slab.rate}</td>
                      <td style={{ padding: '6px 0', color: '#374151' }}>{isPrivate ? formatINR(slab.taxable) : '██████'}</td>
                      <td style={{ padding: '6px 0', fontWeight: 600, color: '#1a1a2e' }}>{isPrivate ? formatINR(slab.tax) : '██████'}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid #e0e4ec', background: '#f5f7fa' }}>
                    <td colSpan={2} style={{ padding: '8px 0', fontWeight: 700, color: '#1a1a2e' }}>Total + 4% Health & Ed. Cess</td>
                    <td />
                    <td style={{ padding: '8px 0', fontWeight: 700, color: '#000080', fontSize: 14 }}>
                      {isPrivate ? formatINR(CURRENT_USER.directTax) : '██████'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Indirect tax */}
          <div className="gt-card">
            <div style={{ height: 3, background: '#138808' }} />
            <div className="p-4">
              <p className="uppercase text-muted mb-3"
                 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                Indirect Tax Estimate (GST + Excise)
              </p>
              {INDIRECT_BREAKDOWN.map((row) => {
                const pct = (row.estimate / CURRENT_USER.indirectTax) * 100
                return (
                  <div key={row.category} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 12, color: '#374151' }}>{row.category}</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{isPrivate ? formatINR(row.estimate) : '██████'}</span>
                    </div>
                    <div style={{ height: 4, background: '#f5f7fa', borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#138808', borderRadius: 2 }} />
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-between pt-2" style={{ borderTop: '0.5px solid #e0e4ec' }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Total Indirect Tax</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#138808' }}>{isPrivate ? formatINR(CURRENT_USER.indirectTax) : '██████'}</span>
              </div>
            </div>
          </div>

          {/* Vote weight detail */}
          <div className="gt-card">
            <div style={{ height: 3, background: '#FF9933' }} />
            <div className="p-4">
              <p className="uppercase text-muted mb-3"
                 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                Derived Vote Weights
              </p>
              {[
                { label: 'Hoodi Ward (BBMP)', pool: 42_800_000, weight: weights.ward, color: '#FF9933', decimals: 3 },
                { label: 'Krishnarajapura Assembly', pool: 1_840_000_000, weight: weights.assembly, color: '#000080', decimals: 4 },
                { label: 'Bangalore East Lok Sabha', pool: 9_200_000_000, weight: weights.lokSabha, color: '#138808', decimals: 5 },
              ].map(({ label, pool, weight, color, decimals }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{formatPct(weight, decimals)}</span>
                  </div>
                  <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 4 }}>
                    {isPrivate ? formatCrore(CURRENT_USER.totalTax) : mask(formatCrore(CURRENT_USER.totalTax))} ÷ {formatCrore(pool)} × 100
                  </p>
                  <div style={{ height: 4, background: '#f5f7fa', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${Math.min(weight * 50, 100)}%`, background: color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                Rating weight (×{ratingWeight}) = max(1, round(totalTax ÷ ₹1,00,000))
              </p>
            </div>
          </div>

          {/* Citizens table (public) */}
          <div className="gt-card">
            <div style={{ height: 3, background: '#9ca3af' }} />
            <div className="p-4">
              <p className="uppercase text-muted mb-3"
                 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                Citizens — Public View (masked PAN + vote weights only)
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr>
                      {['PAN', 'Ward Weight', 'Assembly Weight', 'LS Weight', 'TRACES'].map((h) => (
                        <th key={h} style={{ textAlign: 'left', paddingBottom: 6, color: '#6b7280', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CITIZENS.map((c) => {
                      const w    = computeVoteWeights(c.totalTax)
                      const isMe = c.id === CURRENT_USER.id
                      return (
                        <tr key={c.id} style={{ borderTop: '0.5px solid #e0e4ec', background: isMe ? '#fff8f0' : undefined }}>
                          <td style={{ padding: '5px 0', fontFamily: 'monospace', color: isMe ? '#FF9933' : '#374151', fontWeight: isMe ? 700 : 400 }}>
                            {c.maskedPanId} {isMe ? '← you' : ''}
                          </td>
                          <td style={{ padding: '5px 8px', color: '#FF9933', fontWeight: 600 }}>{formatPct(w.ward, 3)}</td>
                          <td style={{ padding: '5px 8px', color: '#000080', fontWeight: 600 }}>{formatPct(w.assembly, 4)}</td>
                          <td style={{ padding: '5px 8px', color: '#138808', fontWeight: 600 }}>{formatPct(w.lokSabha, 5)}</td>
                          <td style={{ padding: '5px 0' }}>
                            {c.tracesVerified ? <span style={{ color: '#138808', fontWeight: 700 }}>✓</span> : <span style={{ color: '#D32F2F' }}>✗</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
