/**
 * Future value of a lump sum + monthly contributions, compounded monthly.
 * Assumes contributions arrive at the end of each month.
 */
export function futureValue(
  initial: number,
  monthlyContribution: number,
  annualReturn: number,
  months: number,
): number {
  if (months <= 0) return initial
  const r = annualReturn / 12
  if (r === 0) return initial + monthlyContribution * months
  const factor = Math.pow(1 + r, months)
  const fvInitial = initial * factor
  const fvContrib = (monthlyContribution * (factor - 1)) / r
  return fvInitial + fvContrib
}
