'use client'
import { useStore } from '@/lib/store'
import { CURRENT_USER } from '@/lib/data'
import { timeAgo, formatCrore } from '@/lib/utils'

interface CommentThreadProps {
  threadId: string
}

export function CommentThread({ threadId }: CommentThreadProps) {
  const {
    comments,
    commentInputs,
    setCommentInput,
    postComment,
    upvotedComments,
    upvoteComment,
  } = useStore()

  const threadComments = [...(comments[threadId] ?? [])].sort(
    (a, b) => b.weightedUpvotes - a.weightedUpvotes
  )
  const inputText = commentInputs[threadId] ?? ''

  function handlePost() {
    if (!inputText.trim()) return
    postComment(threadId, inputText.trim(), {
      maskedPanId:    CURRENT_USER.maskedPanId,
      name:           CURRENT_USER.name,
      avatarInitials: CURRENT_USER.avatarInitials,
      totalTax:       CURRENT_USER.totalTax,
    })
  }

  function handleUpvote(commentId: string) {
    if (upvotedComments[commentId]) return
    upvoteComment(commentId, threadId, CURRENT_USER.totalTax)
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
                  disabled={!!upvotedComments[c.id]}
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
            disabled={!inputText.trim()}
            style={{
              background: !inputText.trim() ? '#6b7280' : '#000080', color: '#fff', fontSize: 11,
              fontWeight: 600, padding: '4px 12px', borderRadius: 4, border: 'none',
              cursor: !inputText.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  )
}
