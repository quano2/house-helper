import { describe, it, expect } from 'vitest'
import {
  FIRST_HISTORICAL_YEAR,
  LAST_HISTORICAL_YEAR,
  historicalData,
  latestStartYearForHorizon,
  simulateHistorical,
} from './historical'
import { defaultInputs } from './defaults'

describe('historicalData', () => {
  it('spans from FIRST_HISTORICAL_YEAR to LAST_HISTORICAL_YEAR with no gaps', () => {
    for (let i = 1; i < historicalData.length; i++) {
      expect(historicalData[i].year).toBe(historicalData[i - 1].year + 1)
    }
    expect(historicalData[0].year).toBe(FIRST_HISTORICAL_YEAR)
    expect(historicalData[historicalData.length - 1].year).toBe(LAST_HISTORICAL_YEAR)
  })
})

describe('simulateHistorical', () => {
  it('runs the full horizon when data is available', () => {
    const result = simulateHistorical({ ...defaultInputs, yearsToSimulate: 25 }, 1995)
    expect(result.yearsSimulated).toBe(25)
    expect(result.startYear).toBe(1995)
    expect(result.endYear).toBe(2019)
    expect(result.simulation.years).toHaveLength(25)
  })

  it('clips the horizon when data runs out', () => {
    // 2015 + 25 = 2040, but data only goes to LAST_HISTORICAL_YEAR
    const result = simulateHistorical({ ...defaultInputs, yearsToSimulate: 25 }, 2015)
    expect(result.yearsSimulated).toBe(LAST_HISTORICAL_YEAR - 2015 + 1)
    expect(result.endYear).toBe(LAST_HISTORICAL_YEAR)
  })

  it('uses the mortgage rate from the start year', () => {
    const expected = historicalData.find((d) => d.year === 1990)!.mortgageRate
    const result = simulateHistorical(defaultInputs, 1990)
    expect(result.mortgageRateUsed).toBe(expected)
  })

  it('throws for unknown start year', () => {
    expect(() => simulateHistorical(defaultInputs, 1900)).toThrow()
  })
})

describe('latestStartYearForHorizon', () => {
  it('returns the latest year that fits the requested horizon', () => {
    expect(latestStartYearForHorizon(25)).toBe(LAST_HISTORICAL_YEAR - 25 + 1)
    expect(latestStartYearForHorizon(1)).toBe(LAST_HISTORICAL_YEAR)
  })
})
