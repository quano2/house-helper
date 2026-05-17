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

  const segBase =
    'px-2.5 py-1 text-xs font-semibold rounded-full transition-colors'
  const segActive =
    'bg-orange-200/80 text-orange-900 shadow-sm dark:bg-sky-700 dark:text-sky-50'
  const segInactive =
    'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'

  return (
    <div className="ml-auto flex items-center gap-2 print:hidden">
      <div
        role="group"
        aria-label="Display in nominal or today's pounds"
        title="Nominal £ = future pounds. Today's £ = deflated at 2.5% CPI."
        className="flex items-center gap-0.5 rounded-full bg-amber-100/80 dark:bg-slate-800 p-0.5"
      >
        <button
          type="button"
          onClick={() => { if (isReal) onToggleDisplayMode() }}
          aria-pressed={!isReal}
          className={`${segBase} ${!isReal ? segActive : segInactive}`}
        >
          Nominal £
        </button>
        <button
          type="button"
          onClick={() => { if (!isReal) onToggleDisplayMode() }}
          aria-pressed={isReal}
          className={`${segBase} ${isReal ? segActive : segInactive}`}
        >
          Today's £
        </button>
      </div>
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
