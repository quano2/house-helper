import type { Inputs } from './types'

/**
 * Reasonable UK defaults for a typical first-time-ish purchase scenario.
 * All editable in the UI — these are starting points, not prescriptions.
 */
export const defaultInputs: Inputs = {
  housePrice: 350_000,
  depositAmount: 52_500, // 15% of the default house price
  // 0 = use upfront buy cost as the rent-path capital (the original behaviour).
  // Set above the upfront cost to also invest the surplus in both paths.
  availableCapital: 0,
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

  // Shared living costs (informational only; don't affect verdict)
  councilTaxAnnual: 2200, // ~Band D UK average
  utilitiesAnnual: 2400, // ~£200/month — varies hugely by usage

  houseAppreciationAnnual: 0.03,
  rentInflationAnnual: 0.03,
  // 4% is a realistic blended return for a typical UK saver — mix of cash
  // savings (~4–5% easy access), Premium Bonds (~4% average prize rate), and
  // some equities. A pure ISA-equity portfolio could justify 6–7%, but the
  // default shouldn't assume everyone runs that allocation.
  investmentReturnAnnual: 0.04,
  // Default off — most users have one or two accounts and the rate
  // differential is small. Turn on if your cash is spread across rate tiers
  // (e.g. cash savings + Premium Bonds + ISA equities) and you'd drain the
  // low-yield ones first for the deposit.
  useDifferentReturnForBuy: false,
  // Same as the blended rate by default. When the toggle is on, edit this to
  // your marginal rate on the cash that would remain after the deposit.
  investmentReturnBuyAnnual: 0.04,

  yearsToSimulate: 25,
}
