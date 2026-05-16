import { useMemo, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { InputForm } from './components/InputForm'
import { LayoutPicker } from './components/LayoutPicker'
import { ResultsPanel } from './components/ResultsPanel'
import { defaultInputs } from './finance/defaults'
import { simulate } from './finance/simulate'
import { themes } from './themes'
import type { LayoutId } from './layouts'

function App() {
  const [inputs, setInputs] = useState(defaultInputs)
  const [isDark, setIsDark] = useState(false)
  const [layout, setLayout] = useState<LayoutId>('side-by-side')

  const theme = themes[isDark ? 'warm-dark' : 'warm']
  const Logo = theme.logoIcon
  const result = useMemo(() => simulate(inputs), [inputs])

  // Form takes a denser field grid when laid out full-width
  const fieldColumnsClass =
    layout === 'stacked'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2'

  const formCol = (
    <section className={theme.formColumnWrapper}>
      <InputForm inputs={inputs} onChange={setInputs} fieldColumnsClass={fieldColumnsClass} />
    </section>
  )

  const resultsCol = (
    <section>
      <ResultsPanel
        result={result}
        horizonYears={inputs.yearsToSimulate}
        theme={theme}
      />
    </section>
  )

  return (
    <div className={`min-h-screen text-slate-900 ${theme.pageBg}`}>
      <LayoutPicker layout={layout} onChange={setLayout} />

      <header className={theme.headerWrapper}>
        <div className={theme.headerInner}>
          <div className="flex items-center gap-3">
            <Logo className={theme.headerIconClass} aria-hidden="true" />
            <h1 className={theme.headerTitleClass}>House Helper</h1>
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`ml-auto ${theme.toggleClass}`}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <p className={theme.headerSubtitleClass}>
            UK buy-vs-rent calculator for owner-occupiers. All numbers editable. Stamp duty rates: April 2025.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <LayoutBody layout={layout} formCol={formCol} resultsCol={resultsCol} />

        <footer className={`mt-16 border-t border-slate-200 pt-6 text-xs ${theme.footerClass}`}>
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

function LayoutBody({
  layout,
  formCol,
  resultsCol,
}: {
  layout: LayoutId
  formCol: ReactNode
  resultsCol: ReactNode
}) {
  switch (layout) {
    case 'side-by-side':
      return (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
          {formCol}
          {resultsCol}
        </div>
      )
    case 'stacked':
      return (
        <div className="space-y-10">
          {formCol}
          {resultsCol}
        </div>
      )
    case 'verdict-first':
      return (
        <div className="space-y-10">
          {resultsCol}
          {formCol}
        </div>
      )
    case 'centered':
      return (
        <div className="mx-auto max-w-2xl space-y-10">
          {formCol}
          {resultsCol}
        </div>
      )
  }
}

export default App
