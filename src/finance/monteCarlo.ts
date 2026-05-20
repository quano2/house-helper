import type { Inputs } from './types'
import { sampleNormal } from './random'
import { buyReturnRate, simulateWithRates, type RatePaths } from './simulate'

/**
 * Standard deviations for annual return distributions. Calibrated from
 * UK historical volatility (rough approximations, fine for visualisation).
 */
const VOLATILITY = {
  houseAppreciation: 0.07, // UK Nationwide HPI annual changes have σ ~7%
  rentInflation: 0.02, // CPI/rent inflation is fairly stable
  investmentReturn: 0.16, // Global equity ~σ 15-18%
}

export type MonteCarloYearStats = {
  year: number
  buyP5: number
  buyP25: number
  buyP50: number
  buyP75: number
  buyP95: number
  rentP5: number
  rentP25: number
  rentP50: number
  rentP75: number
  rentP95: number
}

export type MonteCarloResult = {
  runs: number
  yearsToSimulate: number
  years: MonteCarloYearStats[]
  /** Fraction of simulations where buy net worth > rent net worth at the horizon */
  pBuyWinsAtHorizon: number
}

export const DEFAULT_RUNS = 500

export function simulateMonteCarlo(
  inputs: Inputs,
  runs: number = DEFAULT_RUNS,
): MonteCarloResult {
  const buyByYear: number[][] = Array.from({ length: inputs.yearsToSimulate }, () => [])
  const rentByYear: number[][] = Array.from({ length: inputs.yearsToSimulate }, () => [])

  let buyWinsAtHorizon = 0

  for (let i = 0; i < runs; i++) {
    const rates = samplePaths(inputs)
    const result = simulateWithRates(inputs, rates)
    for (let y = 0; y < inputs.yearsToSimulate; y++) {
      buyByYear[y].push(result.years[y].buyNetWorth)
      rentByYear[y].push(result.years[y].rentNetWorth)
    }
    const final = result.years[result.years.length - 1]
    if (final.buyNetWorth > final.rentNetWorth) buyWinsAtHorizon++
  }

  const years: MonteCarloYearStats[] = []
  for (let y = 0; y < inputs.yearsToSimulate; y++) {
    const buys = buyByYear[y].slice().sort((a, b) => a - b)
    const rents = rentByYear[y].slice().sort((a, b) => a - b)
    years.push({
      year: y + 1,
      buyP5: percentile(buys, 5),
      buyP25: percentile(buys, 25),
      buyP50: percentile(buys, 50),
      buyP75: percentile(buys, 75),
      buyP95: percentile(buys, 95),
      rentP5: percentile(rents, 5),
      rentP25: percentile(rents, 25),
      rentP50: percentile(rents, 50),
      rentP75: percentile(rents, 75),
      rentP95: percentile(rents, 95),
    })
  }

  return {
    runs,
    yearsToSimulate: inputs.yearsToSimulate,
    years,
    pBuyWinsAtHorizon: buyWinsAtHorizon / runs,
  }
}

function samplePaths(inputs: Inputs): RatePaths {
  const n = inputs.yearsToSimulate
  const buyMean = buyReturnRate(inputs)
  return {
    houseAppreciation: Array.from({ length: n }, () =>
      sampleNormal(inputs.houseAppreciationAnnual, VOLATILITY.houseAppreciation),
    ),
    rentInflation: Array.from({ length: n }, () =>
      Math.max(0, sampleNormal(inputs.rentInflationAnnual, VOLATILITY.rentInflation)),
    ),
    investmentReturnRent: Array.from({ length: n }, () =>
      sampleNormal(inputs.investmentReturnAnnual, VOLATILITY.investmentReturn),
    ),
    investmentReturnBuy: Array.from({ length: n }, () =>
      sampleNormal(buyMean, VOLATILITY.investmentReturn),
    ),
  }
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (sorted.length - 1) * (p / 100)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  const frac = idx - lo
  return sorted[lo] * (1 - frac) + sorted[hi] * frac
}
