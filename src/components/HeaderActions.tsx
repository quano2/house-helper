import { useState } from 'react'
import { Check, Moon, Printer, Share2, Sun } from 'lucide-react'

type Props = {
  isDark: boolean
  onToggleDark: () => void
}

const BUTTON_CLASS =
  'rounded-full p-2 text-stone-700 dark:text-amber-200 hover:bg-amber-200/60 dark:hover:bg-stone-800 transition-colors'

export function HeaderActions({ isDark, onToggleDark }: Props) {
  const [copied, setCopied] = useState(false)

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
