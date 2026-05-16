import type { SimulationResult } from '../finance/types'
import { formatGBP } from '../utils/format'
import { BreakEvenChart } from './BreakEvenChart'

type Props = {
  result: SimulationResult
  horizonYears: number
}

export function ResultsPanel({ result, horizonYears }: Props) {
  const finalYear = result.years[result.years.length - 1]
  const buyWins = finalYear ? finalYear.buyMinusRent >= 0 : false

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Verdict at year {horizonYears}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {buyWins ? 'Buying wins' : 'Renting wins'} by{' '}
          <span className={buyWins ? 'text-emerald-600' : 'text-rose-600'}>
            {finalYear ? formatGBP(Math.abs(finalYear.buyMinusRent)) : '—'}
          </span>
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {result.breakEvenYear !== null
            ? `Buying overtakes renting in year ${result.breakEvenYear}.`
            : 'Buying never overtakes renting within this horizon.'}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Net wealth over time</h3>
        <BreakEvenChart years={result.years} breakEvenYear={result.breakEvenYear} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Stamp Duty (SDLT)" value={formatGBP(result.sdlt)} />
        <StatCard
          label="Total upfront buy cost"
          value={formatGBP(result.totalUpfrontBuyCost)}
          hint="Deposit + SDLT + legal + mortgage fee"
        />
        <StatCard
          label="Monthly mortgage payment"
          value={formatGBP(result.monthlyMortgagePayment)}
          hint="At the chosen rate"
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
            tone="rose"
          />
        </div>
      )}
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
  tone?: 'emerald' | 'rose'
}) {
  const valueColor =
    tone === 'emerald'
      ? 'text-emerald-700'
      : tone === 'rose'
        ? 'text-rose-700'
        : 'text-slate-900'
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
