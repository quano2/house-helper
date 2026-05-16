import { describe, it, expect } from 'vitest'
import { lookupAreaByPostcode, ukAreas } from './data'

describe('lookupAreaByPostcode', () => {
  it('maps a London postcode', () => {
    expect(lookupAreaByPostcode('SW1A 2AA')?.id).toBe('london')
    expect(lookupAreaByPostcode('w1 2ab')?.id).toBe('london')
  })

  it('maps a Manchester postcode', () => {
    expect(lookupAreaByPostcode('M1 2AB')?.id).toBe('manchester')
  })

  it('prefers 2-letter prefix over 1-letter (BN → Brighton, not B → Birmingham)', () => {
    expect(lookupAreaByPostcode('BN1 3AB')?.id).toBe('brighton')
    expect(lookupAreaByPostcode('B1 1AA')?.id).toBe('birmingham')
  })

  it('handles BS (Bristol) vs B (Birmingham)', () => {
    expect(lookupAreaByPostcode('BS1 4DJ')?.id).toBe('bristol')
  })

  it('returns null for unknown postcodes', () => {
    expect(lookupAreaByPostcode('XX99 9ZZ')).toBeNull()
    expect(lookupAreaByPostcode('')).toBeNull()
  })

  it('ignores whitespace and case', () => {
    expect(lookupAreaByPostcode('  EH1 1YZ  ')?.id).toBe('edinburgh')
    expect(lookupAreaByPostcode('cf10')?.id).toBe('cardiff')
  })
})

describe('ukAreas', () => {
  it('has unique ids', () => {
    const ids = ukAreas.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has plausible price/rent values', () => {
    for (const a of ukAreas) {
      expect(a.averageHousePrice).toBeGreaterThan(50_000)
      expect(a.averageHousePrice).toBeLessThan(2_000_000)
      expect(a.averageMonthlyRent).toBeGreaterThan(400)
      expect(a.averageMonthlyRent).toBeLessThan(5000)
    }
  })
})
