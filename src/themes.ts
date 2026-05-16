import type { LucideIcon } from 'lucide-react'
import { Flame } from 'lucide-react'

export type ThemeId = 'warm' | 'warm-dark'

export type ThemeTokens = {
  id: ThemeId
  label: string
  logoIcon: LucideIcon

  pageBg: string
  // Header
  headerWrapper: string
  headerInner: string
  headerTitleClass: string
  headerSubtitleClass: string
  headerIconClass: string
  // Dark-mode toggle button style (sits in the header)
  toggleClass: string
  // Optional wrapper for the form column (dark needs a light card)
  formColumnWrapper: string
  // Verdict card
  verdictBuy: string
  verdictRent: string
  verdictAccentBuy: string
  verdictAccentRent: string
  // Footer
  footerClass: string
}

export const themes: Record<ThemeId, ThemeTokens> = {
  warm: {
    id: 'warm',
    label: 'Warm',
    logoIcon: Flame,
    pageBg: 'bg-amber-50/40',
    headerWrapper: 'bg-gradient-to-br from-amber-100 to-orange-100 border-b border-amber-200',
    headerInner: 'mx-auto max-w-6xl px-6 py-8',
    headerTitleClass: 'text-3xl font-semibold tracking-tight text-stone-900',
    headerSubtitleClass: 'mt-2 text-sm text-stone-700',
    headerIconClass: 'h-8 w-8 text-orange-600',
    toggleClass: 'rounded-full p-2 text-stone-700 hover:bg-amber-200/60 transition-colors',
    formColumnWrapper: '',
    verdictBuy: 'border-emerald-300 bg-emerald-50',
    verdictRent: 'border-amber-400 bg-amber-50',
    verdictAccentBuy: 'text-emerald-800',
    verdictAccentRent: 'text-amber-800',
    footerClass: 'text-stone-600',
  },
  'warm-dark': {
    id: 'warm-dark',
    label: 'Warm Dark',
    logoIcon: Flame,
    pageBg: 'bg-stone-950',
    headerWrapper: 'bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 border-b border-stone-800',
    headerInner: 'mx-auto max-w-6xl px-6 py-8',
    headerTitleClass: 'text-3xl font-semibold tracking-tight text-amber-50',
    headerSubtitleClass: 'mt-2 text-sm text-amber-200/70',
    headerIconClass: 'h-8 w-8 text-orange-400',
    toggleClass: 'rounded-full p-2 text-amber-200 hover:bg-stone-800 transition-colors',
    // Wrap the form column in a light card on dark page
    formColumnWrapper: 'rounded-2xl bg-white p-6 shadow-2xl shadow-amber-950/30',
    verdictBuy: 'border-emerald-300 bg-emerald-50',
    verdictRent: 'border-amber-400 bg-amber-50',
    verdictAccentBuy: 'text-emerald-800',
    verdictAccentRent: 'text-amber-800',
    footerClass: 'text-stone-400',
  },
}
