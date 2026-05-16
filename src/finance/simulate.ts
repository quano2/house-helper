import type { Inputs, SimulationResult, YearResult } from './types'
import { calculateSdlt } from './sdlt'
import { monthlyMortgagePayment, balanceAfterMonths } from './mortgage'

/**
 * Per-year rate arrays. Length must equal `yearsToSimulate`. Each entry
 * is the annual rate for that simulation year (0-indexed: index 0 = year 1).
 */
export type RatePaths = {
  houseAppreciation: number[]
  rentInflation: number[]
  investmentReturn: number[]
}

/**
 * Simulate buy-vs-rent month by month, tracking net worth of each strategy.
 *
 * See the previous version's doc-comment for the methodology. This version
 * accepts per-year rate arrays so it can be reused for Monte Carlo and
 * historical backtests as well as the standard deterministic case.
 */
export function simulateWithRates(inputs: Inputs, rates: RatePaths): SimulationResult {
  const {
    housePrice,
    depositPercent,
    mortgageRate,
    mortgageTermYears,
    firstTimeBuyer,
    legalAndSurveyFees,
    mortgageArrangementFee,
    maintenancePercent,
    buildingsInsuranceAnnual,
    serviceChargeAnnual,
    sellingCostPercent,
    monthlyRent,
    movingCostPerMove,
    renterMovesEveryYears,
    yearsToSimulate,
  } = inputs

  const sdlt = calculateSdlt(housePrice, { firstTimeBuyer })
  const deposit = housePrice * depositPercent
  const loanAmount = housePrice - deposit
  const totalUpfrontBuyCost =
    deposit + sdlt + legalAndSurveyFees + mortgageArrangementFee

  const mortgagePayment = monthlyMortgagePayment(
    loanAmount,
    mortgageRate,
    mortgageTermYears,
  )

  let houseValue = housePrice
  let rent = monthlyRent
  const insurance = buildingsInsuranceAnnual
  const serviceCharge = serviceChargeAnnual

  let buyCash = 0
  let rentCash = totalUpfrontBuyCost

  const years: YearResult[] = []
  const totalMonths = yearsToSimulate * 12

  let buyAnnualOutflowAccum = 0
  let rentAnnualOutflowAccum = 0

  // Updated at the start of each year from the rate arrays
  let monthlyAppreciation = 0
  let monthlyInvestmentReturn = 0

  for (let month = 1; month <= totalMonths; month++) {
    if (month === 1 || month % 12 === 1) {
      const yearIdx = Math.floor((month - 1) / 12)
      monthlyAppreciation = Math.pow(1 + rates.houseAppreciation[yearIdx], 1 / 12) - 1
      monthlyInvestmentReturn = Math.pow(1 + rates.investmentReturn[yearIdx], 1 / 12) - 1
    }

    const mortgageBalance = balanceAfterMonths(
      loanAmount,
      mortgageRate,
      mortgageTermYears,
      Math.min(month, mortgageTermYears * 12),
    )
    const activeMortgage = month <= mortgageTermYears * 12

    const maintenanceMonthly = (houseValue * maintenancePercent) / 12
    const buyMonthly =
      (activeMortgage ? mortgagePayment : 0) +
      maintenanceMonthly +
      insurance / 12 +
      serviceCharge / 12
    const rentMonthly = rent

    buyAnnualOutflowAccum += buyMonthly
    rentAnnualOutflowAccum += rentMonthly

    const diff = buyMonthly - rentMonthly
    if (diff > 0) rentCash += diff
    else if (diff < 0) buyCash += -diff

    rentCash *= 1 + monthlyInvestmentReturn
    buyCash *= 1 + monthlyInvestmentReturn

    houseValue *= 1 + monthlyAppreciation

    if (month % 12 === 0) {
      const year = month / 12

      if (renterMovesEveryYears > 0 && year % renterMovesEveryYears === 0) {
        rentCash -= movingCostPerMove
      }

      const saleProceeds = houseValue * (1 - sellingCostPercent)
      const buyEquityIfSold = saleProceeds - mortgageBalance
      const buyNetWorth = buyEquityIfSold + buyCash
      const rentNetWorth = rentCash

      years.push({
        year,
        houseValue,
        mortgageBalance,
        buyAnnualOutflow: buyAnnualOutflowAccum,
        buyEquityIfSold,
        buyCashInvested: buyCash,
        buyNetWorth,
        annualRent: rentAnnualOutflowAccum,
        rentInvestments: rentCash,
        rentNetWorth,
        buyMinusRent: buyNetWorth - rentNetWorth,
      })

      buyAnnualOutflowAccum = 0
      rentAnnualOutflowAccum = 0
      // Apply rent inflation for next year using current year's index
      const rateForNextYear = rates.rentInflation[year - 1]
      rent *= 1 + rateForNextYear
    }
  }

  return {
    sdlt,
    totalUpfrontBuyCost,
    monthlyMortgagePayment: mortgagePayment,
    years,
    breakEvenYear: findBreakEven(years),
  }
}

/**
 * Public API — deterministic simulation using the constant rates from inputs.
 * Convenience wrapper around simulateWithRates.
 */
export function simulate(inputs: Inputs): SimulationResult {
  const n = inputs.yearsToSimulate
  return simulateWithRates(inputs, {
    houseAppreciation: Array(n).fill(inputs.houseAppreciationAnnual),
    rentInflation: Array(n).fill(inputs.rentInflationAnnual),
    investmentReturn: Array(n).fill(inputs.investmentReturnAnnual),
  })
}

function findBreakEven(years: YearResult[]): number | null {
  const start = years[0]
  if (!start) return null
  const startSign = Math.sign(start.buyMinusRent)
  for (const y of years) {
    if (startSign <= 0 && y.buyMinusRent >= 0) return y.year
  }
  if (startSign > 0) return 1
  return null
}
