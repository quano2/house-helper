import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { History } from 'lucide-react'
import type { Inputs } from '../finance/types'
import {
  FIRST_HISTORICAL_YEAR,
  latestStartYearForHorizon,
  simulateHistorical,
} from '../finance/historical'
import { formatGBP, formatGBPCompact, formatPercent } from '../utils/format'

type Props = {
  inputs: Inputs
}

const BUY_COLOUR = '#15803d'
const RENT_COLOUR = '#b45309'

export function HistoricalPanel({ inputs }: Props) {
  const latestStart = latestStartYearForHorizon(inputs.yearsToSimulate)
  const defaultStart = Math.min(1995, latestStart)
  const [startYear, setStartYear] = useState(defaultStart)

  // If horizon shrinks past the chosen start, clamp it
  const effectiveStart = Math.min(startYear, latestStart)

  const result = useMemo(
    () => simulateHistorical(inputs, effectiveStart),
    [inputs, effectiveStart],
  )

  const data = result.simulation.years.map((y) => ({
    yearLabel: result.startYear + y.year - 1,
    buy: Math.round(y.buyNetWorth),
    rent: Math.round(y.rentNetWorth),
  }))

  const final = result.simulation.years[result.simulation.years.length - 1]
  const buyWon = final.buyMinusRent >= 0

  const yearOptions: number[] = []
  for (let y = FIRST_HISTORICAL_YEAR; y <= latestStart; y++) yearOptions.push(y)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <History className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900">
            Historical backtest — what actually happened
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Uses real UK data (Nationwide HPI, FTSE All-Share, CPI, average mortgage
            rates) from the chosen start year. Your house price stays the same — only
            the year-by-year market movements come from history.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <span>Start year:</span>
          <select
            value={effectiveStart}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-stone-600">
          Mortgage fixed at {formatPercent(result.mortgageRateUsed)} (the {result.startYear} average).
          Simulated through {result.endYear} ({result.yearsSimulated} years).
        </p>
      </div>

      <div className={`rounded-lg p-4 mb-4 ${buyWon ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
        <p className="text-sm text-slate-800">
          From <span className="font-semibold">{result.startYear}</span> to{' '}
          <span className="font-semibold">{result.endYear}</span>,{' '}
          <span className={`font-bold ${buyWon ? 'text-emerald-700' : 'text-amber-700'}`}>
            {buyWon ? 'buying' : 'renting'} would have been ahead by{' '}
            {formatGBP(Math.abs(final.buyMinusRent))}
          </span>
          .
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 24 }}>
            <defs>
              <linearGradient id="histBuyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BUY_COLOUR} stopOpacity={0.3} />
                <stop offset="100%" stopColor={BUY_COLOUR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="histRentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={RENT_COLOUR} stopOpacity={0.2} />
                <stop offset="100%" stopColor={RENT_COLOUR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="yearLabel" stroke="#78716c" />
            <YAxis
              stroke="#78716c"
              tickFormatter={(v: number) => formatGBPCompact(v)}
              width={80}
            />
            <Tooltip
              formatter={(v) => (typeof v === 'number' ? formatGBP(v) : String(v ?? ''))}
              contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ paddingTop: 12 }} />
            <Area
              type="monotone"
              dataKey="buy"
              name="Buy"
              stroke={BUY_COLOUR}
              strokeWidth={2.5}
              fill="url(#histBuyGradient)"
            />
            <Area
              type="monotone"
              dataKey="rent"
              name="Rent"
              stroke={RENT_COLOUR}
              strokeWidth={2.5}
              fill="url(#histRentGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-stone-500 mt-3">
        Historical values are approximate (rounded to ~0.5%). For precise comparison
        consult Nationwide HPI, BoE statistics, and ONS CPI directly.
      </p>
    </div>
  )
}
