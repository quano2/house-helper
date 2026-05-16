import type { LucideIcon } from 'lucide-react'
import { Home, Newspaper, Flame, Moon } from 'lucide-react'

export type ThemeId = 'pop' | 'editorial' | 'warm' | 'midnight'

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
  // Optional wrapper for the form column (dark themes need it)
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
  pop: {
    id: 'pop',
    label: 'Indigo Pop',
    logoIcon: Home,
    pageBg: 'bg-slate-50',
    headerWrapper: 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm',
    headerInner: 'mx-auto max-w-6xl px-6 py-8',
    headerTitleClass: 'text-3xl font-semibold tracking-tight',
    headerSubtitleClass: 'mt-2 text-sm text-indigo-100',
    headerIconClass: 'h-8 w-8 text-white',
    formColumnWrapper: '',
    verdictBuy: 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100',
    verdictRent: 'border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100',
    verdictAccentBuy: 'text-emerald-700',
    verdictAccentRent: 'text-rose-700',
    footerClass: 'text-slate-500',
  },
  editorial: {
    id: 'editorial',
    label: 'Editorial',
    logoIcon: Newspaper,
    pageBg: 'bg-white',
    headerWrapper: 'border-b border-slate-200 bg-white',
    headerInner: 'mx-auto max-w-6xl px-6 py-12',
    headerTitleClass: 'text-5xl font-serif font-medium text-slate-900 tracking-tight',
    headerSubtitleClass: 'mt-4 text-base text-slate-500 max-w-xl font-serif italic',
    headerIconClass: 'h-7 w-7 text-slate-700',
    formColumnWrapper: '',
    verdictBuy: 'border-l-4 border-l-emerald-600 border border-slate-200 bg-white',
    verdictRent: 'border-l-4 border-l-rose-600 border border-slate-200 bg-white',
    verdictAccentBuy: 'text-emerald-700',
    verdictAccentRent: 'text-rose-700',
    footerClass: 'text-slate-500 font-serif italic',
  },
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
    formColumnWrapper: '',
    verdictBuy: 'border-emerald-300 bg-emerald-50',
    verdictRent: 'border-amber-400 bg-amber-50',
    verdictAccentBuy: 'text-emerald-800',
    verdictAccentRent: 'text-amber-800',
    footerClass: 'text-stone-600',
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    logoIcon: Moon,
    pageBg: 'bg-slate-950',
    headerWrapper:
      'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800',
    headerInner: 'mx-auto max-w-6xl px-6 py-8',
    headerTitleClass: 'text-3xl font-semibold tracking-tight text-white',
    headerSubtitleClass: 'mt-2 text-sm text-slate-400',
    headerIconClass: 'h-8 w-8 text-sky-300',
    // Wrap the form column in a white card so the inputs stay readable on dark page
    formColumnWrapper: 'rounded-2xl bg-white p-6 shadow-2xl shadow-indigo-950/40',
    verdictBuy: 'border-sky-400 bg-gradient-to-br from-sky-50 to-emerald-50',
    verdictRent: 'border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50',
    verdictAccentBuy: 'text-sky-700',
    verdictAccentRent: 'text-rose-700',
    footerClass: 'text-slate-500',
  },
}

export const themeList: ThemeTokens[] = [
  themes.pop,
  themes.editorial,
  themes.warm,
  themes.midnight,
]
