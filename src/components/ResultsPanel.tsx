import { TrendingDown, TrendingUp } from 'lucide-react'
import type { SimulationResult } from '../finance/types'
import type { ThemeTokens } from '../themes'
import { formatGBP } from '../utils/format'
import { BreakEvenChart } from './BreakEvenChart'

type Props = {
  result: SimulationResult
  horizonYears: number
  theme: ThemeTokens
}

export function ResultsPanel({ result, horizonYears, theme }: Props) {
  const finalYear = result.years[result.years.length - 1]
  const buyWins = finalYear ? finalYear.buyMinusRent >= 0 : false

  const verdictClasses = buyWins ? theme.verdictBuy : theme.verdictRent
  const verdictAccent = buyWins ? theme.verdictAccentBuy : theme.verdictAccentRent
  const VerdictIcon = buyWins ? TrendingUp : TrendingDown

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl border-2 p-8 shadow-md ${verdictClasses}`}>
        <div className="flex items-start gap-5">
          <div className="rounded-full bg-white/70 p-3 shadow-sm shrink-0">
            <VerdictIcon className={`h-7 w-7 ${verdictAccent}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs uppercase tracking-wide font-semibold ${verdictAccent}`}>
              Verdict at year {horizonYears}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {buyWins ? 'Buying wins' : 'Renting wins'}
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              by{' '}
              <span className={verdictAccent}>
                {finalYear ? formatGBP(Math.abs(finalYear.buyMinusRent)) : '—'}
              </span>
            </p>
            <p className="mt-3 text-sm text-slate-700">
              {result.breakEvenYear !== null
                ? `Buying overtakes renting in year ${result.breakEvenYear}.`
                : 'Buying never overtakes renting within this horizon.'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Net wealth over time</h3>
        <BreakEvenChart years={result.years} breakEvenYear={result.breakEvenYear} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Stamp duty" value={formatGBP(result.sdlt)} />
        <StatCard
          label="Total upfront buy cost"
          value={formatGBP(result.totalUpfrontBuyCost)}
          hint="Deposit + stamp duty + legal + mortgage fee"
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
            tone="amber"
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
  tone?: 'emerald' | 'amber'
}) {
  const valueColor =
    tone === 'emerald'
      ? 'text-emerald-700'
      : tone === 'amber'
        ? 'text-amber-800'
        : 'text-slate-900'
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
