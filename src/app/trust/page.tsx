import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { TRUST_DATA_SOURCES, TAMPER_PROOF_MECHANISMS } from '@/lib/data'
import { IndianFlag } from '@/components/ui/IndianFlag'

const CHAIN_COLORS = ['#FF9933', '#000080', '#138808', '#D32F2F', '#6b7280', '#9ca3af']

export default function TrustPage() {
  return (
    <div>
      <PageTitleBar
        title="Data & Trust"
        subtitle="7-layer trust chain · How GovTrace guarantees tamper-proof vote weights"
      />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Hero */}
        <div className="gt-card mb-5">
          <div style={{ height: 3, background: 'linear-gradient(90deg, #FF9933 33%, #fff 33% 66%, #138808 66%)' }} />
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <IndianFlag />
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>
                  How do we guarantee that vote weights are fair?
                </p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  Every number on GovTrace is anchored to official government data sources and cryptographically sealed.
                </p>
              </div>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { icon: '🔏', title: 'TRACES-signed', desc: 'Every tax record carries a digital signature from the Income Tax Department' },
                { icon: '🔢', title: 'Sum = 100%', desc: 'All vote weights in any constituency must sum to exactly 100% — any tampering is instantly detectable' },
                { icon: '📋', title: 'RTI-verifiable', desc: 'Every data point is legally accessible under the Right to Information Act 2005' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ background: '#f5f7fa', borderRadius: 6, padding: '14px' }}>
                  <span style={{ fontSize: 24 }}>{icon}</span>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginTop: 6, marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '3fr 2fr' }}>
          {/* Data source chain */}
          <div>
            <p className="uppercase mb-3"
               style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
              6-Source Trust Chain
            </p>
            <div className="flex flex-col" style={{ position: 'relative' }}>
              {/* Connector line */}
              <div style={{
                position: 'absolute', left: 22, top: 24, bottom: 24,
                width: 2, background: '#e0e4ec', zIndex: 0,
              }} />

              {TRUST_DATA_SOURCES.map((src, idx) => (
                <div key={src.name} style={{ display: 'flex', gap: 14, marginBottom: 12, position: 'relative', zIndex: 1 }}>
                  {/* Circle */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: CHAIN_COLORS[idx] + '22',
                    border: `2px solid ${CHAIN_COLORS[idx]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: CHAIN_COLORS[idx],
                  }}>
                    {idx + 1}
                  </div>

                  <div className="gt-card p-3" style={{ flex: 1 }}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{src.name}</p>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 10, color: '#000080', textDecoration: 'underline' }}
                      >
                        {src.url.replace('https://', '')}
                      </a>
                    </div>
                    <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{src.description}</p>
                    <p style={{ fontSize: 11, color: '#374151' }}>
                      <span style={{ fontWeight: 600, color: CHAIN_COLORS[idx] }}>Usage: </span>
                      {src.usage}
                    </p>
                    <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>Owner: {src.owner}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: tamper-proof mechanisms + vote weight formula */}
          <div className="flex flex-col gap-4">
            <div className="gt-card">
              <div style={{ height: 3, background: '#000080' }} />
              <div className="p-4">
                <p className="uppercase mb-3"
                   style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  Tamper-Proof Mechanisms
                </p>
                {TAMPER_PROOF_MECHANISMS.map((mechanism, idx) => (
                  <div key={idx} className="flex gap-3 mb-3">
                    <div style={{
                      width: 20, height: 20, borderRadius: 3,
                      background: '#000080', color: '#fff',
                      fontSize: 10, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      {idx + 1}
                    </div>
                    <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{mechanism}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula card */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#FF9933' }} />
              <div className="p-4">
                <p className="uppercase mb-3"
                   style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  Vote Weight Formula
                </p>
                <div style={{ background: '#f5f7fa', borderRadius: 6, padding: 12, fontFamily: 'monospace', fontSize: 13, marginBottom: 12 }}>
                  <span style={{ color: '#000080', fontWeight: 700 }}>voteWeight</span>
                  <span style={{ color: '#6b7280' }}> = </span>
                  <span style={{ color: '#138808' }}>totalTax</span>
                  <span style={{ color: '#6b7280' }}> ÷ </span>
                  <span style={{ color: '#FF9933' }}>constituencyTaxPool</span>
                  <span style={{ color: '#6b7280' }}> × 100</span>
                </div>
                <div style={{ background: '#f5f7fa', borderRadius: 6, padding: 12, fontFamily: 'monospace', fontSize: 13, marginBottom: 12 }}>
                  <span style={{ color: '#000080', fontWeight: 700 }}>ratingWeight</span>
                  <span style={{ color: '#6b7280' }}> = </span>
                  <span style={{ color: '#138808' }}>max(1, round(totalTax ÷ 100,000))</span>
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
                  totalTax = directTax (TRACES) + indirectTax (GSTN)<br/>
                  constituencyTaxPool = sum of all citizens&apos; taxes in constituency, cross-verified annually against CAG and Finance Ministry data.
                </p>
              </div>
            </div>

            {/* Architecture */}
            <div className="gt-card">
              <div style={{ height: 3, background: '#138808' }} />
              <div className="p-4">
                <p className="uppercase mb-3"
                   style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', borderBottom: '1px solid #e0e4ec', paddingBottom: 8 }}>
                  Platform Architecture
                </p>
                {[
                  { icon: '🔒', label: 'Zero PII stored', desc: 'GovTrace stores no raw personal data — all identifiers are masked hashes' },
                  { icon: '👁️', label: 'Read-only', desc: 'Platform reads from authoritative govt sources — cannot modify any record' },
                  { icon: '🌐', label: 'Open source', desc: 'Full codebase is public. Smart contract vote-weight logic is independently auditable' },
                  { icon: '📜', label: 'RTI Act 2005', desc: 'Any citizen can RTI any data point displayed on this platform' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="flex gap-2 mb-3">
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>{label}</p>
                      <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
