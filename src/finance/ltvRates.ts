/**
 * Approximate UK 5-year fixed mortgage rates by loan-to-value band.
 * Calibrated to roughly late 2024 — these shift constantly. Refresh
 * against Moneyfacts / MSE best-buy tables periodically.
 *
 * LTV = loan / house price. Lower LTV (bigger deposit) = cheaper rate.
 */
const LTV_BAND_RATES: { maxLtv: number; rate: number }[] = [
  { maxLtv: 0.6, rate: 0.042 }, // ≤60% LTV
  { maxLtv: 0.75, rate: 0.044 }, // 60–75%
  { maxLtv: 0.8, rate: 0.045 }, // 75–80%
  { maxLtv: 0.85, rate: 0.046 }, // 80–85%
  { maxLtv: 0.9, rate: 0.048 }, // 85–90%
  { maxLtv: 0.95, rate: 0.052 }, // 90–95%
  { maxLtv: 1.0, rate: 0.056 }, // 95–100% — rare / punitive
]

export function typicalRateForLtv(ltv: number): number {
  for (const band of LTV_BAND_RATES) {
    if (ltv <= band.maxLtv) return band.rate
  }
  return LTV_BAND_RATES[LTV_BAND_RATES.length - 1].rate
}
