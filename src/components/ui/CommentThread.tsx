'use client'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { getComments, postComment as postCommentDB, upvoteComment as upvoteCommentDB } from '@/lib/queries'
import { getCurrentUser } from '@/lib/queries'
import { timeAgo, formatCrore } from '@/lib/utils'
import type { Citizen } from '@/lib/types'

interface CommentThreadProps {
  threadId: string
}

export function CommentThread({ threadId }: CommentThreadProps) {
  const {
    comments,
    initComments,
    commentInputs,
    setCommentInput,
    postLocalComment,
    upvotedComments,
    upvoteLocal,
  } = useStore()

  const [user, setUser]   = useState<Citizen | null>(null)
  const [posting, setPosting] = useState(false)

  // Fetch current user once
  useEffect(() => {
    getCurrentUser().then((u) => { if (u) setUser(u) })
  }, [])

  // Fetch comments for this thread and init store
  useEffect(() => {
    getComments(threadId).then((loaded) => {
      initComments(threadId, loaded)
    })
  }, [threadId, initComments])

  const threadComments = [...(comments[threadId] ?? [])].sort(
    (a, b) => b.weightedUpvotes - a.weightedUpvotes
  )
  const inputText = commentInputs[threadId] ?? ''

  async function handlePost() {
    if (!inputText.trim() || !user) return
    setPosting(true)

    // Optimistic local update
    const optimisticComment = {
      id: `cmt-${Date.now()}`,
      maskedPanId: user.maskedPanId,
      name: user.name,
      avatarInitials: user.avatarInitials,
      taxContribution: user.totalTax,
      text: inputText.trim(),
      weightedUpvotes: 0,
      timestamp: new Date().toISOString(),
    }
    postLocalComment(threadId, optimisticComment)

    // Write to DB
    await postCommentDB({
      threadId,
      maskedPanId:   user.maskedPanId,
      name:          user.name,
      avatarInitials: user.avatarInitials,
      taxContribution: user.totalTax,
      text:          inputText.trim(),
    })

    setPosting(false)
  }

  async function handleUpvote(commentId: string) {
    if (!user || upvotedComments[commentId]) return
    const weight = Math.max(1, Math.round(user.totalTax / 100_000))
    upvoteLocal(commentId, threadId, weight)
    await upvoteCommentDB(commentId, weight)
  }

  return (
    <div style={{ borderTop: '0.5px solid #e0e4ec', background: '#f5f7fa' }}>
      {/* Comment list */}
      {threadComments.length > 0 && (
        <div className="p-3 flex flex-col gap-3">
          {threadComments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ width: 28, height: 28, background: '#e8eaf6', color: '#000080', fontSize: 11, fontWeight: 700 }}
              >
                {c.avatarInitials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#000080' }}>{c.maskedPanId}</span>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>{timeAgo(c.timestamp)}</span>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>· {formatCrore(c.taxContribution)} taxpayer</span>
                </div>
                <p style={{ fontSize: 12, color: '#1a1a2e', lineHeight: 1.6, margin: '2px 0' }}>{c.text}</p>
                <button
                  onClick={() => handleUpvote(c.id)}
                  disabled={!!upvotedComments[c.id] || !user}
                  style={{
                    border: '0.5px solid #e0e4ec', borderRadius: 99, padding: '2px 10px', fontSize: 11,
                    background: upvotedComments[c.id] ? '#e8eaf6' : 'white',
                    cursor: upvotedComments[c.id] ? 'default' : 'pointer', color: '#374151',
                  }}
                >
                  ▲ {c.weightedUpvotes.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 pt-0 flex flex-col gap-2">
        <textarea
          value={inputText}
          onChange={(e) => setCommentInput(threadId, e.target.value)}
          placeholder="Share your view on this agenda item…"
          rows={2}
          style={{
            width: '100%', border: '0.5px solid #e0e4ec', borderRadius: 4,
            padding: '8px 10px', fontSize: 12, resize: 'vertical',
            fontFamily: 'inherit', background: '#fff', color: '#1a1a2e',
          }}
        />
        <div className="flex justify-between items-center">
          <span style={{ fontSize: 10, color: '#9ca3af' }}>Upvote weight proportional to tax contribution</span>
          <button
            onClick={handlePost}
            disabled={posting || !inputText.trim() || !user}
            style={{
              background: posting ? '#6b7280' : '#000080', color: '#fff', fontSize: 11,
              fontWeight: 600, padding: '4px 12px', borderRadius: 4, border: 'none',
              cursor: posting || !inputText.trim() || !user ? 'not-allowed' : 'pointer',
            }}
          >
            {posting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  )
}
