import type { Inputs, SimulationResult, YearResult } from './types'
import { calculateSdlt } from './sdlt'
import { monthlyMortgagePayment, balanceAfterMonths } from './mortgage'

/**
 * Simulate buy-vs-rent month by month, tracking net worth of each strategy.
 *
 * The model: both paths start with the same capital K (deposit + all upfront
 * buying costs). The buy path spends K at t=0. The rent path keeps K invested.
 * Each month, whichever path has the lower out-of-pocket cost invests the
 * difference at the market return. At horizon T, compare net worth:
 *   - Buy: (house value × (1 - selling cost%)) − mortgage balance + cash buffer
 *   - Rent: invested portfolio value
 * The cross-over year is the break-even.
 */
export function simulate(inputs: Inputs): SimulationResult {
  const {
    housePrice,
    depositPercent,
    mortgageRate,
    mortgageTermYears,
    firstTimeBuyer,
    additionalProperty,
    legalAndSurveyFees,
    mortgageArrangementFee,
    maintenancePercent,
    buildingsInsuranceAnnual,
    serviceChargeAnnual,
    sellingCostPercent,
    monthlyRent,
    houseAppreciationAnnual,
    rentInflationAnnual,
    investmentReturnAnnual,
    generalInflationAnnual,
    yearsToSimulate,
  } = inputs

  const sdlt = calculateSdlt(housePrice, { firstTimeBuyer, additionalProperty })
  const deposit = housePrice * depositPercent
  const loanAmount = housePrice - deposit
  const totalUpfrontBuyCost =
    deposit + sdlt + legalAndSurveyFees + mortgageArrangementFee

  const mortgagePayment = monthlyMortgagePayment(
    loanAmount,
    mortgageRate,
    mortgageTermYears,
  )

  const monthlyAppreciation = Math.pow(1 + houseAppreciationAnnual, 1 / 12) - 1
  const monthlyInvestmentReturn =
    Math.pow(1 + investmentReturnAnnual, 1 / 12) - 1
  const monthlyInflation = Math.pow(1 + generalInflationAnnual, 1 / 12) - 1
  // Rent and inflation-linked costs step up once per year for realism.

  let houseValue = housePrice
  let rent = monthlyRent
  let insurance = buildingsInsuranceAnnual
  let serviceCharge = serviceChargeAnnual

  // Cash positions
  let buyCash = 0
  let rentCash = totalUpfrontBuyCost

  const years: YearResult[] = []
  const totalMonths = yearsToSimulate * 12

  let buyAnnualOutflowAccum = 0
  let rentAnnualOutflowAccum = 0

  for (let month = 1; month <= totalMonths; month++) {
    const monthsElapsed = month
    const mortgageBalance = balanceAfterMonths(
      loanAmount,
      mortgageRate,
      mortgageTermYears,
      Math.min(monthsElapsed, mortgageTermYears * 12),
    )
    const activeMortgage = monthsElapsed <= mortgageTermYears * 12

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
    if (diff > 0) {
      // Rent path is cheaper this month → rent path invests the difference
      rentCash += diff
    } else if (diff < 0) {
      // Buy path is cheaper → buy path invests the difference
      buyCash += -diff
    }

    // Compound investments for one month
    rentCash *= 1 + monthlyInvestmentReturn
    buyCash *= 1 + monthlyInvestmentReturn

    // House appreciates monthly
    houseValue *= 1 + monthlyAppreciation

    // Year boundary: snapshot + annual step-ups
    if (month % 12 === 0) {
      const year = month / 12
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
      // Annual step-ups
      rent *= 1 + rentInflationAnnual
      insurance *= 1 + generalInflationAnnual
      serviceCharge *= 1 + generalInflationAnnual
      void monthlyInflation // (reserved for future use — silence unused warning)
    }
  }

  const breakEvenYear = findBreakEven(years)

  return {
    sdlt,
    totalUpfrontBuyCost,
    monthlyMortgagePayment: mortgagePayment,
    years,
    breakEvenYear,
  }
}

function findBreakEven(years: YearResult[]): number | null {
  // First year where buy net worth >= rent net worth, assuming we start behind.
  const start = years[0]
  if (!start) return null
  const startSign = Math.sign(start.buyMinusRent)
  for (const y of years) {
    if (startSign <= 0 && y.buyMinusRent >= 0) return y.year
  }
  // If buy was already ahead from year 1, return 1 (or null if never crosses)
  if (startSign > 0) return 1
  return null
}
