import { TrendingDown, TrendingUp } from 'lucide-react'
import type { Inputs, SimulationResult } from '../finance/types'
import { formatGBP } from '../utils/format'
import { BreakEvenChart } from './BreakEvenChart'
import { MonteCarloPanel } from './MonteCarloPanel'

type Props = {
  inputs: Inputs
  result: SimulationResult
  horizonYears: number
  isDark?: boolean
}

export function ResultsPanel({ inputs, result, horizonYears, isDark = false }: Props) {
  const finalYear = result.years[result.years.length - 1]
  const buyWins = finalYear ? finalYear.buyMinusRent >= 0 : false

  const verdictClasses = buyWins
    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
    : 'border-amber-400 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
  const verdictAccent = buyWins
    ? 'text-emerald-800 dark:text-emerald-300'
    : 'text-amber-800 dark:text-amber-300'
  const VerdictIcon = buyWins ? TrendingUp : TrendingDown

  return (
    <div className="space-y-6">
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
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-4">Net wealth over time</h3>
        <BreakEvenChart years={result.years} breakEvenYear={result.breakEvenYear} isDark={isDark} />
      </div>

      <MonthlyCostsCard inputs={inputs} monthlyMortgagePayment={result.monthlyMortgagePayment} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Stamp duty" value={formatGBP(result.sdlt)} />
        <StatCard
          label="Total upfront buy cost"
          value={formatGBP(result.totalUpfrontBuyCost)}
          hint="Deposit + stamp duty + legal + mortgage fee"
        />
        {finalYear && (
          <StatCard
            label={`House value in year ${horizonYears}`}
            value={formatGBP(finalYear.houseValue)}
          />
        )}
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
  const diff = buyTotal - rent
  const pct = rent > 0 ? Math.abs(diff) / rent : 0

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-4">
        Year 1 monthly costs
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold text-emerald-800 dark:text-emerald-400">
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
          <p className="text-xs uppercase tracking-wide font-semibold text-amber-800 dark:text-amber-400">
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
      ? 'text-emerald-700 dark:text-emerald-400'
      : tone === 'amber'
        ? 'text-amber-800 dark:text-amber-400'
        : 'text-stone-900 dark:text-slate-100'
  return (
    <div className="rounded-lg border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}
