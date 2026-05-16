import { useEffect, useMemo, useState } from 'react'
import { Home } from 'lucide-react'
import { HeaderActions } from './components/HeaderActions'
import { InputForm } from './components/InputForm'
import { ResultsPanel } from './components/ResultsPanel'
import { SavedScenarios } from './components/SavedScenarios'
import { simulate } from './finance/simulate'
import { readInputsFromUrl, writeInputsToUrl } from './utils/url'

const THEME_STORAGE_KEY = 'house-helper:theme'
const DARK_VARIANT_STORAGE_KEY = 'house-helper:dark-variant'

type DarkVariant = 'warm' | 'neutral' | 'cool'

// All variant classes are spelled out as literal strings so Tailwind's
// class scanner picks them up — never composed dynamically.
const DARK_VARIANTS: Record<
  DarkVariant,
  { label: string; pageBg: string; headerBg: string; iconColor: string }
> = {
  warm: {
    label: 'Warm',
    pageBg: 'dark:bg-stone-950',
    headerBg: 'dark:from-amber-950 dark:via-stone-900 dark:to-stone-950',
    iconColor: 'dark:text-orange-400',
  },
  neutral: {
    label: 'Neutral',
    pageBg: 'dark:bg-zinc-950',
    headerBg: 'dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950',
    iconColor: 'dark:text-orange-400',
  },
  cool: {
    label: 'Cool',
    pageBg: 'dark:bg-slate-950',
    headerBg: 'dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950',
    iconColor: 'dark:text-sky-400',
  },
}

function getInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitialDarkVariant(): DarkVariant {
  if (typeof window === 'undefined') return 'warm'
  const stored = window.localStorage.getItem(DARK_VARIANT_STORAGE_KEY)
  if (stored === 'warm' || stored === 'neutral' || stored === 'cool') return stored
  return 'warm'
}

function App() {
  const [inputs, setInputs] = useState(() => readInputsFromUrl())
  const [isDark, setIsDark] = useState(getInitialDark)
  const [darkVariant, setDarkVariant] = useState<DarkVariant>(getInitialDarkVariant)

  useEffect(() => {
    writeInputsToUrl(inputs)
  }, [inputs])

  // Follow OS theme changes live — only when no manual override is stored
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') return
      setIsDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  function toggleDark() {
    setIsDark((d) => {
      const next = !d
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  function pickDarkVariant(v: DarkVariant) {
    setDarkVariant(v)
    try {
      window.localStorage.setItem(DARK_VARIANT_STORAGE_KEY, v)
    } catch {
      /* ignore */
    }
  }

  const result = useMemo(() => simulate(inputs), [inputs])
  const variant = DARK_VARIANTS[darkVariant]

  return (
    <div
      className={`${isDark ? 'dark' : ''} min-h-screen bg-amber-50/40 ${variant.pageBg} text-stone-900 dark:text-stone-100`}
    >
      <header
        className={`bg-gradient-to-br from-amber-100 to-orange-100 ${variant.headerBg} border-b border-amber-200 dark:border-stone-800`}
      >
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <Home
              className={`h-8 w-8 text-orange-600 ${variant.iconColor}`}
              aria-hidden="true"
            />
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-amber-50">
              House Helper
            </h1>
            <HeaderActions isDark={isDark} onToggleDark={toggleDark} />
          </div>
          <p className="mt-2 text-sm text-stone-700 dark:text-amber-200/80">
            UK buy-vs-rent calculator for owner-occupiers. All numbers editable. Stamp duty rates: April 2025.
          </p>
          {isDark && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs print:hidden">
              <span className="text-stone-400">Dark style:</span>
              {(Object.keys(DARK_VARIANTS) as DarkVariant[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => pickDarkVariant(v)}
                  className={
                    darkVariant === v
                      ? 'bg-amber-100 text-stone-900 px-2.5 py-0.5 rounded-full font-medium'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800 px-2.5 py-0.5 rounded-full'
                  }
                >
                  {DARK_VARIANTS[v].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <SavedScenarios current={inputs} onLoad={setInputs} />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
          <section>
            <InputForm inputs={inputs} onChange={setInputs} />
          </section>
          <section>
            <ResultsPanel
              inputs={inputs}
              result={result}
              horizonYears={inputs.yearsToSimulate}
              isDark={isDark}
            />
          </section>
        </div>

        <footer className="mt-16 border-t border-stone-200 dark:border-stone-800 pt-6 text-xs text-stone-600 dark:text-stone-500">
          <p>
            This is a model, not advice. Tax rules and market rates change — verify
            anything load-bearing. Stamp duty covers England &amp; Northern Ireland only
            (Scotland and Wales have their own equivalents).
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
