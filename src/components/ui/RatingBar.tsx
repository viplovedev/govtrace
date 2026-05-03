'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { computeRatingWeight } from '@/lib/data'
import { getCurrentUser, updateSpendingLineItemRatings } from '@/lib/queries'
import type { Citizen } from '@/lib/types'

interface CitizenRatings {
  onTrack: number
  neutral: number
  stalled: number
}

interface RatingBarProps {
  itemId: string
  ratings: CitizenRatings
}

export function RatingBar({ itemId, ratings }: RatingBarProps) {
  const { citizenRatings, setRating } = useStore()
  const myRating = citizenRatings[itemId]

  const [user, setUser] = useState<Citizen | null>(null)

  useEffect(() => {
    getCurrentUser().then((u) => { if (u) setUser(u) })
  }, [])

  const total      = ratings.onTrack + ratings.neutral + ratings.stalled || 1
  const onTrackPct = (ratings.onTrack / total) * 100
  const neutralPct = (ratings.neutral  / total) * 100
  const stalledPct = (ratings.stalled  / total) * 100
  const weight     = user ? computeRatingWeight(user.totalTax) : 1

  const BTNS = [
    { key: 'onTrack' as const, icon: '👍', label: 'On Track', activeColor: '#1B5E20', activeBg: '#E8F5E9', dbField: 'ratings_on_track' as const },
    { key: 'neutral' as const, icon: '😐', label: 'Neutral',  activeColor: '#E65100', activeBg: '#FFF3E0', dbField: 'ratings_neutral'  as const },
    { key: 'stalled' as const, icon: '👎', label: 'Stalled',  activeColor: '#B71C1C', activeBg: '#FFEBEE', dbField: 'ratings_stalled'  as const },
  ]

  async function handleRate(key: 'onTrack' | 'neutral' | 'stalled', dbField: 'ratings_on_track' | 'ratings_neutral' | 'ratings_stalled') {
    if (myRating) return   // already rated
    setRating(itemId, key)
    await updateSpendingLineItemRatings(itemId, dbField)
  }

  return (
    <div>
      <div className="flex rounded-full overflow-hidden" style={{ height: 4, background: '#f5f7fa', marginBottom: 8 }}>
        <div style={{ width: `${onTrackPct}%`, background: '#2E7D32', transition: 'width 0.3s' }} />
        <div style={{ width: `${neutralPct}%`, background: '#F57F17', transition: 'width 0.3s' }} />
        <div style={{ width: `${stalledPct}%`, background: '#C62828', transition: 'width 0.3s' }} />
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {BTNS.map(({ key, icon, label, activeColor, activeBg, dbField }) => {
          const isActive = myRating === key
          return (
            <button
              key={key}
              onClick={() => handleRate(key, dbField)}
              disabled={!!myRating}
              className="flex items-center gap-1 rounded-full transition-fast"
              style={{
                padding: '4px 10px', background: isActive ? activeBg : 'transparent', border: 'none',
                cursor: myRating ? 'default' : 'pointer', fontSize: 12,
                color: isActive ? activeColor : '#6b7280', fontWeight: isActive ? 600 : 400,
              }}
            >
              <span>{icon}</span>
              {isActive && <span>{label}</span>}
              <span style={{ fontSize: 10, opacity: 0.7 }}>{ratings[key]}</span>
            </button>
          )
        })}
        <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 'auto' }}>weight ×{weight}</span>
      </div>
    </div>
  )
}
