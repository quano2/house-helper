import { useMemo, useState } from 'react'
import { InputForm } from './components/InputForm'
import { ResultsPanel } from './components/ResultsPanel'
import { defaultInputs } from './finance/defaults'
import { simulate } from './finance/simulate'

function App() {
  const [inputs, setInputs] = useState(defaultInputs)
  const result = useMemo(() => simulate(inputs), [inputs])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-semibold tracking-tight">House Helper</h1>
          <p className="mt-2 text-sm text-indigo-100">
            UK buy-vs-rent calculator for owner-occupiers. All numbers editable. Tax model: April 2025 SDLT.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
          <section>
            <InputForm inputs={inputs} onChange={setInputs} />
          </section>
          <section>
            <ResultsPanel result={result} horizonYears={inputs.yearsToSimulate} />
          </section>
        </div>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>
            This is a model, not advice. Tax rules and market rates change — verify
            anything load-bearing. SDLT covers England &amp; Northern Ireland only
            (Scotland LBTT and Wales LTT differ).
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
