import { useState } from 'react'
import { Check, Moon, Printer, Share2, Sun } from 'lucide-react'
import type { DisplayMode } from '../utils/inflation'

type Props = {
  isDark: boolean
  onToggleDark: () => void
  displayMode: DisplayMode
  onToggleDisplayMode: () => void
}

const BUTTON_CLASS =
  'rounded-full p-2 text-stone-700 dark:text-slate-300 hover:bg-amber-200/60 dark:hover:bg-slate-800 transition-colors'

export function HeaderActions({ isDark, onToggleDark, displayMode, onToggleDisplayMode }: Props) {
  const [copied, setCopied] = useState(false)
  const isReal = displayMode === 'real'

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore — some browsers block clipboard without https
    }
  }

  return (
    <div className="ml-auto flex items-center gap-1 print:hidden">
      <button
        type="button"
        onClick={onToggleDisplayMode}
        aria-label={isReal ? 'Switch to nominal pounds' : "Switch to today's pounds"}
        title={isReal ? "Showing today's £ (deflated 2.5% CPI) — click for nominal" : "Showing nominal £ — click for today's pounds"}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
          isReal
            ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-900'
            : 'text-stone-700 dark:text-slate-300 hover:bg-amber-200/60 dark:hover:bg-slate-800'
        }`}
      >
        {isReal ? "Today's £" : 'Nominal £'}
      </button>
      <button
        type="button"
        onClick={share}
        aria-label={copied ? 'Link copied' : 'Copy shareable link'}
        title={copied ? 'Link copied!' : 'Copy shareable link'}
        className={BUTTON_CLASS}
      >
        {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        aria-label="Print"
        title="Print"
        className={BUTTON_CLASS}
      >
        <Printer className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onToggleDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
        className={BUTTON_CLASS}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  )
}
