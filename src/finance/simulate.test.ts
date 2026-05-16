import { describe, it, expect } from 'vitest'
import { simulate } from './simulate'
import type { Inputs } from './types'

const baseInputs: Inputs = {
  housePrice: 350_000,
  depositPercent: 0.15,
  mortgageRate: 0.045,
  mortgageTermYears: 25,
  firstTimeBuyer: false,
  legalAndSurveyFees: 2000,
  mortgageArrangementFee: 999,
  maintenancePercent: 0.01,
  buildingsInsuranceAnnual: 300,
  serviceChargeAnnual: 0,
  sellingCostPercent: 0.02,
  monthlyRent: 1500,
  movingCostPerMove: 0,
  renterMovesEveryYears: 0,
  houseAppreciationAnnual: 0.03,
  rentInflationAnnual: 0.03,
  investmentReturnAnnual: 0.07,
  yearsToSimulate: 25,
}

describe('simulate', () => {
  it('produces one YearResult per year', () => {
    const result = simulate(baseInputs)
    expect(result.years).toHaveLength(25)
    expect(result.years[0].year).toBe(1)
    expect(result.years[24].year).toBe(25)
  })

  it('computes SDLT for the purchase', () => {
    const result = simulate(baseInputs)
    // £350k standard: 125k*2% + 100k*5% = 2500 + 5000 = 7500
    expect(result.sdlt).toBe(7500)
  })

  it('totalUpfrontBuyCost includes deposit + SDLT + fees', () => {
    const result = simulate(baseInputs)
    const expected = 350_000 * 0.15 + 7500 + 2000 + 999
    expect(result.totalUpfrontBuyCost).toBeCloseTo(expected, 2)
  })

  it('house value grows roughly at appreciation rate', () => {
    const result = simulate(baseInputs)
    // 350k * 1.03^25 ≈ £732,776
    expect(result.years[24].houseValue).toBeCloseTo(350_000 * Math.pow(1.03, 25), -2)
  })

  it('mortgage balance reaches ~0 at end of term', () => {
    const result = simulate({ ...baseInputs, yearsToSimulate: 25 })
    expect(result.years[24].mortgageBalance).toBeLessThan(1)
  })

  it('buy path eventually overtakes rent path with normal assumptions', () => {
    const result = simulate(baseInputs)
    expect(result.breakEvenYear).not.toBeNull()
    expect(result.breakEvenYear!).toBeGreaterThan(0)
    expect(result.breakEvenYear!).toBeLessThanOrEqual(25)
  })

  it('break-even is null if buy never catches up — e.g. very high investment returns', () => {
    const result = simulate({
      ...baseInputs,
      investmentReturnAnnual: 0.15, // unrealistically high
      houseAppreciationAnnual: 0.0,
    })
    expect(result.breakEvenYear).toBeNull()
  })

  it('higher house appreciation favours buying', () => {
    const low = simulate({ ...baseInputs, houseAppreciationAnnual: 0.01 })
    const high = simulate({ ...baseInputs, houseAppreciationAnnual: 0.05 })
    expect(high.years[24].buyMinusRent).toBeGreaterThan(low.years[24].buyMinusRent)
  })

  it('higher rent favours buying', () => {
    const low = simulate({ ...baseInputs, monthlyRent: 1000 })
    const high = simulate({ ...baseInputs, monthlyRent: 2000 })
    expect(high.years[24].buyMinusRent).toBeGreaterThan(low.years[24].buyMinusRent)
  })

  it('FTB relief reduces upfront cost', () => {
    const ftb = simulate({ ...baseInputs, firstTimeBuyer: true })
    const standard = simulate(baseInputs)
    expect(ftb.totalUpfrontBuyCost).toBeLessThan(standard.totalUpfrontBuyCost)
  })

  it('moving costs reduce renter net worth', () => {
    const noMoves = simulate(baseInputs)
    const withMoves = simulate({
      ...baseInputs,
      movingCostPerMove: 2000,
      renterMovesEveryYears: 3,
    })
    expect(withMoves.years[24].rentNetWorth).toBeLessThan(noMoves.years[24].rentNetWorth)
  })

})
