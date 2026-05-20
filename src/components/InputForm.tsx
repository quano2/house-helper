import { useState } from 'react'
import { Home, Key, Receipt, Scale, TrendingUp, Wallet } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { formatGBP } from '../utils/format'
import { DepositComparison } from './DepositComparison'
import { Field, ToggleField, Section } from './Field'

type Props = {
  inputs: Inputs
  onChange: (inputs: Inputs) => void
}

type DepositMode = 'amount' | 'percent'

export function InputForm({ inputs, onChange }: Props) {
  const update = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    onChange({ ...inputs, [key]: value })

  const [depositMode, setDepositMode] = useState<DepositMode>('amount')
  const [comparisonOpen, setComparisonOpen] = useState(false)

  const depositPercent =
    inputs.housePrice > 0 ? inputs.depositAmount / inputs.housePrice : 0
  const baseDepositPercentText =
    inputs.housePrice > 0
      ? `${(depositPercent * 100).toFixed(1)}% of house price`
      : 'Set a house price first'
  const baseDepositAmountText = `= ${formatGBP(inputs.depositAmount)}`

  const compareLink = (
    <button
      type="button"
      onClick={() => setComparisonOpen(true)}
      className="inline-flex items-center gap-1 text-orange-700 dark:text-sky-400 hover:underline"
    >
      <Scale className="h-3 w-3" />
      Compare options
    </button>
  )

  const depositPercentHint = (
    <span className="flex flex-wrap items-center gap-x-2">
      <span>{baseDepositPercentText}</span>
      <span className="text-stone-400 dark:text-slate-600">·</span>
      {compareLink}
    </span>
  )
  const depositAmountHint = (
    <span className="flex flex-wrap items-center gap-x-2">
      <span>{baseDepositAmountText}</span>
      <span className="text-stone-400 dark:text-slate-600">·</span>
      {compareLink}
    </span>
  )

  const depositUnitToggle = (
    <div className="inline-flex items-center bg-stone-100 dark:bg-slate-800 rounded p-0.5 text-xs">
      <button
        type="button"
        onClick={() => setDepositMode('amount')}
        aria-pressed={depositMode === 'amount'}
        className={
          depositMode === 'amount'
            ? 'bg-white dark:bg-slate-600 text-stone-900 dark:text-slate-100 rounded px-2 py-0.5 font-medium shadow-sm'
            : 'text-stone-500 dark:text-slate-400 px-2 py-0.5'
        }
      >
        £
      </button>
      <button
        type="button"
        onClick={() => setDepositMode('percent')}
        aria-pressed={depositMode === 'percent'}
        className={
          depositMode === 'percent'
            ? 'bg-white dark:bg-slate-600 text-stone-900 dark:text-slate-100 rounded px-2 py-0.5 font-medium shadow-sm'
            : 'text-stone-500 dark:text-slate-400 px-2 py-0.5'
        }
      >
        %
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      <DepositComparison
        open={comparisonOpen}
        inputs={inputs}
        onApply={(depositAmount, mortgageRate) =>
          onChange({ ...inputs, depositAmount, mortgageRate })
        }
        onClose={() => setComparisonOpen(false)}
      />
      <Section title="The purchase" icon={Home}>
        <Field
          label="House price"
          prefix="£"
          value={inputs.housePrice}
          onChange={(v) => update('housePrice', v)}
          min={0}
          step={5000}
          thousands
        />
        {depositMode === 'amount' ? (
          <Field
            key="deposit-amount"
            label="Deposit"
            prefix="£"
            unit={depositUnitToggle}
            hint={depositPercentHint}
            value={inputs.depositAmount}
            onChange={(v) => update('depositAmount', v)}
            min={0}
            step={1000}
            thousands
          />
        ) : (
          <Field
            key="deposit-percent"
            label="Deposit"
            prefix="%"
            unit={depositUnitToggle}
            hint={depositAmountHint}
            value={depositPercent}
            onChange={(pct) =>
              update('depositAmount', Math.round(pct * inputs.housePrice))
            }
            min={0}
            asPercent
          />
        )}
        <Field
          label="Mortgage rate"
          prefix="%"
          unit="per year"
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

      <Section title="Buying — other costs" icon={Wallet}>
        <Field
          label="Legal + survey fees"
          prefix="£"
          unit="one-off"
          value={inputs.legalAndSurveyFees}
          onChange={(v) => update('legalAndSurveyFees', v)}
          min={0}
          step={100}
          thousands
        />
        <Field
          label="Arrangement fee"
          prefix="£"
          unit="one-off"
          value={inputs.mortgageArrangementFee}
          onChange={(v) => update('mortgageArrangementFee', v)}
          min={0}
          step={50}
          thousands
        />
        <Field
          label="Maintenance"
          prefix="%"
          unit="of value/year"
          hint="Rule of thumb: 1%. Higher for older houses."
          value={inputs.maintenancePercent}
          onChange={(v) => update('maintenancePercent', v)}
          min={0}
          asPercent
        />
        <Field
          label="Buildings insurance"
          prefix="£"
          unit="/year"
          value={inputs.buildingsInsuranceAnnual}
          onChange={(v) => update('buildingsInsuranceAnnual', v)}
          min={0}
          step={50}
          thousands
        />
        <Field
          label="Service & ground rent"
          prefix="£"
          unit="/year"
          hint="Leasehold only — 0 if freehold"
          value={inputs.serviceChargeAnnual}
          onChange={(v) => update('serviceChargeAnnual', v)}
          min={0}
          step={100}
          thousands
        />
        <Field
          label="Selling cost"
          prefix="%"
          unit="of sale price"
          hint="Estate agent + solicitor on sale"
          value={inputs.sellingCostPercent}
          onChange={(v) => update('sellingCostPercent', v)}
          min={0}
          asPercent
        />
      </Section>

      <Section title="Renting" icon={Key}>
        <Field
          label="Monthly rent"
          prefix="£"
          value={inputs.monthlyRent}
          onChange={(v) => update('monthlyRent', v)}
          min={0}
          step={50}
          thousands
        />
        <Field
          label="Rent inflation"
          prefix="%"
          unit="per year"
          value={inputs.rentInflationAnnual}
          onChange={(v) => update('rentInflationAnnual', v)}
          min={0}
          asPercent
        />
        <Field
          label="Moving cost"
          prefix="£"
          unit="per move"
          hint="Removals each time you change rental"
          value={inputs.movingCostPerMove}
          onChange={(v) => update('movingCostPerMove', v)}
          min={0}
          step={100}
          thousands
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

      <Section title="Living costs (same in both)" icon={Receipt}>
        <Field
          label="Council tax"
          prefix="£"
          unit="/year"
          hint="Same regardless of buy or rent — informational only"
          value={inputs.councilTaxAnnual}
          onChange={(v) => update('councilTaxAnnual', v)}
          min={0}
          step={50}
          thousands
        />
        <Field
          label="Utilities"
          prefix="£"
          unit="/year"
          hint="Energy, water, broadband. Roughly the same for either path."
          value={inputs.utilitiesAnnual}
          onChange={(v) => update('utilitiesAnnual', v)}
          min={0}
          step={50}
          thousands
        />
      </Section>

      <Section title="Market assumptions" icon={TrendingUp}>
        <Field
          label="House price growth"
          prefix="%"
          unit="per year"
          hint="UK long-run: ~3–4% nominal"
          value={inputs.houseAppreciationAnnual}
          onChange={(v) => update('houseAppreciationAnnual', v)}
          asPercent
        />
        <Field
          label={inputs.useDifferentReturnForBuy ? 'Investment return — rent path' : 'Investment return'}
          prefix="%"
          unit="per year"
          hint={
            inputs.useDifferentReturnForBuy
              ? 'Blended rate on your full cash pool (the rent path keeps everything invested).'
              : 'Blended ~4% (cash + Premium Bonds + some equities). Pure ISA equities long-run ~6–7%.'
          }
          value={inputs.investmentReturnAnnual}
          onChange={(v) =>
            // When the toggle is OFF, keep the buy rate locked to the rent
            // rate so flipping the toggle on doesn't show a stale number.
            inputs.useDifferentReturnForBuy
              ? update('investmentReturnAnnual', v)
              : onChange({ ...inputs, investmentReturnAnnual: v, investmentReturnBuyAnnual: v })
          }
          min={0}
          asPercent
        />
        <div className="sm:col-span-2">
          <ToggleField
            label="Use a different rate for the buy path"
            hint="Use if your cash is spread across rate tiers — you'd drain the lowest-yielding accounts first for the deposit, leaving the remaining cash skewed toward higher-yield accounts (e.g. Premium Bonds + ISA equities)."
            value={inputs.useDifferentReturnForBuy}
            onChange={(v) => update('useDifferentReturnForBuy', v)}
          />
        </div>
        {inputs.useDifferentReturnForBuy && (
          <Field
            label="Investment return — buy path"
            prefix="%"
            unit="per year"
            hint="Marginal rate on the cash that remains after the deposit. Often higher than your blended rate — e.g. if your cash savings (low rate) gets spent first, leaving Premium Bonds + ISA equities."
            value={inputs.investmentReturnBuyAnnual}
            onChange={(v) => update('investmentReturnBuyAnnual', v)}
            min={0}
            asPercent
          />
        )}
        <Field
          label="Time horizon"
          unit="years"
          hint="When would you sell / end the comparison? Try shorter horizons (5–10y) to test moving early."
          value={inputs.yearsToSimulate}
          onChange={(v) => update('yearsToSimulate', v)}
          min={1}
          max={50}
        />
      </Section>
    </div>
  )
}
