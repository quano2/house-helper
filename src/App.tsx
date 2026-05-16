import { useEffect, useMemo, useState } from 'react'
import { Home } from 'lucide-react'
import { HeaderActions } from './components/HeaderActions'
import { InputForm } from './components/InputForm'
import { ResultsPanel } from './components/ResultsPanel'
import { SavedScenarios } from './components/SavedScenarios'
import { simulate } from './finance/simulate'
import { readInputsFromUrl, writeInputsToUrl } from './utils/url'

function App() {
  const [inputs, setInputs] = useState(() => readInputsFromUrl())
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    writeInputsToUrl(inputs)
  }, [inputs])

  const result = useMemo(() => simulate(inputs), [inputs])

  return (
    <div
      className={`${isDark ? 'dark' : ''} min-h-screen bg-amber-50/40 dark:bg-stone-950 text-stone-900 dark:text-stone-100`}
    >
      <header className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:via-stone-900 dark:to-stone-950 border-b border-amber-200 dark:border-stone-800">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center gap-3">
            <Home className="h-8 w-8 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-amber-50">
              House Helper
            </h1>
            <HeaderActions isDark={isDark} onToggleDark={() => setIsDark((d) => !d)} />
          </div>
          <p className="mt-2 text-sm text-stone-700 dark:text-amber-200/80">
            UK buy-vs-rent calculator for owner-occupiers. All numbers editable. Stamp duty rates: April 2025.
          </p>
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
