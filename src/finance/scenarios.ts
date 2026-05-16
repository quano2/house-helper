import type { Inputs } from './types'
import { defaultInputs } from './defaults'

export type Scenario = {
  label: string
  description: string
  inputs: Inputs
}

export const scenarios: Scenario[] = [
  {
    label: 'Default',
    description: 'Average UK starting point — £350k home, 15% deposit',
    inputs: defaultInputs,
  },
  {
    label: 'First-time buyer',
    description: 'Smaller home with FTB stamp duty relief',
    inputs: {
      ...defaultInputs,
      housePrice: 280_000,
      depositPercent: 0.1,
      firstTimeBuyer: true,
      monthlyRent: 1200,
    },
  },
  {
    label: 'London market',
    description: 'Expensive home, high rent, slightly stronger growth',
    inputs: {
      ...defaultInputs,
      housePrice: 600_000,
      depositPercent: 0.2,
      monthlyRent: 2400,
      houseAppreciationAnnual: 0.04,
    },
  },
  {
    label: 'Stress-test buying',
    description: 'Flat house prices, strong stock returns',
    inputs: {
      ...defaultInputs,
      houseAppreciationAnnual: 0.0,
      investmentReturnAnnual: 0.09,
    },
  },
]
