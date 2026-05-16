import type { Inputs } from '../finance/types'

export type SavedScenario = {
  id: string
  name: string
  inputs: Inputs
  createdAt: number
}

const KEY = 'house-helper:scenarios'

export function loadScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
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
