import { describe, it, expect } from 'vitest'
import {
  monthlyMortgagePayment,
  amortisationSchedule,
  balanceAfterMonths,
} from './mortgage'

describe('monthlyMortgagePayment', () => {
  it('£200k at 5% over 25y ≈ £1,169', () => {
    // Reference value — checked against external mortgage calculators.
    expect(monthlyMortgagePayment(200_000, 0.05, 25)).toBeCloseTo(1169.18, 1)
  })

  it('zero rate divides principal evenly across months', () => {
    expect(monthlyMortgagePayment(120_000, 0, 10)).toBeCloseTo(1000, 4)
  })

  it('£500k at 4% over 30y ≈ £2,387', () => {
    expect(monthlyMortgagePayment(500_000, 0.04, 30)).toBeCloseTo(2387.08, 1)
  })

  it('zero principal → 0', () => {
    expect(monthlyMortgagePayment(0, 0.05, 25)).toBe(0)
  })
})

describe('amortisationSchedule', () => {
  it('final balance is ~zero', () => {
    const schedule = amortisationSchedule(200_000, 0.05, 25)
    expect(schedule.length).toBe(300)
    expect(schedule[schedule.length - 1].balance).toBeLessThan(0.01)
  })

  it('sum of principals ≈ original principal', () => {
    const schedule = amortisationSchedule(200_000, 0.05, 25)
    const totalPrincipal = schedule.reduce((s, step) => s + step.principal, 0)
    expect(totalPrincipal).toBeCloseTo(200_000, 0)
  })

  it('early payments are mostly interest, later are mostly principal', () => {
    const schedule = amortisationSchedule(200_000, 0.05, 25)
    expect(schedule[0].interest).toBeGreaterThan(schedule[0].principal)
    expect(schedule[299].principal).toBeGreaterThan(schedule[299].interest)
  })
})

describe('balanceAfterMonths', () => {
  it('matches stepped amortisation result', () => {
    const stepped = amortisationSchedule(300_000, 0.045, 30)
    for (const checkMonth of [12, 60, 120, 240, 359]) {
      const expected = stepped[checkMonth - 1].balance
      const actual = balanceAfterMonths(300_000, 0.045, 30, checkMonth)
      expect(actual).toBeCloseTo(expected, 2)
    }
  })

  it('returns 0 at end of term', () => {
    expect(balanceAfterMonths(200_000, 0.05, 25, 300)).toBe(0)
    expect(balanceAfterMonths(200_000, 0.05, 25, 500)).toBe(0)
  })

  it('returns full principal at month 0', () => {
    expect(balanceAfterMonths(200_000, 0.05, 25, 0)).toBe(200_000)
  })
})
