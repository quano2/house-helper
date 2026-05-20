import type { Inputs } from '../finance/types'
import { defaultInputs } from '../finance/defaults'

export type SavedScenario = {
  id: string
  name: string
  inputs: Inputs
  createdAt: number
}

const KEY = 'house-helper:scenarios'

/**
 * Backfill any keys missing from a stored scenario using the current
 * defaults. Protects against future schema additions: a scenario saved
 * before a new Inputs field existed still loads cleanly without
 * undefined values reaching the form or the simulator.
 */
function migrateInputs(stored: unknown): Inputs {
  if (!stored || typeof stored !== 'object') return defaultInputs
  return { ...defaultInputs, ...(stored as Partial<Inputs>) }
}

export function loadScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((s) => ({
      ...s,
      inputs: migrateInputs(s?.inputs),
    }))
  } catch {
    return []
  }
}

export function saveScenarios(scenarios: SavedScenario[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(scenarios))
  } catch {
    // Storage full or disabled — silently fail
  }
}

export function newScenarioId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
