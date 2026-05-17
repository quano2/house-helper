/**
 * CPI used to deflate nominal pounds into today's pounds for display.
 * BoE target is 2%; recent UK CPI has run a bit higher. 2.5% is a
 * reasonable middle. Edit here if you want a different assumption — the
 * simulator itself is purely nominal, so changing this only affects how
 * results are shown when "real £" mode is on.
 */
export const DISPLAY_INFLATION_ANNUAL = 0.025

export type DisplayMode = 'nominal' | 'real'

export function deflate(nominal: number, year: number, rate = DISPLAY_INFLATION_ANNUAL): number {
  if (year <= 0) return nominal
  return nominal / Math.pow(1 + rate, year)
}

/**
 * Convenience: returns the input value untouched in nominal mode, or the
 * deflated (today's-pounds) value in real mode. Components can call this
 * uniformly without conditional branching.
 */
export function displayValue(
  nominal: number,
  year: number,
  mode: DisplayMode,
  rate = DISPLAY_INFLATION_ANNUAL,
): number {
  return mode === 'real' ? deflate(nominal, year, rate) : nominal
}
