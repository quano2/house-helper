import { useState } from 'react'
import { Info, Receipt, TrendingDown, TrendingUp } from 'lucide-react'
import type { Inputs, SimulationResult } from '../finance/types'
import { formatGBP } from '../utils/format'
import { AssumptionsModal } from './AssumptionsModal'
import { BreakEvenChart } from './BreakEvenChart'
import { MonteCarloPanel } from './MonteCarloPanel'
import { WaitAnalysis } from './WaitAnalysis'

type Props = {
  inputs: Inputs
  result: SimulationResult
  horizonYears: number
  isDark?: boolean
}

export function ResultsPanel({ inputs, result, horizonYears, isDark = false }: Props) {
  const [assumptionsOpen, setAssumptionsOpen] = useState(false)
  const finalYear = result.years[result.years.length - 1]
  const buyWins = finalYear ? finalYear.buyMinusRent >= 0 : false

  // In dark mode the body stays slate (matches every other card) but uses
  // a slightly lighter shade than the surrounding cards so the verdict
  // still "lifts" visually; the coloured border carries the verdict
  // semantic instead of tinting the whole body brown/green.
  const verdictClasses = buyWins
    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-600 dark:bg-slate-800'
    : 'border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-slate-800'
  const verdictAccent = buyWins
    ? 'text-emerald-800 dark:text-emerald-400'
    : 'text-amber-800 dark:text-amber-500'
  const VerdictIcon = buyWins ? TrendingUp : TrendingDown

  return (
    <div className="space-y-6">
      <AssumptionsModal open={assumptionsOpen} onClose={() => setAssumptionsOpen(false)} />
      <div className={`rounded-2xl border-2 p-8 shadow-md ${verdictClasses}`}>
        <div className="flex items-start gap-5">
          <div className="rounded-full bg-white/70 dark:bg-slate-900/60 p-3 shadow-sm shrink-0">
            <VerdictIcon className={`h-7 w-7 ${verdictAccent}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs uppercase tracking-wide font-semibold ${verdictAccent}`}>
              Verdict at year {horizonYears}
            </p>
            <p className="mt-2 text-lg text-stone-700 dark:text-slate-300">
              {buyWins ? 'Buying wins by' : 'Renting wins by'}
            </p>
            <p className={`mt-0.5 text-4xl sm:text-5xl font-bold tracking-tight tabular-nums ${verdictAccent}`}>
              {finalYear ? formatGBP(Math.abs(finalYear.buyMinusRent)) : '—'}
            </p>
            <p className="mt-3 text-sm text-stone-700 dark:text-slate-300">
              {result.breakEvenYear !== null
                ? `Buying overtakes renting in year ${result.breakEvenYear}.`
                : 'Buying never overtakes renting within this horizon.'}
            </p>
            <button
              type="button"
              onClick={() => setAssumptionsOpen(true)}
              className="mt-3 inline-flex items-center gap-1 text-xs text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200 hover:underline print:hidden"
            >
              <Info className="h-3 w-3" />
              How this is calculated
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-4">Net wealth over time</h3>
        <BreakEvenChart years={result.years} breakEvenYear={result.breakEvenYear} isDark={isDark} />
      </div>

      <MonthlyCostsCard inputs={inputs} monthlyMortgagePayment={result.monthlyMortgagePayment} />

      <UpfrontCostBreakdown inputs={inputs} sdlt={result.sdlt} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {finalYear && (
          <StatCard
            label={`House value in year ${horizonYears}`}
            value={formatGBP(finalYear.houseValue)}
            hint="Today's price grown at your appreciation rate"
          />
        )}
        <StatCard
          label="Monthly mortgage P&I"
          value={formatGBP(result.monthlyMortgagePayment)}
          hint="Principal + interest only"
        />
      </div>

      {finalYear && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label={`Buy net worth at year ${horizonYears}`}
            value={formatGBP(finalYear.buyNetWorth)}
            hint="Sale proceeds − mortgage + any invested savings"
            tone="emerald"
          />
          <StatCard
            label={`Rent net worth at year ${horizonYears}`}
            value={formatGBP(finalYear.rentNetWorth)}
            hint="Initial capital + monthly savings, invested"
            tone="amber"
          />
        </div>
      )}

      <MonteCarloPanel inputs={inputs} isDark={isDark} />

      <WaitAnalysis inputs={inputs} />
    </div>
  )
}

function MonthlyCostsCard({
  inputs,
  monthlyMortgagePayment,
}: {
  inputs: Inputs
  monthlyMortgagePayment: number
}) {
  const maintenance = (inputs.housePrice * inputs.maintenancePercent) / 12
  const insurance = inputs.buildingsInsuranceAnnual / 12
  const service = inputs.serviceChargeAnnual / 12
  const buyTotal = monthlyMortgagePayment + maintenance + insurance + service
  const rent = inputs.monthlyRent
  const sharedMonthly = (inputs.councilTaxAnnual + inputs.utilitiesAnnual) / 12
  const diff = buyTotal - rent
  const pct = rent > 0 ? Math.abs(diff) / rent : 0

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
        Year 1 monthly housing costs
      </h3>
      <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 mb-4">
        Housing only — what each path pays for the roof. Council tax + utilities
        are the same either way, so they're listed separately below.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold text-emerald-800 dark:text-emerald-500">
            Buy
          </p>
          <p className="text-3xl font-bold tabular-nums text-stone-900 dark:text-slate-100 mt-1">
            {formatGBP(buyTotal)}
            <span className="text-sm font-normal text-stone-500 dark:text-slate-400"> / month</span>
          </p>
          <dl className="mt-3 space-y-1 text-sm">
            <Row label="Mortgage (P&I)" value={formatGBP(monthlyMortgagePayment)} />
            <Row label="Maintenance" value={formatGBP(maintenance)} />
            <Row label="Insurance" value={formatGBP(insurance)} />
            {service > 0 && <Row label="Service & ground rent" value={formatGBP(service)} />}
          </dl>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold text-amber-800 dark:text-amber-500">
            Rent
          </p>
          <p className="text-3xl font-bold tabular-nums text-stone-900 dark:text-slate-100 mt-1">
            {formatGBP(rent)}
            <span className="text-sm font-normal text-stone-500 dark:text-slate-400"> / month</span>
          </p>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-3">
            Single line item — landlord covers maintenance & buildings insurance.
          </p>
        </div>
      </div>
      <p className="mt-4 pt-4 border-t border-stone-200 dark:border-slate-700 text-sm text-stone-700 dark:text-slate-300">
        {diff > 0 ? (
          <>
            Buying costs{' '}
            <span className="font-semibold tabular-nums text-stone-900 dark:text-slate-100">{formatGBP(diff)}/month</span>{' '}
            more than renting ({(pct * 100).toFixed(0)}% more).
          </>
        ) : diff < 0 ? (
          <>
            Renting costs{' '}
            <span className="font-semibold tabular-nums text-stone-900 dark:text-slate-100">{formatGBP(-diff)}/month</span>{' '}
            more than buying ({(pct * 100).toFixed(0)}% more).
          </>
        ) : (
          <>Buy and rent monthly costs are equal in year 1.</>
        )}
      </p>

      {sharedMonthly > 0 && (
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-slate-700 text-sm">
          <p className="text-xs uppercase tracking-wide font-semibold text-stone-600 dark:text-slate-400">
            Shared costs (same either way)
          </p>
          <p className="mt-1 text-stone-700 dark:text-slate-300">
            Council tax + utilities ≈{' '}
            <span className="font-semibold tabular-nums text-stone-900 dark:text-slate-100">
              {formatGBP(sharedMonthly)}/month
            </span>
            . These cancel in the verdict (both paths pay them), but they matter
            for affordability — your full monthly outgoings are roughly{' '}
            <span className="font-semibold tabular-nums text-stone-900 dark:text-slate-100">
              {formatGBP(buyTotal + sharedMonthly)}
            </span>{' '}
            buying /{' '}
            <span className="font-semibold tabular-nums text-stone-900 dark:text-slate-100">
              {formatGBP(rent + sharedMonthly)}
            </span>{' '}
            renting.
          </p>
        </div>
      )}
    </div>
  )
}

function UpfrontCostBreakdown({ inputs, sdlt }: { inputs: Inputs; sdlt: number }) {
  const cappedDeposit = Math.min(Math.max(0, inputs.depositAmount), inputs.housePrice)
  const total = cappedDeposit + sdlt + inputs.legalAndSurveyFees + inputs.mortgageArrangementFee
  const rows = [
    { label: 'Deposit', value: cappedDeposit },
    { label: 'Stamp duty', value: sdlt },
    { label: 'Legal + survey', value: inputs.legalAndSurveyFees },
    { label: 'Arrangement fee', value: inputs.mortgageArrangementFee },
  ]

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <Receipt className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
            Upfront cost to buy
          </h3>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            The cash you need on day one — the cost of getting in the door.
          </p>
        </div>
      </div>

      <dl className="space-y-1.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <dt className="text-stone-600 dark:text-slate-400">{r.label}</dt>
            <dd className="tabular-nums text-stone-900 dark:text-slate-100">
              {formatGBP(r.value)}
            </dd>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-1 border-t border-stone-200 dark:border-slate-700">
          <dt className="font-semibold text-stone-900 dark:text-slate-100">Total upfront</dt>
          <dd className="tabular-nums font-bold text-lg text-stone-900 dark:text-slate-100">
            {formatGBP(total)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-stone-600 dark:text-slate-400">{label}</dt>
      <dd className="tabular-nums text-stone-900 dark:text-slate-100">{value}</dd>
    </div>
  )
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'emerald' | 'amber'
}) {
  const valueColor =
    tone === 'emerald'
      ? 'text-emerald-700 dark:text-emerald-500'
      : tone === 'amber'
        ? 'text-amber-800 dark:text-amber-500'
        : 'text-stone-900 dark:text-slate-100'
  return (
    <div className="rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}
