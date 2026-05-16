import type { Inputs, SimulationResult } from './types'
import { simulateWithRates, type RatePaths } from './simulate'

/**
 * Approximate UK annual historical data, 1985–2023.
 *
 * Sources (approximate, not precise; intended for illustration):
 * - housePriceGrowth: Nationwide House Price Index annual change
 * - stockReturn: FTSE All-Share total return (approximate)
 * - mortgageRate: typical mortgage rate prevailing that year
 * - rentInflation: UK CPI annual rate (used as a proxy for rent inflation)
 *
 * Values rounded to nearest 0.5% in most cases. Replace with precise data
 * if accuracy beyond "what was the shape of UK markets" matters.
 */
export type HistoricalYear = {
  year: number
  housePriceGrowth: number
  stockReturn: number
  mortgageRate: number
  rentInflation: number
}

export const historicalData: HistoricalYear[] = [
  { year: 1985, housePriceGrowth: 0.13, stockReturn: 0.20, mortgageRate: 0.125, rentInflation: 0.060 },
  { year: 1986, housePriceGrowth: 0.14, stockReturn: 0.27, mortgageRate: 0.115, rentInflation: 0.035 },
  { year: 1987, housePriceGrowth: 0.19, stockReturn: 0.07, mortgageRate: 0.110, rentInflation: 0.040 },
  { year: 1988, housePriceGrowth: 0.25, stockReturn: 0.11, mortgageRate: 0.105, rentInflation: 0.050 },
  { year: 1989, housePriceGrowth: 0.19, stockReturn: 0.36, mortgageRate: 0.135, rentInflation: 0.075 },
  { year: 1990, housePriceGrowth: -0.04, stockReturn: -0.10, mortgageRate: 0.150, rentInflation: 0.090 },
  { year: 1991, housePriceGrowth: -0.02, stockReturn: 0.20, mortgageRate: 0.120, rentInflation: 0.060 },
  { year: 1992, housePriceGrowth: -0.07, stockReturn: 0.20, mortgageRate: 0.090, rentInflation: 0.035 },
  { year: 1993, housePriceGrowth: -0.02, stockReturn: 0.28, mortgageRate: 0.080, rentInflation: 0.015 },
  { year: 1994, housePriceGrowth: 0.02, stockReturn: -0.06, mortgageRate: 0.080, rentInflation: 0.025 },
  { year: 1995, housePriceGrowth: 0.01, stockReturn: 0.24, mortgageRate: 0.080, rentInflation: 0.035 },
  { year: 1996, housePriceGrowth: 0.08, stockReturn: 0.17, mortgageRate: 0.075, rentInflation: 0.025 },
  { year: 1997, housePriceGrowth: 0.11, stockReturn: 0.24, mortgageRate: 0.070, rentInflation: 0.020 },
  { year: 1998, housePriceGrowth: 0.11, stockReturn: 0.14, mortgageRate: 0.080, rentInflation: 0.020 },
  { year: 1999, housePriceGrowth: 0.11, stockReturn: 0.24, mortgageRate: 0.065, rentInflation: 0.015 },
  { year: 2000, housePriceGrowth: 0.14, stockReturn: -0.05, mortgageRate: 0.070, rentInflation: 0.025 },
  { year: 2001, housePriceGrowth: 0.14, stockReturn: -0.13, mortgageRate: 0.060, rentInflation: 0.015 },
  { year: 2002, housePriceGrowth: 0.26, stockReturn: -0.23, mortgageRate: 0.050, rentInflation: 0.015 },
  { year: 2003, housePriceGrowth: 0.16, stockReturn: 0.21, mortgageRate: 0.050, rentInflation: 0.015 },
  { year: 2004, housePriceGrowth: 0.18, stockReturn: 0.13, mortgageRate: 0.055, rentInflation: 0.015 },
  { year: 2005, housePriceGrowth: 0.05, stockReturn: 0.22, mortgageRate: 0.050, rentInflation: 0.020 },
  { year: 2006, housePriceGrowth: 0.10, stockReturn: 0.16, mortgageRate: 0.050, rentInflation: 0.025 },
  { year: 2007, housePriceGrowth: 0.08, stockReturn: 0.05, mortgageRate: 0.060, rentInflation: 0.025 },
  { year: 2008, housePriceGrowth: -0.16, stockReturn: -0.30, mortgageRate: 0.055, rentInflation: 0.035 },
  { year: 2009, housePriceGrowth: -0.01, stockReturn: 0.30, mortgageRate: 0.045, rentInflation: 0.020 },
  { year: 2010, housePriceGrowth: 0.01, stockReturn: 0.14, mortgageRate: 0.040, rentInflation: 0.030 },
  { year: 2011, housePriceGrowth: -0.01, stockReturn: -0.03, mortgageRate: 0.040, rentInflation: 0.045 },
  { year: 2012, housePriceGrowth: 0.01, stockReturn: 0.12, mortgageRate: 0.040, rentInflation: 0.025 },
  { year: 2013, housePriceGrowth: 0.08, stockReturn: 0.21, mortgageRate: 0.035, rentInflation: 0.025 },
  { year: 2014, housePriceGrowth: 0.08, stockReturn: 0.01, mortgageRate: 0.035, rentInflation: 0.015 },
  { year: 2015, housePriceGrowth: 0.04, stockReturn: 0.01, mortgageRate: 0.030, rentInflation: 0.000 },
  { year: 2016, housePriceGrowth: 0.05, stockReturn: 0.16, mortgageRate: 0.025, rentInflation: 0.010 },
  { year: 2017, housePriceGrowth: 0.02, stockReturn: 0.13, mortgageRate: 0.025, rentInflation: 0.025 },
  { year: 2018, housePriceGrowth: 0.02, stockReturn: -0.09, mortgageRate: 0.025, rentInflation: 0.025 },
  { year: 2019, housePriceGrowth: 0.00, stockReturn: 0.19, mortgageRate: 0.025, rentInflation: 0.020 },
  { year: 2020, housePriceGrowth: 0.05, stockReturn: -0.10, mortgageRate: 0.020, rentInflation: 0.010 },
  { year: 2021, housePriceGrowth: 0.11, stockReturn: 0.18, mortgageRate: 0.020, rentInflation: 0.025 },
  { year: 2022, housePriceGrowth: 0.10, stockReturn: 0.00, mortgageRate: 0.030, rentInflation: 0.090 },
  { year: 2023, housePriceGrowth: -0.02, stockReturn: 0.08, mortgageRate: 0.050, rentInflation: 0.070 },
]

export const FIRST_HISTORICAL_YEAR = historicalData[0].year
export const LAST_HISTORICAL_YEAR = historicalData[historicalData.length - 1].year

export type HistoricalRunResult = {
  startYear: number
  endYear: number
  yearsSimulated: number
  mortgageRateUsed: number
  simulation: SimulationResult
}

/**
 * Run a simulation using actual historical UK data starting from `startYear`.
 * The mortgage rate is fixed at the rate prevailing in the start year, then
 * the simulation uses the actual year-by-year house growth, rent inflation
 * and stock returns from that point forward.
 *
 * If the requested horizon would run past the last year of historical data,
 * the simulation is clipped to what's available.
 */
export function simulateHistorical(
  inputs: Inputs,
  startYear: number,
): HistoricalRunResult {
  const startIdx = historicalData.findIndex((d) => d.year === startYear)
  if (startIdx < 0) {
    throw new Error(`Historical data not available for year ${startYear}`)
  }
  const available = historicalData.length - startIdx
  const yearsSimulated = Math.min(inputs.yearsToSimulate, available)

  const slice = historicalData.slice(startIdx, startIdx + yearsSimulated)
  const mortgageRate = slice[0].mortgageRate

  const rates: RatePaths = {
    houseAppreciation: slice.map((d) => d.housePriceGrowth),
    rentInflation: slice.map((d) => d.rentInflation),
    investmentReturn: slice.map((d) => d.stockReturn),
  }

  const adjustedInputs: Inputs = {
    ...inputs,
    mortgageRate,
    yearsToSimulate: yearsSimulated,
  }

  const simulation = simulateWithRates(adjustedInputs, rates)

  return {
    startYear,
    endYear: slice[slice.length - 1].year,
    yearsSimulated,
    mortgageRateUsed: mortgageRate,
    simulation,
  }
}

/** Latest year a user can pick as start, given their requested horizon. */
export function latestStartYearForHorizon(horizonYears: number): number {
  return Math.max(FIRST_HISTORICAL_YEAR, LAST_HISTORICAL_YEAR - horizonYears + 1)
}
