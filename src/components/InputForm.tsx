import { Home, Key, TrendingUp, Wallet } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { Field, ToggleField, Section } from './Field'

type Props = {
  inputs: Inputs
  onChange: (inputs: Inputs) => void
  fieldColumnsClass?: string
}

export function InputForm({ inputs, onChange, fieldColumnsClass }: Props) {
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    onChange({ ...inputs, [key]: value })

  return (
    <div className="space-y-8">
      <Section title="The purchase" icon={Home} columnsClass={fieldColumnsClass}>
        <Field
          label="House price"
          unit="£"
          value={inputs.housePrice}
          onChange={(v) => update('housePrice', v)}
          min={0}
          step={5000}
        />
        <Field
          label="Deposit"
          unit="%"
          value={inputs.depositPercent}
          onChange={(v) => update('depositPercent', v)}
          min={0}
          max={1}
          asPercent
        />
        <Field
          label="Mortgage rate"
          unit="% per year"
          value={inputs.mortgageRate}
          onChange={(v) => update('mortgageRate', v)}
          min={0}
          asPercent
        />
        <Field
          label="Mortgage term"
          unit="years"
          value={inputs.mortgageTermYears}
          onChange={(v) => update('mortgageTermYears', v)}
          min={1}
          max={40}
        />
        <ToggleField
          label="First-time buyer"
          hint="Reduces stamp duty for purchases ≤ £500k"
          value={inputs.firstTimeBuyer}
          onChange={(v) => update('firstTimeBuyer', v)}
        />
      </Section>

      <Section title="Buying — other costs" icon={Wallet} columnsClass={fieldColumnsClass}>
        <Field
          label="Legal + survey fees"
          unit="£ one-off"
          value={inputs.legalAndSurveyFees}
          onChange={(v) => update('legalAndSurveyFees', v)}
          min={0}
          step={100}
        />
        <Field
          label="Mortgage arrangement fee"
          unit="£ one-off"
          value={inputs.mortgageArrangementFee}
          onChange={(v) => update('mortgageArrangementFee', v)}
          min={0}
          step={50}
        />
        <Field
          label="Maintenance"
          unit="% of value/year"
          hint="Rule of thumb: 1%. Higher for older houses."
          value={inputs.maintenancePercent}
          onChange={(v) => update('maintenancePercent', v)}
          min={0}
          asPercent
        />
        <Field
          label="Buildings insurance"
          unit="£/year"
          value={inputs.buildingsInsuranceAnnual}
          onChange={(v) => update('buildingsInsuranceAnnual', v)}
          min={0}
          step={50}
        />
        <Field
          label="Service charge & ground rent"
          unit="£/year"
          hint="Leasehold only — 0 if freehold"
          value={inputs.serviceChargeAnnual}
          onChange={(v) => update('serviceChargeAnnual', v)}
          min={0}
          step={100}
        />
        <Field
          label="Re-mortgage fee"
          unit="£ per renewal"
          hint="Product fee when switching deals"
          value={inputs.remortgageFee}
          onChange={(v) => update('remortgageFee', v)}
          min={0}
          step={50}
        />
        <Field
          label="Re-mortgage every"
          unit="years"
          hint="UK fixed deals are typically 2–5 years"
          value={inputs.remortgageFeeEveryYears}
          onChange={(v) => update('remortgageFeeEveryYears', v)}
          min={0}
          max={30}
        />
        <Field
          label="Selling cost"
          unit="% of sale price"
          hint="Estate agent + solicitor on sale"
          value={inputs.sellingCostPercent}
          onChange={(v) => update('sellingCostPercent', v)}
          min={0}
          asPercent
        />
      </Section>

      <Section title="Renting" icon={Key} columnsClass={fieldColumnsClass}>
        <Field
          label="Monthly rent"
          unit="£"
          value={inputs.monthlyRent}
          onChange={(v) => update('monthlyRent', v)}
          min={0}
          step={50}
        />
        <Field
          label="Rent inflation"
          unit="% per year"
          value={inputs.rentInflationAnnual}
          onChange={(v) => update('rentInflationAnnual', v)}
          min={0}
          asPercent
        />
        <Field
          label="Moving cost"
          unit="£ per move"
          hint="Removals each time you change rental"
          value={inputs.movingCostPerMove}
          onChange={(v) => update('movingCostPerMove', v)}
          min={0}
          step={100}
        />
        <Field
          label="Move every"
          unit="years"
          hint="UK renters typically move every 2–3 years"
          value={inputs.renterMovesEveryYears}
          onChange={(v) => update('renterMovesEveryYears', v)}
          min={0}
          max={30}
        />
      </Section>

      <Section title="Market assumptions" icon={TrendingUp} columnsClass={fieldColumnsClass}>
        <Field
          label="House price growth"
          unit="% per year"
          hint="UK long-run: ~3–4% nominal"
          value={inputs.houseAppreciationAnnual}
          onChange={(v) => update('houseAppreciationAnnual', v)}
          asPercent
        />
        <Field
          label="Investment return"
          unit="% per year"
          hint="Stocks long-run: ~7% nominal. Assumes ISA-sheltered."
          value={inputs.investmentReturnAnnual}
          onChange={(v) => update('investmentReturnAnnual', v)}
          min={0}
          asPercent
        />
        <Field
          label="Years to simulate"
          unit="years"
          value={inputs.yearsToSimulate}
          onChange={(v) => update('yearsToSimulate', v)}
          min={1}
          max={50}
        />
      </Section>
    </div>
  )
}
