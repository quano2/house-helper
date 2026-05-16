import { useState } from 'react'
import { Check, Moon, Printer, Share2, Sun } from 'lucide-react'

type Props = {
  isDark: boolean
  onToggleDark: () => void
  toggleClass: string
}

export function HeaderActions({ isDark, onToggleDark, toggleClass }: Props) {
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
        className={toggleClass}
      >
        {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        aria-label="Print"
        title="Print"
        className={toggleClass}
      >
        <Printer className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onToggleDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
        className={toggleClass}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  )
}
