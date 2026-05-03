'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { PageTitleBar } from '@/components/layout/PageTitleBar'
import { getRepresentatives, getManifestoPromises, getCurrentUser } from '@/lib/queries'
import { updateManifestoVerification } from '@/lib/queries'
import { computeRatingWeight } from '@/lib/data'
import type { Representative, ManifestoPromise, Citizen, VerificationVerdict } from '@/lib/types'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  delivered: { label: 'Delivered',           color: '#138808', bg: '#e8f5e9' },
  partial:   { label: 'Partially Delivered', color: '#E65100', bg: '#fff3e0' },
  not:       { label: 'Not Delivered',        color: '#D32F2F', bg: '#ffebee' },
  allocated: { label: 'Allocated / Started', color: '#000080', bg: '#e8eaf6' },
}
const VERIFY_BTNS: { key: VerificationVerdict; label: string; color: string; bg: string }[] = [
  { key: 'delivered', label: '✓ Delivered',           color: '#138808', bg: '#e8f5e9' },
  { key: 'partial',   label: '◑ Partially Delivered', color: '#E65100', bg: '#fff3e0' },
  { key: 'not',       label: '✗ Not Delivered',       color: '#D32F2F', bg: '#ffebee' },
]

export default function ManifestoPage() {
  const { manifestoRepId, setManifestoRepId, manifestoVerifications, setManifestoVerification } = useStore()

  const [reps, setReps]         = useState<Representative[]>([])
  const [promises, setPromises] = useState<ManifestoPromise[]>([])
  const [user, setUser]         = useState<Citizen | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getRepresentatives(), getCurrentUser()]).then(([r, u]) => {
      setReps(r); if (u) setUser(u); setLoading(false)
    })
  }, [])

  // Fetch promises whenever rep changes
  useEffect(() => {
    if (!manifestoRepId) return
    getManifestoPromises(manifestoRepId).then(setPromises)
  }, [manifestoRepId])

  const ratingWeight  = user ? computeRatingWeight(user.totalTax) : 1
  const selectableReps = reps.filter((r) => r.level !== 'ward')
  const rep = selectableReps.find((r) => r.id === manifestoRepId) ?? selectableReps[0]

  const deliveredCount = promises.filter((p) => p.status === 'delivered').length
  const partialCount   = promises.filter((p) => p.status === 'partial').length
  const notCount       = promises.filter((p) => p.status === 'not').length
  const allocatedCount = promises.filter((p) => p.status === 'allocated').length

  async function handleVerify(promiseId: string, verdict: VerificationVerdict) {
    setManifestoVerification(promiseId, verdict)
    const field = verdict === 'delivered'
      ? 'verifications_delivered'
      : verdict === 'partial'
      ? 'verifications_partial'
      : 'verifications_not'
    await updateManifestoVerification(promiseId, field)
    // Refresh promises to show updated counts
    getManifestoPromises(manifestoRepId).then(setPromises)
  }

  return (
    <div>
      <PageTitleBar title="Manifesto Tracker" subtitle="Citizen-verified delivery of election promises" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

        {/* Rep selector */}
        <div className="gt-card mb-5">
          <div style={{ height: 3, background: '#FF9933' }} />
          <div className="p-4">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Select Representative
            </p>
            {loading ? (
              <p style={{ fontSize: 12, color: '#9ca3af' }}>Loading representatives…</p>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectableReps.map((r) => {
                  const isActive   = r.id === manifestoRepId
                  const levelColor = r.level === 'assembly' ? '#000080' : r.level === 'ls' ? '#138808' : '#9ca3af'
                  return (
                    <button
                      key={r.id}
                      onClick={() => setManifestoRepId(r.id)}
                      style={{
                        padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: isActive ? 700 : 400,
                        cursor: 'pointer', transition: 'all 0.15s',
                        border: `1.5px solid ${isActive ? levelColor : '#e0e4ec'}`,
                        background: isActive ? levelColor + '11' : '#fff',
                        color: isActive ? levelColor : '#374151',
                      }}
                    >
                      {r.name} <span style={{ fontSize: 11, opacity: 0.7 }}>({r.party} · {r.level === 'assembly' ? 'MLA' : 'MP'})</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {rep && (
          <>
            {/* Score bar */}
            <div className="gt-card mb-5">
              <div style={{ height: 3, background: rep.level === 'assembly' ? '#000080' : '#138808' }} />
              <div className="p-4">
                <div className="flex items-center gap-6 flex-wrap mb-3">
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>{rep.name}</p>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>{rep.constituency} · {rep.party}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {[
                      { label: 'Delivered', count: deliveredCount, color: '#138808' },
                      { label: 'Partial',   count: partialCount,   color: '#E65100' },
                      { label: 'Not',       count: notCount,       color: '#D32F2F' },
                      { label: 'Allocated', count: allocatedCount, color: '#000080' },
                    ].map(({ label, count, color }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{count}</p>
                        <p style={{ fontSize: 10, color: '#9ca3af' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: '#f5f7fa', display: 'flex' }}>
                  {deliveredCount > 0 && <div style={{ flex: deliveredCount, background: '#138808' }} />}
                  {partialCount > 0   && <div style={{ flex: partialCount,   background: '#F57F17' }} />}
                  {allocatedCount > 0 && <div style={{ flex: allocatedCount, background: '#000080' }} />}
                  {notCount > 0       && <div style={{ flex: notCount,       background: '#D32F2F' }} />}
                </div>
              </div>
            </div>

            {/* Promises list */}
            <div className="flex flex-col gap-4">
              {promises.map((promise) => {
                const sc        = STATUS_CONFIG[promise.status]
                const myVerdict = manifestoVerifications[promise.id]
                const totalV    = promise.citizenVerifications.delivered + promise.citizenVerifications.partial + promise.citizenVerifications.not
                const delivPct  = totalV > 0 ? (promise.citizenVerifications.delivered / totalV) * 100 : 0
                const partPct   = totalV > 0 ? (promise.citizenVerifications.partial    / totalV) * 100 : 0
                const notPct    = totalV > 0 ? (promise.citizenVerifications.not        / totalV) * 100 : 0

                return (
                  <div key={promise.id} className="gt-card overflow-hidden">
                    <div style={{ height: 3, background: sc.color }} />
                    <div className="p-4">
                      <div className="flex items-start gap-3 flex-wrap mb-3">
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', flex: 1, minWidth: 240, lineHeight: 1.4 }}>
                          {promise.promise}
                        </p>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, color: sc.color, background: sc.bg, flexShrink: 0 }}>
                          {sc.label}
                        </span>
                      </div>

                      <div style={{ background: '#f5f7fa', borderRadius: 4, padding: '8px 12px', borderLeft: `3px solid ${sc.color}`, marginBottom: 12 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 2 }}>Evidence</p>
                        <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{promise.evidence}</p>
                      </div>

                      <div className="mb-3">
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>
                          Citizen Verifications ({totalV} responses)
                        </p>
                        <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: '#f5f7fa', display: 'flex' }}>
                          {delivPct > 0 && <div style={{ flex: delivPct, background: '#138808' }} />}
                          {partPct  > 0 && <div style={{ flex: partPct,  background: '#F57F17' }} />}
                          {notPct   > 0 && <div style={{ flex: notPct,   background: '#D32F2F' }} />}
                        </div>
                        <div className="flex gap-4 mt-1">
                          <span style={{ fontSize: 11, color: '#138808', fontWeight: 600 }}>✓ {promise.citizenVerifications.delivered}</span>
                          <span style={{ fontSize: 11, color: '#E65100', fontWeight: 600 }}>◑ {promise.citizenVerifications.partial}</span>
                          <span style={{ fontSize: 11, color: '#D32F2F', fontWeight: 600 }}>✗ {promise.citizenVerifications.not}</span>
                        </div>
                      </div>

                      <div style={{ borderTop: '0.5px solid #e0e4ec', paddingTop: 12 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                          Your Verdict · Weight ×{ratingWeight}
                        </p>
                        {myVerdict ? (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 4,
                            background: VERIFY_BTNS.find((b) => b.key === myVerdict)?.bg,
                            color: VERIFY_BTNS.find((b) => b.key === myVerdict)?.color,
                            fontWeight: 700, fontSize: 12,
                          }}>
                            {VERIFY_BTNS.find((b) => b.key === myVerdict)?.label}
                            <span style={{ fontSize: 10, opacity: 0.7 }}>(submitted)</span>
                          </div>
                        ) : (
                          <div className="flex gap-2 flex-wrap">
                            {VERIFY_BTNS.map(({ key, label, color, bg }) => (
                              <button
                                key={key}
                                onClick={() => handleVerify(promise.id, key)}
                                style={{
                                  padding: '5px 12px', borderRadius: 4,
                                  background: bg, color, fontWeight: 600, fontSize: 12,
                                  border: `1px solid ${color}`, cursor: 'pointer',
                                  transition: 'opacity 0.15s',
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}
                        <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 6 }}>
                          One-time per citizen · Weight proportional to tax contribution
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
