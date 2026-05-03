import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCrore(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`
  if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(2)} L`
  if (amount >= 1_000)      return `₹${(amount / 1_000).toFixed(1)}K`
  return `₹${amount}`
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPct(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30)  return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export function clampTokens(allocations: Record<string, number>): number {
  return Object.values(allocations).reduce((a, b) => a + b, 0)
}
