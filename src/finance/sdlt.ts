/**
 * UK Stamp Duty Land Tax (SDLT) — England & Northern Ireland rates.
 * Rates as of April 2025. Scotland (LBTT) and Wales (LTT) differ — not modelled.
 *
 * Sources to re-check periodically: gov.uk/stamp-duty-land-tax/residential-property-rates
 */

type Band = { upTo: number; rate: number }

const STANDARD_BANDS: Band[] = [
  { upTo: 125_000, rate: 0 },
  { upTo: 250_000, rate: 0.02 },
  { upTo: 925_000, rate: 0.05 },
  { upTo: 1_500_000, rate: 0.10 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.12 },
]

const FTB_BANDS: Band[] = [
  { upTo: 300_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
]

// Higher Rates on Additional Dwellings — flat surcharge on the full price.
const HRAD_SURCHARGE = 0.05
const HRAD_THRESHOLD = 40_000

export type SdltOpts = {
  firstTimeBuyer?: boolean
  additionalProperty?: boolean
}

function progressiveTax(price: number, bands: Band[]): number {
  let tax = 0
  let lower = 0
  for (const band of bands) {
    const taxableInBand = Math.max(0, Math.min(price, band.upTo) - lower)
    tax += taxableInBand * band.rate
    if (price <= band.upTo) return tax
    lower = band.upTo
  }
  return tax
}

export function calculateSdlt(price: number, opts: SdltOpts = {}): number {
  if (price <= 0) return 0

  // FTB relief only applies if purchase ≤ £500k — above that, standard rates apply.
  const useFtbBands = !!opts.firstTimeBuyer && price <= 500_000
  const bands = useFtbBands ? FTB_BANDS : STANDARD_BANDS

  let tax = progressiveTax(price, bands)

  if (opts.additionalProperty && price >= HRAD_THRESHOLD) {
    tax += price * HRAD_SURCHARGE
  }

  return tax
}
