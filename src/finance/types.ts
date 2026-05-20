export type Inputs = {
  // Purchase
  housePrice: number
  depositAmount: number // £ — capped at housePrice in the simulator
  /**
   * Total cash you can deploy at completion. If higher than the upfront buy
   * cost, the surplus is invested in both buy AND rent scenarios — letting
   * you compare different deposit sizes without "losing" the unspent cash
   * from the comparison. 0 = use upfront buy cost (legacy behaviour).
   */
  availableCapital: number
  mortgageRate: number // annual, 0..1 (e.g. 0.045)
  mortgageTermYears: number
  firstTimeBuyer: boolean

  // Other upfront buying costs (flat £)
  legalAndSurveyFees: number
  mortgageArrangementFee: number

  // Ongoing buying
  maintenancePercent: number // annual, 0..1 (e.g. 0.01 = 1% of house value/yr)
  buildingsInsuranceAnnual: number // £/yr
  serviceChargeAnnual: number // £/yr (leasehold service charge + ground rent; 0 if freehold)

  // Selling
  sellingCostPercent: number // 0..1 (agent + legal as % of sale price)

  // Renting
  monthlyRent: number
  movingCostPerMove: number // £ per move (applies only to renter; buyer's move is in upfront/selling costs)
  renterMovesEveryYears: number // 0 disables

  // Shared living costs — same in either scenario, so they don't affect the
  // verdict. Tracked only for the monthly affordability display.
  councilTaxAnnual: number
  utilitiesAnnual: number

  // Market assumptions (annual, 0..1)
  houseAppreciationAnnual: number
  rentInflationAnnual: number
  /** Blended return on the rent path's invested capital. Used for both
   *  paths unless useDifferentReturnForBuy is true. */
  investmentReturnAnnual: number
  /** When true, the buy path's invested cash compounds at
   *  investmentReturnBuyAnnual instead. Models the real-world reality that
   *  someone with cash spread across rate tiers (e.g. cash savings + Premium
   *  Bonds + ISA equities) would drain the lowest-yielding accounts first
   *  for the deposit — pushing the average rate on the remaining cash up. */
  useDifferentReturnForBuy: boolean
  /** Rate on the cash that remains after the deposit goes down — typically
   *  higher than the blended rate because the low-yield accounts are spent
   *  first. Only used when useDifferentReturnForBuy is true. */
  investmentReturnBuyAnnual: number

  // Horizon
  yearsToSimulate: number
}

export type YearResult = {
  year: number
  // Buy path
  houseValue: number
  mortgageBalance: number
  buyAnnualOutflow: number
  buyEquityIfSold: number
  buyCashInvested: number
  buyNetWorth: number
  // Rent path
  annualRent: number
  rentInvestments: number
  rentNetWorth: number
  // Difference
  buyMinusRent: number
}

export type SimulationResult = {
  sdlt: number
  totalUpfrontBuyCost: number
  monthlyMortgagePayment: number
  years: YearResult[]
  breakEvenYear: number | null // first whole year where buy >= rent (or null if never within horizon)
}
