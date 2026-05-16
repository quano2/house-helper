/**
 * Standard amortising mortgage calculations.
 * Assumes monthly compounding and constant rate over the term.
 */

export function monthlyMortgagePayment(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  if (principal <= 0 || termYears <= 0) return 0
  const r = annualRate / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export type AmortisationStep = {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export function amortisationSchedule(
  principal: number,
  annualRate: number,
  termYears: number,
): AmortisationStep[] {
  const payment = monthlyMortgagePayment(principal, annualRate, termYears)
  const r = annualRate / 12
  const n = termYears * 12
  let balance = principal
  const schedule: AmortisationStep[] = []
  for (let month = 1; month <= n; month++) {
    const interest = balance * r
    const principalPayment = Math.min(payment - interest, balance)
    balance = Math.max(0, balance - principalPayment)
    schedule.push({ month, payment, interest, principal: principalPayment, balance })
  }
  return schedule
}

/**
 * Remaining mortgage balance after `monthsElapsed` months.
 * Returns 0 if the term has been fully paid off.
 */
export function balanceAfterMonths(
  principal: number,
  annualRate: number,
  termYears: number,
  monthsElapsed: number,
): number {
  if (monthsElapsed <= 0) return principal
  if (monthsElapsed >= termYears * 12) return 0
  const r = annualRate / 12
  const n = termYears * 12
  if (r === 0) return principal * (1 - monthsElapsed / n)
  const payment = monthlyMortgagePayment(principal, annualRate, termYears)
  // Closed-form: balance(t) = P*(1+r)^t - PMT*((1+r)^t - 1)/r
  const factor = Math.pow(1 + r, monthsElapsed)
  return principal * factor - (payment * (factor - 1)) / r
}
