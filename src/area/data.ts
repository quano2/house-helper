/**
 * Approximate UK city/region averages for house prices and rents.
 *
 * Calibrated to roughly late 2024. Sources to refresh against:
 * - Land Registry House Price Index (gov.uk)
 * - ONS Private rental market summary statistics
 *
 * These numbers are illustrative — they describe a broad average across
 * each city and will be wrong for any specific street. Treat them as a
 * starting point, not a quote.
 *
 * mapX / mapY are positions in a 100×140 viewBox used by the map view.
 */
export type UkArea = {
  id: string
  name: string
  region: string
  averageHousePrice: number
  averageMonthlyRent: number
  mapX: number
  mapY: number
}

export const ukAreas: UkArea[] = [
  { id: 'london', name: 'London', region: 'England', averageHousePrice: 535_000, averageMonthlyRent: 2050, mapX: 80, mapY: 120 },
  { id: 'manchester', name: 'Manchester', region: 'England', averageHousePrice: 225_000, averageMonthlyRent: 1200, mapX: 55, mapY: 72 },
  { id: 'birmingham', name: 'Birmingham', region: 'England', averageHousePrice: 240_000, averageMonthlyRent: 1150, mapX: 58, mapY: 90 },
  { id: 'bristol', name: 'Bristol', region: 'England', averageHousePrice: 340_000, averageMonthlyRent: 1750, mapX: 48, mapY: 108 },
  { id: 'edinburgh', name: 'Edinburgh', region: 'Scotland', averageHousePrice: 285_000, averageMonthlyRent: 1400, mapX: 65, mapY: 38 },
  { id: 'cardiff', name: 'Cardiff', region: 'Wales', averageHousePrice: 255_000, averageMonthlyRent: 1250, mapX: 42, mapY: 110 },
  { id: 'belfast', name: 'Belfast', region: 'N. Ireland', averageHousePrice: 180_000, averageMonthlyRent: 900, mapX: 18, mapY: 80 },
  { id: 'leeds', name: 'Leeds', region: 'England', averageHousePrice: 225_000, averageMonthlyRent: 1150, mapX: 65, mapY: 68 },
  { id: 'glasgow', name: 'Glasgow', region: 'Scotland', averageHousePrice: 190_000, averageMonthlyRent: 950, mapX: 56, mapY: 40 },
  { id: 'liverpool', name: 'Liverpool', region: 'England', averageHousePrice: 180_000, averageMonthlyRent: 900, mapX: 50, mapY: 73 },
  { id: 'sheffield', name: 'Sheffield', region: 'England', averageHousePrice: 200_000, averageMonthlyRent: 950, mapX: 63, mapY: 78 },
  { id: 'newcastle', name: 'Newcastle', region: 'England', averageHousePrice: 200_000, averageMonthlyRent: 950, mapX: 68, mapY: 55 },
  { id: 'cambridge', name: 'Cambridge', region: 'England', averageHousePrice: 495_000, averageMonthlyRent: 1800, mapX: 82, mapY: 105 },
  { id: 'oxford', name: 'Oxford', region: 'England', averageHousePrice: 490_000, averageMonthlyRent: 1900, mapX: 72, mapY: 113 },
  { id: 'brighton', name: 'Brighton', region: 'England', averageHousePrice: 450_000, averageMonthlyRent: 1800, mapX: 78, mapY: 128 },
  { id: 'reading', name: 'Reading', region: 'England', averageHousePrice: 400_000, averageMonthlyRent: 1650, mapX: 75, mapY: 118 },
  { id: 'nottingham', name: 'Nottingham', region: 'England', averageHousePrice: 215_000, averageMonthlyRent: 1100, mapX: 68, mapY: 82 },
  { id: 'southampton', name: 'Southampton', region: 'England', averageHousePrice: 275_000, averageMonthlyRent: 1300, mapX: 70, mapY: 125 },
]

/**
 * Mapping from postcode area code (the leading letters of an outcode) to
 * a city id. 2-letter prefixes take precedence over 1-letter prefixes,
 * so "BN" → brighton wins over "B" → birmingham for postcodes like "BN1".
 *
 * Covers the postcode areas closest to our bundled cities — many UK
 * postcodes won't match anything, in which case the postcode tab tells
 * the user there's no data.
 */
export const postcodeAreaToCityId: Record<string, string> = {
  // London (multiple postcode areas)
  W: 'london',
  WC: 'london',
  EC: 'london',
  N: 'london',
  NW: 'london',
  SE: 'london',
  SW: 'london',
  E: 'london',
  // Major cities (1-letter)
  M: 'manchester',
  B: 'birmingham',
  G: 'glasgow',
  L: 'liverpool',
  S: 'sheffield',
  // 2-letter (checked first, so these override conflicts with 1-letter above)
  BS: 'bristol',
  BT: 'belfast',
  BN: 'brighton',
  EH: 'edinburgh',
  CF: 'cardiff',
  LS: 'leeds',
  NE: 'newcastle',
  CB: 'cambridge',
  OX: 'oxford',
  RG: 'reading',
  NG: 'nottingham',
  SO: 'southampton',
}

/**
 * Extract the leading letters of a postcode and return the matched UK area,
 * or null if no match. Forgiving with whitespace and case.
 */
export function lookupAreaByPostcode(input: string): UkArea | null {
  const normalized = input.replace(/\s+/g, '').toUpperCase()
  if (normalized.length === 0) return null
  // Postcode area is the leading letters (1 or 2)
  const match = normalized.match(/^([A-Z]{1,2})/)
  if (!match) return null
  const area = match[1]
  // Prefer the 2-letter prefix; fall back to the 1-letter prefix
  const id = postcodeAreaToCityId[area] ?? postcodeAreaToCityId[area[0]]
  if (!id) return null
  return ukAreas.find((c) => c.id === id) ?? null
}

export function getAreaById(id: string): UkArea | undefined {
  return ukAreas.find((c) => c.id === id)
}
