import { describe, it, expect } from 'vitest'
import { simulateMonteCarlo } from './monteCarlo'
import { defaultInputs } from './defaults'

describe('simulateMonteCarlo', () => {
  it('produces year-by-year percentiles in order', () => {
    const result = simulateMonteCarlo(defaultInputs, 200)
    expect(result.years).toHaveLength(defaultInputs.yearsToSimulate)
    for (const y of result.years) {
      expect(y.buyP5).toBeLessThanOrEqual(y.buyP25)
      expect(y.buyP25).toBeLessThanOrEqual(y.buyP50)
      expect(y.buyP50).toBeLessThanOrEqual(y.buyP75)
      expect(y.buyP75).toBeLessThanOrEqual(y.buyP95)
      expect(y.rentP5).toBeLessThanOrEqual(y.rentP50)
      expect(y.rentP50).toBeLessThanOrEqual(y.rentP95)
    }
  })

  it('pBuyWinsAtHorizon is between 0 and 1', () => {
    const result = simulateMonteCarlo(defaultInputs, 200)
    expect(result.pBuyWinsAtHorizon).toBeGreaterThanOrEqual(0)
    expect(result.pBuyWinsAtHorizon).toBeLessThanOrEqual(1)
  })

  it('reports the configured number of runs', () => {
    const result = simulateMonteCarlo(defaultInputs, 100)
    expect(result.runs).toBe(100)
  })
})
