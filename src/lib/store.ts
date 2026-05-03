'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LangCode } from './i18n'
import type { Comment, VerificationVerdict } from './types'
import { NOTIFICATIONS, DEFAULT_TOKEN_ALLOCATIONS, SEED_COMMENTS } from './data'

interface GovTraceStore {
  language: LangCode
  setLanguage: (lang: LangCode) => void

  privacyMode: 'public' | 'private'
  togglePrivacy: () => void

  notifications: typeof NOTIFICATIONS
  markNotificationRead: (id: string) => void
  markAllRead: () => void

  tokenAllocations: Record<string, number>
  allocateTokens: (itemId: string, tokens: number) => void

  citizenRatings: Record<string, 'onTrack' | 'neutral' | 'stalled'>
  setRating: (itemId: string, rating: 'onTrack' | 'neutral' | 'stalled') => void

  manifestoVerifications: Record<string, VerificationVerdict>
  setManifestoVerification: (promiseId: string, verdict: VerificationVerdict) => void

  comments: Record<string, Comment[]>
  commentInputs: Record<string, string>
  setCommentInput: (threadId: string, text: string) => void
  postComment: (threadId: string, text: string, user: { maskedPanId: string; name: string; avatarInitials: string; totalTax: number }) => void

  upvotedComments: Record<string, boolean>
  upvoteComment: (commentId: string, threadId: string, voterTax: number) => void

  openAccordionId: string | null
  setOpenAccordionId: (id: string | null) => void

  billLevelTab: 'ward' | 'assembly' | 'ls'
  setBillLevelTab: (tab: 'ward' | 'assembly' | 'ls') => void

  manifestoRepId: string
  setManifestoRepId: (id: string) => void
}

export const useStore = create<GovTraceStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      privacyMode: 'private',
      togglePrivacy: () =>
        set((s) => ({ privacyMode: s.privacyMode === 'private' ? 'public' : 'private' })),

      notifications: NOTIFICATIONS,
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      tokenAllocations: DEFAULT_TOKEN_ALLOCATIONS,
      allocateTokens: (itemId, tokens) => {
        const current = get().tokenAllocations
        const totalUsed = Object.entries(current)
          .filter(([k]) => k !== itemId)
          .reduce((acc, [, v]) => acc + v, 0)
        const clamped = Math.min(tokens, 100 - totalUsed)
        set({ tokenAllocations: { ...current, [itemId]: Math.max(0, clamped) } })
      },

      citizenRatings: {},
      setRating: (itemId, rating) =>
        set((s) => ({ citizenRatings: { ...s.citizenRatings, [itemId]: rating } })),

      manifestoVerifications: {},
      setManifestoVerification: (promiseId, verdict) =>
        set((s) => ({
          manifestoVerifications: { ...s.manifestoVerifications, [promiseId]: verdict },
        })),

      comments: SEED_COMMENTS,
      commentInputs: {},
      setCommentInput: (threadId, text) =>
        set((s) => ({ commentInputs: { ...s.commentInputs, [threadId]: text } })),
      postComment: (threadId, text, user) => {
        if (!text.trim()) return
        const newComment: Comment = {
          id: `cmt-${Date.now()}`,
          maskedPanId: user.maskedPanId,
          name: user.name,
          avatarInitials: user.avatarInitials,
          taxContribution: user.totalTax,
          text: text.trim(),
          weightedUpvotes: 0,
          timestamp: new Date().toISOString(),
        }
        set((s) => ({
          comments: {
            ...s.comments,
            [threadId]: [...(s.comments[threadId] ?? []), newComment],
          },
          commentInputs: { ...s.commentInputs, [threadId]: '' },
        }))
      },

      upvotedComments: {},
      upvoteComment: (commentId, threadId, voterTax) => {
        if (get().upvotedComments[commentId]) return
        const weight = Math.max(1, Math.round(voterTax / 100_000))
        set((s) => ({
          upvotedComments: { ...s.upvotedComments, [commentId]: true },
          comments: {
            ...s.comments,
            [threadId]: (s.comments[threadId] ?? []).map((c) =>
              c.id === commentId ? { ...c, weightedUpvotes: c.weightedUpvotes + weight } : c
            ),
          },
        }))
      },

      openAccordionId: null,
      setOpenAccordionId: (id) =>
        set((s) => ({ openAccordionId: s.openAccordionId === id ? null : id })),

      billLevelTab: 'ward',
      setBillLevelTab: (tab) => set({ billLevelTab: tab }),

      manifestoRepId: 'r2',
      setManifestoRepId: (id) => set({ manifestoRepId: id }),
    }),
    { name: 'govtrace-store' }
  )
)
