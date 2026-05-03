/**
 * GovTrace — Supabase data layer
 * All DB columns are snake_case; we map to camelCase TypeScript types.
 */

import { supabase } from './supabase'
import type {
  Citizen,
  Representative,
  Bill,
  SpendingItem,
  SpendingLineItem,
  BudgetActual,
  AgendaItem,
  ManifestoPromise,
  Comment,
  Notification,
  ForumAgendaItem,
} from './types'

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapCitizen(r: any): Citizen {
  return {
    id: r.id,
    maskedPanId: r.masked_pan_id,
    name: r.name,
    annualIncome: r.annual_income,
    directTax: r.direct_tax,
    indirectTax: r.indirect_tax,
    totalTax: r.total_tax,
    taxBracket: r.tax_bracket,
    occupationType: r.occupation_type,
    avatarInitials: r.avatar_initials,
    tracesVerified: r.traces_verified,
  }
}

function mapRepresentative(r: any): Representative {
  return {
    id: r.id,
    level: r.level,
    name: r.name,
    party: r.party,
    constituency: r.constituency,
    constituencyBody: r.constituency_body,
    constituencyTaxPool: r.constituency_tax_pool,
    houseVoteWeight: r.house_vote_weight,
    elected: r.elected,
    term: r.term,
    photoInitials: r.photo_initials,
    bio: r.bio,
  }
}

function mapBill(r: any): Bill {
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    level: r.level,
    description: r.description,
    repVote: r.rep_vote,
    repId: r.rep_id,
    ayeCount: r.aye_count,
    nayCount: r.nay_count,
    abstainCount: r.abstain_count,
    result: r.result,
  }
}

function mapSpendingLineItem(r: any): SpendingLineItem {
  return {
    id: r.id,
    name: r.name,
    amount: r.amount,
    pctOfHead: r.pct_of_head,
    status: r.status,
    daysInStatus: r.days_in_status,
    vendor: r.vendor,
    vendorLink: r.vendor_link,
    citizenRatings: {
      onTrack: r.ratings_on_track,
      neutral: r.ratings_neutral,
      stalled: r.ratings_stalled,
    },
  }
}

function mapBudgetActual(r: any): BudgetActual {
  return {
    id: r.id,
    head: r.head,
    budgeted: r.budgeted,
    actual: r.actual,
    accentColor: r.accent_color,
  }
}

function mapAgendaItem(r: any): AgendaItem {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    raisedBy: r.raised_by,
    level: r.level,
    cumulativeWeightedVote: r.cumulative_weighted_vote,
  }
}

function mapManifestoPromise(r: any): ManifestoPromise {
  return {
    id: r.id,
    repId: r.rep_id,
    promise: r.promise,
    status: r.status,
    evidence: r.evidence,
    citizenVerifications: {
      delivered: r.verifications_delivered,
      partial: r.verifications_partial,
      not: r.verifications_not,
    },
  }
}

function mapComment(r: any): Comment {
  return {
    id: r.id,
    maskedPanId: r.masked_pan_id,
    name: r.name,
    avatarInitials: r.avatar_initials,
    taxContribution: r.tax_contribution,
    text: r.text,
    weightedUpvotes: r.weighted_upvotes,
    timestamp: r.created_at,
  }
}

function mapNotification(r: any): Notification {
  return {
    id: r.id,
    type: r.type,
    read: r.read,
    timestamp: r.timestamp,
    title: r.title,
    description: r.description,
    targetTab: r.target_tab,
  }
}

function mapForumAgendaItem(r: any): ForumAgendaItem {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    level: r.level,
    aggregatedTokens: r.aggregated_tokens,
    topRaisedBy: r.top_raised_by,
  }
}

// ─── Read queries ─────────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<Citizen | null> {
  const { data, error } = await supabase
    .from('citizens')
    .select('*')
    .eq('id', 'c1')
    .single()
  if (error) { console.error('getCurrentUser:', error.message); return null }
  return mapCitizen(data)
}

export async function getCitizens(): Promise<Citizen[]> {
  const { data, error } = await supabase.from('citizens').select('*').order('id')
  if (error) { console.error('getCitizens:', error.message); return [] }
  return (data ?? []).map(mapCitizen)
}

export async function getRepresentatives(): Promise<Representative[]> {
  const { data, error } = await supabase.from('representatives').select('*').order('id')
  if (error) { console.error('getRepresentatives:', error.message); return [] }
  return (data ?? []).map(mapRepresentative)
}

export async function getBills(): Promise<Bill[]> {
  const { data, error } = await supabase.from('bills').select('*').order('date', { ascending: false })
  if (error) { console.error('getBills:', error.message); return [] }
  return (data ?? []).map(mapBill)
}

export async function getSpendingWithLineItems(): Promise<SpendingItem[]> {
  const [{ data: items, error: e1 }, { data: lineItems, error: e2 }] = await Promise.all([
    supabase.from('spending_items').select('*').order('id'),
    supabase.from('spending_line_items').select('*').order('id'),
  ])
  if (e1) console.error('getSpendingItems:', e1.message)
  if (e2) console.error('getSpendingLineItems:', e2.message)

  return (items ?? []).map((item) => ({
    id: item.id,
    head: item.head,
    pct: item.pct,
    amount: item.amount,
    accentColor: item.accent_color,
    items: (lineItems ?? [])
      .filter((li) => li.spending_item_id === item.id)
      .map(mapSpendingLineItem),
  }))
}

export async function getBudgetActuals(): Promise<BudgetActual[]> {
  const { data, error } = await supabase.from('budget_actuals').select('*').order('id')
  if (error) { console.error('getBudgetActuals:', error.message); return [] }
  return (data ?? []).map(mapBudgetActual)
}

export async function getAgendaItems(): Promise<AgendaItem[]> {
  const { data, error } = await supabase
    .from('agenda_items')
    .select('*')
    .order('cumulative_weighted_vote', { ascending: false })
  if (error) { console.error('getAgendaItems:', error.message); return [] }
  return (data ?? []).map(mapAgendaItem)
}

export async function getManifestoPromises(repId?: string): Promise<ManifestoPromise[]> {
  let query = supabase.from('manifesto_promises').select('*').order('id')
  if (repId) query = query.eq('rep_id', repId)
  const { data, error } = await query
  if (error) { console.error('getManifestoPromises:', error.message); return [] }
  return (data ?? []).map(mapManifestoPromise)
}

export async function getComments(threadId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('thread_id', threadId)
    .order('weighted_upvotes', { ascending: false })
  if (error) { console.error('getComments:', error.message); return [] }
  return (data ?? []).map(mapComment)
}

export async function getNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('timestamp', { ascending: false })
  if (error) { console.error('getNotifications:', error.message); return [] }
  return (data ?? []).map(mapNotification)
}

export async function getForumAgenda(): Promise<ForumAgendaItem[]> {
  const { data, error } = await supabase
    .from('forum_agenda')
    .select('*')
    .order('aggregated_tokens', { ascending: false })
  if (error) { console.error('getForumAgenda:', error.message); return [] }
  return (data ?? []).map(mapForumAgendaItem)
}

// ─── Write queries ────────────────────────────────────────────────────────────

export async function postComment(comment: {
  threadId: string
  maskedPanId: string
  name: string
  avatarInitials: string
  taxContribution: number
  text: string
}): Promise<Comment | null> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      thread_id:       comment.threadId,
      masked_pan_id:   comment.maskedPanId,
      name:            comment.name,
      avatar_initials: comment.avatarInitials,
      tax_contribution: comment.taxContribution,
      text:            comment.text,
      weighted_upvotes: 0,
    })
    .select()
    .single()
  if (error) { console.error('postComment:', error.message); return null }
  return mapComment(data)
}

export async function upvoteComment(commentId: string, weightDelta: number): Promise<void> {
  // Fetch current value, then increment
  const { data } = await supabase
    .from('comments')
    .select('weighted_upvotes')
    .eq('id', commentId)
    .single()
  if (!data) return
  await supabase
    .from('comments')
    .update({ weighted_upvotes: (data.weighted_upvotes ?? 0) + weightDelta })
    .eq('id', commentId)
}

export async function markNotificationReadDB(id: string): Promise<void> {
  await supabase.from('notifications').update({ read: true }).eq('id', id)
}

export async function markAllNotificationsReadDB(): Promise<void> {
  await supabase.from('notifications').update({ read: true }).eq('read', false)
}

export async function updateSpendingLineItemRatings(
  id: string,
  field: 'ratings_on_track' | 'ratings_neutral' | 'ratings_stalled',
): Promise<void> {
  // Fetch current, increment
  const { data } = await supabase
    .from('spending_line_items')
    .select(field)
    .eq('id', id)
    .single()
  if (!data) return
  const current = (data as any)[field] ?? 0
  await supabase
    .from('spending_line_items')
    .update({ [field]: current + 1 })
    .eq('id', id)
}

export async function updateManifestoVerification(
  id: string,
  field: 'verifications_delivered' | 'verifications_partial' | 'verifications_not',
): Promise<void> {
  const { data } = await supabase
    .from('manifesto_promises')
    .select(field)
    .eq('id', id)
    .single()
  if (!data) return
  const current = (data as any)[field] ?? 0
  await supabase
    .from('manifesto_promises')
    .update({ [field]: current + 1 })
    .eq('id', id)
}

export async function addAgendaVote(id: string, voteWeight: number): Promise<void> {
  const { data } = await supabase
    .from('agenda_items')
    .select('cumulative_weighted_vote')
    .eq('id', id)
    .single()
  if (!data) return
  await supabase
    .from('agenda_items')
    .update({ cumulative_weighted_vote: (data.cumulative_weighted_vote ?? 0) + voteWeight })
    .eq('id', id)
}
