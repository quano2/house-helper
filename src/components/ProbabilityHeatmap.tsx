import { useMemo } from 'react'
import { Grid3x3 } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { simulate } from '../finance/simulate'
import { formatGBPCompact } from '../utils/format'

type Props = {
  inputs: Inputs
}

const RATES = [0.03, 0.035, 0.04, 0.045, 0.05, 0.055, 0.06, 0.065, 0.07]
const HORIZONS = [5, 10, 15, 20, 25, 30]

export function ProbabilityHeatmap({ inputs }: Props) {
  const cells = useMemo(() => {
    const all = HORIZONS.map((horizon) =>
      RATES.map((rate) => {
        const result = simulate({ ...inputs, mortgageRate: rate, yearsToSimulate: horizon })
        const final = result.years[result.years.length - 1]
        return { rate, horizon, diff: final?.buyMinusRent ?? 0 }
      }),
    )
    const max = Math.max(...all.flat().map((c) => Math.abs(c.diff)))
    return { grid: all, max }
  }, [inputs])

  function cellColor(diff: number): string {
    if (diff === 0) return 'bg-stone-100 dark:bg-slate-800'
    const intensity = Math.min(1, Math.abs(diff) / Math.max(1, cells.max))
    // Map intensity to a 50-700 colour
    const step = Math.round(intensity * 5) // 0..5
    if (diff > 0) {
      const greens = [
        'bg-emerald-50 dark:bg-emerald-950/50',
        'bg-emerald-100 dark:bg-emerald-900/60',
        'bg-emerald-200 dark:bg-emerald-800/70',
        'bg-emerald-300 dark:bg-emerald-700/70',
        'bg-emerald-400 dark:bg-emerald-600/80',
        'bg-emerald-500 dark:bg-emerald-500/90',
      ]
      return greens[step]
    } else {
      const ambers = [
        'bg-amber-50 dark:bg-amber-950/50',
        'bg-amber-100 dark:bg-amber-900/60',
        'bg-amber-200 dark:bg-amber-800/70',
        'bg-amber-300 dark:bg-amber-700/70',
        'bg-amber-400 dark:bg-amber-600/80',
        'bg-amber-500 dark:bg-amber-500/90',
      ]
      return ambers[step]
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <Grid3x3 className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
            Verdict heatmap — mortgage rate × time horizon
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
            Each cell is a separate simulation with your current scenario but a
            different rate and horizon. <span className="font-semibold text-emerald-700 dark:text-emerald-500">Green</span> = buying wins,{' '}
            <span className="font-semibold text-amber-800 dark:text-amber-500">amber</span> = renting wins.
            Intensity = how decisive. Useful for seeing where the verdict flips.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-xs mx-auto">
          <thead>
            <tr>
              <th className="px-2 py-1 text-stone-500 dark:text-slate-400 text-right">
                horizon ↓ / rate →
              </th>
              {RATES.map((r) => (
                <th
                  key={r}
                  className="px-2 py-1 text-center font-medium text-stone-600 dark:text-slate-400 tabular-nums"
                >
                  {(r * 100).toFixed(1)}%
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.grid.map((row, i) => (
              <tr key={HORIZONS[i]}>
                <td className="px-2 py-1 text-right font-medium text-stone-600 dark:text-slate-400 tabular-nums">
                  {HORIZONS[i]}y
                </td>
                {row.map((cell, j) => {
                  const isUser =
                    Math.abs(cell.rate - inputs.mortgageRate) < 0.0026 &&
                    cell.horizon === inputs.yearsToSimulate
                  return (
                    <td
                      key={j}
                      title={`Rate ${(cell.rate * 100).toFixed(1)}%, horizon ${cell.horizon}y → ${cell.diff >= 0 ? 'buy' : 'rent'} ahead by ${formatGBPCompact(Math.abs(cell.diff))}`}
                      className={`${cellColor(cell.diff)} px-3 py-3 text-center tabular-nums text-stone-900 dark:text-slate-100 ${isUser ? 'outline outline-2 outline-orange-600 dark:outline-sky-400 outline-offset-[-2px] font-bold' : ''}`}
                    >
                      {cell.diff >= 0 ? '+' : '−'}
                      {formatGBPCompact(Math.abs(cell.diff)).replace('£', '')}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        Outlined cell = your current scenario. Values show Buy − Rent net worth at horizon.
      </p>
    </div>
  )
}
