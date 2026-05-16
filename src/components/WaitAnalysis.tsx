import { useMemo } from 'react'
import { Hourglass } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { simulateWithDelay } from '../finance/simulate'
import { formatGBP } from '../utils/format'

type Props = {
  inputs: Inputs
}

const WAIT_OPTIONS = [0, 1, 2, 3, 5]

export function WaitAnalysis({ inputs }: Props) {
  const rows = useMemo(
    () =>
      WAIT_OPTIONS.filter((w) => w < inputs.yearsToSimulate).map((wait) => {
        const result = simulateWithDelay(inputs, wait)
        const final = result.years[result.years.length - 1]
        // House price at the moment of purchase (current × growth^wait years).
        const purchaseTimePrice =
          inputs.housePrice * Math.pow(1 + inputs.houseAppreciationAnnual, wait)
        return {
          wait,
          diff: final?.buyMinusRent ?? 0,
          breakEvenYear: result.breakEvenYear,
          purchaseTimePrice,
        }
      }),
    [inputs],
  )

  const winnerIdx = rows.reduce(
    (best, r, i) => (r.diff > rows[best].diff ? i : best),
    0,
  )
  const bestWait = rows[winnerIdx]?.wait ?? 0
  const baseline = rows.find((r) => r.wait === 0)
  const baselineDiff = baseline?.diff ?? 0

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <Hourglass className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
            What if you wait before buying?
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
            Simulates "rent for N years, then buy and hold to the horizon"
            against the current scenario. House price grows by your appreciation
            rate during the wait; mortgage rate stays at your input (lower it
            to model a rate drop). Same horizon for every row so the comparison
            is apples-to-apples.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-stone-500 dark:text-slate-400">
              <th className="text-left px-2 py-2 font-semibold">Wait</th>
              <th className="text-right px-2 py-2 font-semibold">House price then</th>
              <th className="text-right px-2 py-2 font-semibold">Break-even</th>
              <th className="text-right px-2 py-2 font-semibold">Buy − Rent at year {inputs.yearsToSimulate}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isWinner = i === winnerIdx
              const buyAhead = r.diff >= 0
              const diffText = `${buyAhead ? '+' : '−'}${formatGBP(Math.abs(r.diff))}`
              const diffClass = buyAhead
                ? 'text-emerald-700 dark:text-emerald-500'
                : 'text-amber-800 dark:text-amber-500'
              return (
                <tr
                  key={r.wait}
                  className={
                    isWinner
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-t border-stone-200 dark:border-slate-700'
                      : 'border-t border-stone-200 dark:border-slate-700'
                  }
                >
                  <td className="px-2 py-2 font-semibold text-stone-900 dark:text-slate-100">
                    {r.wait === 0 ? 'Buy now' : `${r.wait}y`}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-stone-700 dark:text-slate-300">
                    {formatGBP(r.purchaseTimePrice)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-stone-700 dark:text-slate-300">
                    {r.breakEvenYear !== null ? `Year ${r.breakEvenYear}` : '—'}
                  </td>
                  <td className={`px-2 py-2 text-right tabular-nums font-semibold ${diffClass}`}>
                    {diffText}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        Highlighted row = best Buy − Rent outcome. {bestWait === 0
          ? 'Buying now is at least as good as waiting in your scenario.'
          : `Waiting ${bestWait}y comes out ${formatGBP(Math.abs(rows[winnerIdx].diff - baselineDiff))} better than buying now.`}
      </p>
      <p className="mt-1 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        To model "rates drop after I wait", lower the mortgage rate input and re-read. The wait rows then reflect buying at that lower rate after the wait period. The model assumes the rate input applies at purchase time — not historical.
      </p>
      <p className="mt-1 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        Absolute net worth values aren't shown because they'd exclude your monthly savings (the model doesn't have a salary/savings input), making them systematically low. The Buy − Rent comparison is unaffected since monthly savings would apply equally to both paths.
      </p>
    </div>
  )
}
