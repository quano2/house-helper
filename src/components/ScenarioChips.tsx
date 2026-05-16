import type { Inputs } from '../finance/types'
import { scenarios } from '../finance/scenarios'

type Props = {
  current: Inputs
  onSelect: (inputs: Inputs) => void
}

export function ScenarioChips({ current, onSelect }: Props) {
  return (
    <div className="space-y-2 mb-6">
      <p className="text-xs uppercase tracking-wide font-semibold text-stone-600">
        Quick scenarios
      </p>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s) => {
          const active = scenarioMatches(s.inputs, current)
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onSelect(s.inputs)}
              title={s.description}
              className={
                active
                  ? 'bg-orange-600 text-white text-sm px-3 py-1.5 rounded-full font-medium shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-stone-800 text-sm px-3 py-1.5 rounded-full border border-amber-200'
              }
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Lightweight equality check — every key in the scenario matches current.
function scenarioMatches(scenario: Inputs, current: Inputs): boolean {
  for (const key of Object.keys(scenario) as (keyof Inputs)[]) {
    if (scenario[key] !== current[key]) return false
  }
  return true
}
