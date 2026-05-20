import type { Inputs, SimulationResult, YearResult } from './types'
import { calculateSdlt } from './sdlt'
import { monthlyMortgagePayment, balanceAfterMonths } from './mortgage'

/**
 * Per-year rate arrays. Length must equal `yearsToSimulate`. Each entry
 * is the annual rate for that simulation year (0-indexed: index 0 = year 1).
 *
 * investmentReturnRent and investmentReturnBuy let each path compound at a
 * different rate — captures the real-world reality that the cash remaining
 * after a deposit (typically the higher-yielding accounts) doesn't compound
 * at the same blended rate as the full pool. Set them equal for the simple
 * single-rate model.
 */
export type RatePaths = {
  houseAppreciation: number[]
  rentInflation: number[]
  investmentReturnRent: number[]
  investmentReturnBuy: number[]
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
    depositAmount,
    availableCapital,
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
  // Cap the deposit at the house price — a deposit larger than the house
  // means "cash buyer", so no loan; any surplus would just sit in the user's
  // pocket (and isn't modelled separately).
  const deposit = Math.min(Math.max(0, depositAmount), housePrice)
  const loanAmount = Math.max(0, housePrice - deposit)
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

  // Both paths start with the same "starting capital". If the user has set
  // availableCapital above the upfront buy cost, the surplus gets invested in
  // both paths from day 1 — so comparing different deposit sizes within a
  // fixed cash pool works correctly (the "cash not put down" doesn't vanish
  // from the rent-path investments).
  const startingCapital = Math.max(totalUpfrontBuyCost, availableCapital)
  const surplus = startingCapital - totalUpfrontBuyCost

  let buyCash = surplus
  let rentCash = startingCapital

  const years: YearResult[] = []
  const totalMonths = yearsToSimulate * 12

  let buyAnnualOutflowAccum = 0
  let rentAnnualOutflowAccum = 0

  // Updated at the start of each year from the rate arrays
  let monthlyAppreciation = 0
  let monthlyInvestmentReturnRent = 0
  let monthlyInvestmentReturnBuy = 0

  for (let month = 1; month <= totalMonths; month++) {
    if (month === 1 || month % 12 === 1) {
      const yearIdx = Math.floor((month - 1) / 12)
      monthlyAppreciation = Math.pow(1 + rates.houseAppreciation[yearIdx], 1 / 12) - 1
      monthlyInvestmentReturnRent =
        Math.pow(1 + rates.investmentReturnRent[yearIdx], 1 / 12) - 1
      monthlyInvestmentReturnBuy =
        Math.pow(1 + rates.investmentReturnBuy[yearIdx], 1 / 12) - 1
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

    rentCash *= 1 + monthlyInvestmentReturnRent
    buyCash *= 1 + monthlyInvestmentReturnBuy

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
 * Resolve the effective buy-path return rate from inputs. Falls back to the
 * unified rate unless useDifferentReturnForBuy is on.
 */
export function buyReturnRate(inputs: Inputs): number {
  return inputs.useDifferentReturnForBuy
    ? inputs.investmentReturnBuyAnnual
    : inputs.investmentReturnAnnual
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
    investmentReturnRent: Array(n).fill(inputs.investmentReturnAnnual),
    investmentReturnBuy: Array(n).fill(buyReturnRate(inputs)),
  })
}

/**
 * Simulate the "rent now, buy in N years" strategy compared against
 * renting forever. During the wait period both paths just rent and invest
 * the starting capital. At the end of the wait, the buy path purchases at
 * the appreciated house price using the user's deposit, and any accumulated
 * cash beyond the new upfront cost is invested as `buyCash`.
 *
 * Returns a SimulationResult covering all `yearsToSimulate` years (the wait
 * period shows house value as the current price, and equity/mortgage as 0
 * until the buy actually happens).
 */
export function simulateWithDelay(
  inputs: Inputs,
  delayYears: number,
): SimulationResult {
  if (delayYears <= 0) return simulate(inputs)
  if (delayYears >= inputs.yearsToSimulate) {
    // Effectively never buying — just rent for the whole horizon. Both paths
    // stay invested at the rent (blended) rate since no purchase ever happens.
    const n = inputs.yearsToSimulate
    return simulateWithRates({ ...inputs, depositAmount: 0 }, {
      houseAppreciation: Array(n).fill(inputs.houseAppreciationAnnual),
      rentInflation: Array(n).fill(inputs.rentInflationAnnual),
      investmentReturnRent: Array(n).fill(inputs.investmentReturnAnnual),
      investmentReturnBuy: Array(n).fill(inputs.investmentReturnAnnual),
    })
  }

  // During the wait, both paths invest the full pool at the BLENDED rate
  // (no purchase yet, so the buy path's portfolio mix is identical to the
  // rent path's). After purchase, the buy path's remaining cash compounds at
  // the buy rate.
  const monthlyReturnDuringWait =
    Math.pow(1 + inputs.investmentReturnAnnual, 1 / 12) - 1
  const monthlyReturnRentPath =
    Math.pow(1 + inputs.investmentReturnAnnual, 1 / 12) - 1
  const monthlyReturnBuyPath =
    Math.pow(1 + buyReturnRate(inputs), 1 / 12) - 1
  const monthlyAppreciation =
    Math.pow(1 + inputs.houseAppreciationAnnual, 1 / 12) - 1

  // Compute current K (same starting capital both paths invest during wait)
  const currentSdlt = calculateSdlt(inputs.housePrice, {
    firstTimeBuyer: inputs.firstTimeBuyer,
  })
  const currentDeposit = Math.min(
    Math.max(0, inputs.depositAmount),
    inputs.housePrice,
  )
  const currentK =
    currentDeposit + currentSdlt + inputs.legalAndSurveyFees + inputs.mortgageArrangementFee

  // Both paths invest currentK from day 1. Rent is paid monthly (it's the
  // same on both sides during the wait so it cancels — but it still inflates,
  // so we track it for the post-wait phase).
  const waitMonths = delayYears * 12
  const totalMonths = inputs.yearsToSimulate * 12

  let rent = inputs.monthlyRent
  let houseValue = inputs.housePrice
  let cash = currentK // both paths same during wait

  const years: YearResult[] = []
  let annualRentAccum = 0

  // Wait phase — both paths identical, just rent + invest at the blended rate
  for (let month = 1; month <= waitMonths; month++) {
    annualRentAccum += rent
    cash *= 1 + monthlyReturnDuringWait
    houseValue *= 1 + monthlyAppreciation

    if (month % 12 === 0) {
      const year = month / 12
      // Both paths: no equity, no mortgage. Just cash.
      years.push({
        year,
        houseValue,
        mortgageBalance: 0,
        buyAnnualOutflow: annualRentAccum,
        buyEquityIfSold: 0,
        buyCashInvested: cash,
        buyNetWorth: cash, // identical to rent
        annualRent: annualRentAccum,
        rentInvestments: cash,
        rentNetWorth: cash,
        buyMinusRent: 0,
      })
      annualRentAccum = 0
      rent *= 1 + inputs.rentInflationAnnual
    }
  }

  // At end of wait: buy path purchases at new house price
  const futureSdlt = calculateSdlt(houseValue, {
    firstTimeBuyer: inputs.firstTimeBuyer,
  })
  const futureDeposit = Math.min(
    Math.max(0, inputs.depositAmount),
    houseValue,
  )
  const futureLoan = Math.max(0, houseValue - futureDeposit)
  const futureK =
    futureDeposit + futureSdlt + inputs.legalAndSurveyFees + inputs.mortgageArrangementFee

  // Buy path: cash -> deduct futureK (or as much as available), leftover becomes buyCash
  const buyCashStart = Math.max(0, cash - futureK)
  const rentCashStart = cash

  const futureMortgagePayment = monthlyMortgagePayment(
    futureLoan,
    inputs.mortgageRate,
    inputs.mortgageTermYears,
  )

  let buyCash = buyCashStart
  let rentCash = rentCashStart
  let buyHouseValue = houseValue

  for (let month = waitMonths + 1; month <= totalMonths; month++) {
    const monthsSinceBuy = month - waitMonths
    const mortgageBalance = balanceAfterMonths(
      futureLoan,
      inputs.mortgageRate,
      inputs.mortgageTermYears,
      Math.min(monthsSinceBuy, inputs.mortgageTermYears * 12),
    )
    const activeMortgage = monthsSinceBuy <= inputs.mortgageTermYears * 12

    const maintenanceMonthly = (buyHouseValue * inputs.maintenancePercent) / 12
    const buyMonthly =
      (activeMortgage ? futureMortgagePayment : 0) +
      maintenanceMonthly +
      inputs.buildingsInsuranceAnnual / 12 +
      inputs.serviceChargeAnnual / 12
    const rentMonthly = rent

    annualRentAccum += rentMonthly

    const diff = buyMonthly - rentMonthly
    if (diff > 0) rentCash += diff
    else if (diff < 0) buyCash += -diff

    rentCash *= 1 + monthlyReturnRentPath
    buyCash *= 1 + monthlyReturnBuyPath
    buyHouseValue *= 1 + monthlyAppreciation

    if (month % 12 === 0) {
      const year = month / 12
      if (
        inputs.renterMovesEveryYears > 0 &&
        year % inputs.renterMovesEveryYears === 0
      ) {
        rentCash -= inputs.movingCostPerMove
      }

      const saleProceeds = buyHouseValue * (1 - inputs.sellingCostPercent)
      const buyEquityIfSold = saleProceeds - mortgageBalance
      const buyNetWorth = buyEquityIfSold + buyCash

      years.push({
        year,
        houseValue: buyHouseValue,
        mortgageBalance,
        buyAnnualOutflow: 0,
        buyEquityIfSold,
        buyCashInvested: buyCash,
        buyNetWorth,
        annualRent: annualRentAccum,
        rentInvestments: rentCash,
        rentNetWorth: rentCash,
        buyMinusRent: buyNetWorth - rentCash,
      })

      annualRentAccum = 0
      rent *= 1 + inputs.rentInflationAnnual
    }
  }

  return {
    sdlt: futureSdlt,
    totalUpfrontBuyCost: futureK,
    monthlyMortgagePayment: futureMortgagePayment,
    years,
    breakEvenYear: findBreakEven(years),
  }
}

function findBreakEven(years: YearResult[]): number | null {
  const start = years[0]
  if (!start) return null
  const startSign = Math.sign(start.buyMinusRent)
  // Use strict > 0 so wait-phase years (where both paths are identical and
  // buyMinusRent is exactly 0) don't get counted as "buy overtook rent".
  for (const y of years) {
    if (startSign <= 0 && y.buyMinusRent > 0) return y.year
  }
  if (startSign > 0) return 1
  return null
}
