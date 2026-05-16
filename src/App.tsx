import { useMemo, useState } from 'react'
import { InputForm } from './components/InputForm'
import { ResultsPanel } from './components/ResultsPanel'
import { ThemePicker } from './components/ThemePicker'
import { defaultInputs } from './finance/defaults'
import { simulate } from './finance/simulate'
import { themes, type ThemeId } from './themes'

function App() {
  const [inputs, setInputs] = useState(defaultInputs)
  const [themeId, setThemeId] = useState<ThemeId>('pop')
  const theme = themes[themeId]
  const Logo = theme.logoIcon

  const result = useMemo(() => simulate(inputs), [inputs])

  return (
    <div className={`min-h-screen text-slate-900 ${theme.pageBg}`}>
      <ThemePicker theme={themeId} onChange={setThemeId} />

      <header className={theme.headerWrapper}>
        <div className={theme.headerInner}>
          <div className="flex items-center gap-3">
            <Logo className={theme.headerIconClass} aria-hidden="true" />
            <h1 className={theme.headerTitleClass}>House Helper</h1>
          </div>
          <p className={theme.headerSubtitleClass}>
            UK buy-vs-rent calculator for owner-occupiers. All numbers editable. Stamp duty rates: April 2025.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
          <section className={theme.formColumnWrapper}>
            <InputForm inputs={inputs} onChange={setInputs} />
          </section>
          <section>
            <ResultsPanel
              result={result}
              horizonYears={inputs.yearsToSimulate}
              theme={theme}
            />
          </section>
        </div>

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

export default App
