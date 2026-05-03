// ─── Core domain types ───────────────────────────────────────────────────────

export interface Citizen {
  id: string
  maskedPanId: string
  name: string
  annualIncome: number
  directTax: number
  indirectTax: number
  totalTax: number
  taxBracket: string
  occupationType: string
  avatarInitials: string
  tracesVerified: boolean
}

export interface Constituency {
  name: string
  body: string
  totalTaxPool: number
}

export interface Constituencies {
  ward: Constituency
  assembly: Constituency
  lokSabha: Constituency
  rajyaSabha: Constituency
}

export type RepLevel = 'ward' | 'assembly' | 'ls' | 'rs'
export type PartyCode = 'BJP' | 'INC' | 'JDU' | 'AAP' | 'IND'

export interface Representative {
  id: string
  level: RepLevel
  name: string
  party: PartyCode
  constituency: string
  constituencyBody: string
  constituencyTaxPool: number
  houseVoteWeight: number
  elected: string
  term: string
  photoInitials: string
  bio: string
}

// ─── Bills ────────────────────────────────────────────────────────────────────

export type BillLevel = 'ward' | 'assembly' | 'ls'
export type VoteResult = 'passed' | 'failed'
export type RepVote = 'aye' | 'nay' | 'abstain'

export interface Bill {
  id: string
  title: string
  date: string
  level: BillLevel
  description: string
  repVote: RepVote
  repId: string
  ayeCount: number
  nayCount: number
  abstainCount: number
  result: VoteResult
}

// ─── Spending ─────────────────────────────────────────────────────────────────

export type SpendingStatus =
  | 'Completed'
  | 'Under Construction'
  | 'Tendered'
  | 'Allocated'
  | 'Stalled'

export interface CitizenRatings {
  onTrack: number
  neutral: number
  stalled: number
}

export interface SpendingLineItem {
  id: string
  name: string
  amount: number
  pctOfHead: number
  status: SpendingStatus
  daysInStatus: number
  vendor: string
  vendorLink: string
  citizenRatings: CitizenRatings
}

export interface SpendingItem {
  id: string
  head: string
  pct: number
  amount: number
  accentColor: string
  items: SpendingLineItem[]
}

// ─── Budget vs Actuals ────────────────────────────────────────────────────────

export type BudgetStatus = 'onTrack' | 'overspent' | 'underspent'

export interface BudgetActual {
  id: string
  head: string
  budgeted: number
  actual: number
  accentColor: string
}

// ─── Agenda ───────────────────────────────────────────────────────────────────

export type AgendaLevel = 'ward' | 'assembly' | 'ls'

export interface AgendaItem {
  id: string
  title: string
  description: string
  raisedBy: string
  level: AgendaLevel
  cumulativeWeightedVote: number
}

// ─── Manifesto ────────────────────────────────────────────────────────────────

export type ManifestoStatus = 'delivered' | 'partial' | 'not' | 'allocated'
export type VerificationVerdict = 'delivered' | 'partial' | 'not'

export interface ManifestoVerificationTally {
  delivered: number
  partial: number
  not: number
}

export interface ManifestoPromise {
  id: string
  repId: string
  promise: string
  status: ManifestoStatus
  evidence: string
  citizenVerifications: ManifestoVerificationTally
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string
  maskedPanId: string
  name: string
  avatarInitials: string
  taxContribution: number
  text: string
  weightedUpvotes: number
  timestamp: string
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'bill' | 'status' | 'agenda'

export interface Notification {
  id: string
  type: NotificationType
  read: boolean
  timestamp: string
  title: string
  description: string
  targetTab: string
}

// ─── Trust chain ──────────────────────────────────────────────────────────────

export interface TrustDataSource {
  name: string
  description: string
  owner: string
  url: string
  usage: string
}

// ─── Vote weights (computed) ──────────────────────────────────────────────────

export interface VoteWeights {
  ward: number
  assembly: number
  lokSabha: number
}

// ─── Forum (Citizen Forum) ────────────────────────────────────────────────────

export interface ForumAgendaItem {
  id: string
  title: string
  description: string
  level: AgendaLevel
  aggregatedTokens: number
  topRaisedBy: string
}
