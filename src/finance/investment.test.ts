import { describe, it, expect } from 'vitest'
import { futureValue } from './investment'

describe('futureValue', () => {
  it('zero return, just lump sum', () => {
    expect(futureValue(10_000, 0, 0, 120)).toBe(10_000)
  })

  it('zero return, contributions accumulate linearly', () => {
    expect(futureValue(0, 100, 0, 12)).toBe(1200)
  })

  it('lump sum compounded — £10k at 7% for 10y ≈ £20,097', () => {
    // (1 + 0.07/12)^120 ≈ 2.00966
    expect(futureValue(10_000, 0, 0.07, 120)).toBeCloseTo(20_096.61, 0)
  })

  it('monthly contributions only — £200/m at 5% for 30y ≈ £166,452', () => {
    // Standard annuity-due-end formula
    expect(futureValue(0, 200, 0.05, 360)).toBeCloseTo(166_451.73, 0)
  })

  it('combined lump + contributions sum correctly', () => {
    const fvLump = futureValue(50_000, 0, 0.06, 240)
    const fvContrib = futureValue(0, 500, 0.06, 240)
    const fvCombined = futureValue(50_000, 500, 0.06, 240)
    expect(fvCombined).toBeCloseTo(fvLump + fvContrib, 2)
  })

  it('zero months returns initial', () => {
    expect(futureValue(5000, 100, 0.05, 0)).toBe(5000)
  })
})
