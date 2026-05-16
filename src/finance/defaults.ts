import type { Inputs } from './types'

/**
 * Reasonable UK defaults for a typical first-time-ish purchase scenario.
 * All editable in the UI — these are starting points, not prescriptions.
 */
export const defaultInputs: Inputs = {
  housePrice: 350_000,
  depositAmount: 52_500, // 15% of the default house price
  // Calibrated against real broker quotes ~May 2026 (4.70% at 25% deposit,
  // 4.80% at 15% deposit). Revisit if the BoE base rate moves much.
  mortgageRate: 0.048,
  mortgageTermYears: 25,
  firstTimeBuyer: false,

  legalAndSurveyFees: 2000,
  mortgageArrangementFee: 999,

  maintenancePercent: 0.01,
  buildingsInsuranceAnnual: 300,
  serviceChargeAnnual: 0,

  sellingCostPercent: 0.02,

  monthlyRent: 1500,
  movingCostPerMove: 1500,
  renterMovesEveryYears: 3,

  houseAppreciationAnnual: 0.03,
  rentInflationAnnual: 0.03,
  investmentReturnAnnual: 0.07,

  yearsToSimulate: 25,
}
