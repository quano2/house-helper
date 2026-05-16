import { useMemo } from 'react'
import { Scale } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { simulate } from '../finance/simulate'
import { formatGBP } from '../utils/format'

type Props = {
  inputs: Inputs
  onApply: (depositAmount: number, mortgageRate: number) => void
}

/**
 * Typical UK 5-year fixed rate spread above the best (60% LTV) tier.
 * Relative — the user's "best rate" is derived from whatever rate they
 * currently have at their current LTV, then each row computes
 * best_rate + that tier's spread. The relative spread between tiers
 * is much more stable over time than the absolute level.
 */
type LtvBand = {
  ltv: number // 0..1 (loan / house value)
  depositPercent: number
  spreadAboveBest: number
}

const LTV_BANDS: LtvBand[] = [
  { ltv: 0.60, depositPercent: 0.40, spreadAboveBest: 0.0 },
  { ltv: 0.75, depositPercent: 0.25, spreadAboveBest: 0.001 },
  { ltv: 0.80, depositPercent: 0.20, spreadAboveBest: 0.002 },
  { ltv: 0.85, depositPercent: 0.15, spreadAboveBest: 0.003 },
  { ltv: 0.90, depositPercent: 0.10, spreadAboveBest: 0.005 },
  { ltv: 0.95, depositPercent: 0.05, spreadAboveBest: 0.009 },
]

function spreadForLtv(ltv: number): number {
  // Find the band whose LTV is closest to the given value
  let closest = LTV_BANDS[0]
  let bestDelta = Math.abs(ltv - closest.ltv)
  for (const band of LTV_BANDS) {
    const d = Math.abs(ltv - band.ltv)
    if (d < bestDelta) {
      bestDelta = d
      closest = band
    }
  }
  return closest.spreadAboveBest
}

export function DepositComparison({ inputs, onApply }: Props) {
  const userLtv =
    inputs.housePrice > 0
      ? Math.max(0, Math.min(1, 1 - inputs.depositAmount / inputs.housePrice))
      : 0.85
  const userSpread = spreadForLtv(userLtv)
  const bestRate = Math.max(0, inputs.mortgageRate - userSpread)

  const rows = useMemo(
    () =>
      LTV_BANDS.map((band) => {
        const depositAmount = Math.round(inputs.housePrice * band.depositPercent)
        const rate = bestRate + band.spreadAboveBest
        const scenarioInputs: Inputs = {
          ...inputs,
          depositAmount,
          mortgageRate: rate,
        }
        const result = simulate(scenarioInputs)
        const final = result.years[result.years.length - 1]
        return {
          depositPercent: band.depositPercent,
          depositAmount,
          rate,
          monthly: result.monthlyMortgagePayment,
          verdictDiff: final?.buyMinusRent ?? 0,
        }
      }),
    [inputs, bestRate],
  )

  const winnerIdx = rows.reduce(
    (bestI, r, i) => (r.verdictDiff > rows[bestI].verdictDiff ? i : bestI),
    0,
  )
  const userIdx = rows.reduce(
    (bestI, r, i) =>
      Math.abs(r.depositPercent - (1 - userLtv)) <
      Math.abs(rows[bestI].depositPercent - (1 - userLtv))
        ? i
        : bestI,
    0,
  )

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <Scale className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
            Deposit / mortgage rate comparison
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
            UK mortgage rates rise with loan-to-value. This table derives a
            typical rate for each deposit level from <em>your</em> current rate,
            then re-runs the simulation. Click <span className="font-semibold text-stone-900 dark:text-slate-200">Use</span> to apply a scenario.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-stone-500 dark:text-slate-400">
              <th className="text-left px-2 py-2 font-semibold">Deposit</th>
              <th className="text-right px-2 py-2 font-semibold">Rate</th>
              <th className="text-right px-2 py-2 font-semibold">Monthly</th>
              <th className="text-right px-2 py-2 font-semibold">Buy − Rent</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isWinner = i === winnerIdx
              const isUser = i === userIdx
              const buyAhead = r.verdictDiff >= 0
              const diffText = `${buyAhead ? '+' : '−'}${formatGBP(Math.abs(r.verdictDiff))}`
              const diffClass = buyAhead
                ? 'text-emerald-700 dark:text-emerald-500'
                : 'text-amber-800 dark:text-amber-500'
              return (
                <tr
                  key={i}
                  className={
                    isWinner
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-t border-stone-200 dark:border-slate-700'
                      : 'border-t border-stone-200 dark:border-slate-700'
                  }
                >
                  <td className="px-2 py-2 tabular-nums">
                    <span className="font-semibold text-stone-900 dark:text-slate-100">
                      {Math.round(r.depositPercent * 100)}%
                    </span>{' '}
                    <span className="text-xs text-stone-500 dark:text-slate-400">
                      ({formatGBP(r.depositAmount)})
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-stone-700 dark:text-slate-300">
                    {(r.rate * 100).toFixed(2)}%
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-stone-700 dark:text-slate-300">
                    {formatGBP(r.monthly)}
                  </td>
                  <td className={`px-2 py-2 text-right tabular-nums font-semibold ${diffClass}`}>
                    {diffText}
                  </td>
                  <td className="px-2 py-2 text-right">
                    {isUser ? (
                      <span className="text-xs uppercase tracking-wide text-stone-500 dark:text-slate-400">
                        Current
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onApply(r.depositAmount, r.rate)}
                        className="text-xs bg-orange-600 hover:bg-orange-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white px-2.5 py-1 rounded-md"
                      >
                        Use
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        <span className="font-semibold text-stone-700 dark:text-slate-300">Highlighted row</span> = best Buy − Rent outcome in this set. Other inputs (rent, horizon, house price, market assumptions) come from your current scenario.
      </p>
      <p className="mt-1 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        LTV rate spreads are approximate (~0.1%/0.2%/0.5%/0.9% above the 60% LTV rate at 25/15/10/5% deposit). Actual lender offers vary.
      </p>
    </div>
  )
}
