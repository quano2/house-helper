import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type { Inputs } from '../finance/types'
import {
  loadScenarios,
  newScenarioId,
  saveScenarios,
  type SavedScenario,
} from '../utils/storage'

type Props = {
  current: Inputs
  onLoad: (inputs: Inputs) => void
}

export function SavedScenarios({ current, onLoad }: Props) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => loadScenarios())
  const [name, setName] = useState('')

  function save() {
    const trimmed = name.trim()
    if (!trimmed) return
    const next = [
      ...scenarios,
      { id: newScenarioId(), name: trimmed, inputs: current, createdAt: Date.now() },
    ]
    setScenarios(next)
    saveScenarios(next)
    setName('')
  }

  function remove(id: string) {
    const next = scenarios.filter((s) => s.id !== id)
    setScenarios(next)
    saveScenarios(next)
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-white p-3 mb-8 print:hidden">
      {scenarios.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs uppercase tracking-wide font-semibold text-stone-600 mr-1">
            Saved:
          </span>
          {scenarios.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full pl-3 pr-1 py-1"
            >
              <button
                type="button"
                onClick={() => onLoad(s.inputs)}
                className="text-sm text-stone-800 hover:text-orange-700"
                title="Load this scenario"
              >
                {s.name}
              </button>
              <button
                type="button"
                onClick={() => remove(s.id)}
                className="text-stone-400 hover:text-stone-700 p-0.5"
                aria-label={`Delete ${s.name}`}
                title="Delete"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={
            scenarios.length === 0
              ? 'Save current setup — e.g. "My current best guess"'
              : 'Save current as…'
          }
          className="flex-1 text-sm rounded-md border border-stone-300 px-3 py-1.5 bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="inline-flex items-center gap-1 text-sm bg-orange-600 text-white px-3 py-1.5 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Save
        </button>
      </form>
    </div>
  )
}
