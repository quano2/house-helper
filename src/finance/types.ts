export type Inputs = {
  // Purchase
  housePrice: number
  depositPercent: number // 0..1
  mortgageRate: number // annual, 0..1 (e.g. 0.045)
  mortgageTermYears: number
  firstTimeBuyer: boolean
  additionalProperty: boolean

  // Other upfront buying costs (flat £)
  legalAndSurveyFees: number
  mortgageArrangementFee: number

  // Ongoing buying
  maintenancePercent: number // annual, 0..1 (e.g. 0.01 = 1% of house value/yr)
  buildingsInsuranceAnnual: number // £/yr
  serviceChargeAnnual: number // £/yr (leasehold; 0 if freehold)

  // Selling
  sellingCostPercent: number // 0..1 (agent + legal as % of sale price)

  // Renting
  monthlyRent: number

  // Market assumptions (annual, 0..1)
  houseAppreciationAnnual: number
  rentInflationAnnual: number
  investmentReturnAnnual: number

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
