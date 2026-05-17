import type { Inputs, SimulationResult } from '../finance/types'
import type { DisplayMode } from '../utils/inflation'
import { InputForm } from '../components/InputForm'
import { ResultsPanel } from '../components/ResultsPanel'
import { SavedScenarios } from '../components/SavedScenarios'

type Props = {
  inputs: Inputs
  setInputs: (inputs: Inputs) => void
  result: SimulationResult
  isDark: boolean
  displayMode: DisplayMode
}

export function CalculatorView({ inputs, setInputs, result, isDark, displayMode }: Props) {
  return (
    <>
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
            displayMode={displayMode}
          />
        </section>
      </div>
    </>
  )
}
