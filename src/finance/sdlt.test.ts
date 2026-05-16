import { describe, it, expect } from 'vitest'
import { calculateSdlt } from './sdlt'

describe('calculateSdlt', () => {
  it('returns 0 for price under nil-rate threshold', () => {
    expect(calculateSdlt(100_000)).toBe(0)
    expect(calculateSdlt(125_000)).toBe(0)
  })

  it('standard rates — £300k', () => {
    // 0 on first 125k + 2% on next 125k (£2,500) + 5% on next 50k (£2,500) = £5,000
    expect(calculateSdlt(300_000)).toBe(5_000)
  })

  it('standard rates — £600k', () => {
    // 0 + 125k*2% (£2,500) + 350k*5% (£17,500) = £20,000
    expect(calculateSdlt(600_000)).toBe(20_000)
  })

  it('standard rates — £1m', () => {
    // 0 + 125k*2% (£2,500) + 675k*5% (£33,750) + 75k*10% (£7,500) = £43,750
    expect(calculateSdlt(1_000_000)).toBe(43_750)
  })

  it('FTB relief — £250k', () => {
    // FTB: 0% up to £300k → £0
    expect(calculateSdlt(250_000, { firstTimeBuyer: true })).toBe(0)
  })

  it('FTB relief — £400k', () => {
    // FTB: 0 on first 300k + 5% on next 100k = £5,000
    expect(calculateSdlt(400_000, { firstTimeBuyer: true })).toBe(5_000)
  })

  it('FTB relief — £500k (at limit)', () => {
    // FTB: 0 + 200k*5% = £10,000
    expect(calculateSdlt(500_000, { firstTimeBuyer: true })).toBe(10_000)
  })

  it('FTB relief lost above £500k — falls back to standard', () => {
    // £600k FTB → no relief → standard £20,000
    expect(calculateSdlt(600_000, { firstTimeBuyer: true })).toBe(20_000)
  })

  it('additional property — adds 5% surcharge', () => {
    // £300k second home: standard £5,000 + 5% of £300k = £5,000 + £15,000 = £20,000
    expect(calculateSdlt(300_000, { additionalProperty: true })).toBe(20_000)
  })

  it('additional property under £40k threshold — no surcharge', () => {
    expect(calculateSdlt(35_000, { additionalProperty: true })).toBe(0)
  })

  it('zero and negative prices return 0', () => {
    expect(calculateSdlt(0)).toBe(0)
    expect(calculateSdlt(-50_000)).toBe(0)
  })
})
