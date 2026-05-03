'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LangCode } from './i18n'
import type { Comment, Notification, VerificationVerdict } from './types'
import { DEFAULT_TOKEN_ALLOCATIONS } from './data'

interface GovTraceStore {
  // Language
  language: LangCode
  setLanguage: (lang: LangCode) => void

  // Privacy toggle
  privacyMode: 'public' | 'private'
  togglePrivacy: () => void

  // Notifications (fetched from Supabase on mount, managed locally for reactivity)
  notifications: Notification[]
  initNotifications: (notifs: Notification[]) => void
  markNotificationRead: (id: string) => void
  markAllRead: () => void

  // Token allocation (100 tokens per citizen)
  tokenAllocations: Record<string, number>
  allocateTokens: (itemId: string, tokens: number) => void

  // Citizen ratings for spending line items
  citizenRatings: Record<string, 'onTrack' | 'neutral' | 'stalled'>
  setRating: (itemId: string, rating: 'onTrack' | 'neutral' | 'stalled') => void

  // Manifesto verifications (one per promise per citizen)
  manifestoVerifications: Record<string, VerificationVerdict>
  setManifestoVerification: (promiseId: string, verdict: VerificationVerdict) => void

  // Comments (fetched from Supabase per thread; new comments added locally)
  comments: Record<string, Comment[]>
  initComments: (threadId: string, comments: Comment[]) => void
  commentInputs: Record<string, string>
  setCommentInput: (threadId: string, text: string) => void
  postLocalComment: (threadId: string, comment: Comment) => void

  // Comment upvotes
  upvotedComments: Record<string, boolean>
  upvoteLocal: (commentId: string, threadId: string, weightDelta: number) => void

  // Spending accordion
  openAccordionId: string | null
  setOpenAccordionId: (id: string | null) => void

  // Bills level tab
  billLevelTab: 'ward' | 'assembly' | 'ls'
  setBillLevelTab: (tab: 'ward' | 'assembly' | 'ls') => void

  // Manifesto rep selector
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

      notifications: [],
      initNotifications: (notifs) => {
        // Only initialise if store is still empty (persisted state wins)
        if (get().notifications.length === 0) set({ notifications: notifs })
      },
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

      comments: {},
      initComments: (threadId, incoming) =>
        set((s) => ({
          // Merge: DB records take priority; locally posted comments (id starts with 'cmt-') are kept
          comments: {
            ...s.comments,
            [threadId]: [
              ...incoming,
              ...(s.comments[threadId] ?? []).filter((c) => c.id.startsWith('cmt-')),
            ],
          },
        })),
      commentInputs: {},
      setCommentInput: (threadId, text) =>
        set((s) => ({ commentInputs: { ...s.commentInputs, [threadId]: text } })),
      postLocalComment: (threadId, comment) =>
        set((s) => ({
          comments: {
            ...s.comments,
            [threadId]: [...(s.comments[threadId] ?? []), comment],
          },
          commentInputs: { ...s.commentInputs, [threadId]: '' },
        })),

      upvotedComments: {},
      upvoteLocal: (commentId, threadId, weightDelta) => {
        if (get().upvotedComments[commentId]) return
        set((s) => ({
          upvotedComments: { ...s.upvotedComments, [commentId]: true },
          comments: {
            ...s.comments,
            [threadId]: (s.comments[threadId] ?? []).map((c) =>
              c.id === commentId ? { ...c, weightedUpvotes: c.weightedUpvotes + weightDelta } : c
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
