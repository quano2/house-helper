import { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Dices } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { simulateMonteCarlo } from '../finance/monteCarlo'
import { formatGBPCompact, formatPercent } from '../utils/format'

type Props = {
  inputs: Inputs
}

const BUY_COLOUR = '#15803d' // emerald-700
const RENT_COLOUR = '#b45309' // amber-700

export function MonteCarloPanel({ inputs }: Props) {
  // Recompute when the inputs change. 500 runs takes < 1s in modern browsers.
  const result = useMemo(() => simulateMonteCarlo(inputs, 500), [inputs])

  const chartData = useMemo(
    () =>
      result.years.map((y) => ({
        year: y.year,
        buyBand: [Math.round(y.buyP5), Math.round(y.buyP95)],
        buyMedian: Math.round(y.buyP50),
        rentBand: [Math.round(y.rentP5), Math.round(y.rentP95)],
        rentMedian: Math.round(y.rentP50),
      })),
    [result],
  )

  const pBuy = result.pBuyWinsAtHorizon
  const verdictText =
    pBuy >= 0.7
      ? 'Buying looks robust'
      : pBuy >= 0.55
        ? 'Buying is the better bet'
        : pBuy >= 0.45
          ? 'Genuinely a coin flip'
          : pBuy >= 0.3
            ? 'Renting is the better bet'
            : 'Renting looks robust'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <Dices className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Monte Carlo — how robust is the verdict?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {result.runs} simulations sampling annual house prices, rents and investment returns
            from realistic distributions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center mb-4">
        <div className="rounded-lg bg-stone-50 border border-stone-200 px-5 py-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-wide font-semibold text-stone-600">
            Buy wins in
          </p>
          <p className="text-4xl font-bold text-orange-700">
            {formatPercent(pBuy)}
          </p>
          <p className="text-xs text-stone-600 mt-1">of futures</p>
        </div>
        <p className="text-sm text-slate-700">
          <span className="font-semibold">{verdictText}.</span>{' '}
          {pBuy >= 0.55 ? (
            <>The buy path beats rent in most plausible scenarios.</>
          ) : pBuy >= 0.45 ? (
            <>Neither side has a meaningful edge — the answer depends heavily on the assumptions you can't pin down.</>
          ) : (
            <>The rent path beats buy in most plausible scenarios.</>
          )}{' '}
          The bands below show the 5th–95th percentile range of outcomes — wide bands mean high uncertainty.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="year"
              stroke="#78716c"
              label={{ value: 'Year', position: 'insideBottom', offset: -10, fill: '#78716c' }}
            />
            <YAxis
              stroke="#78716c"
              tickFormatter={(v: number) => formatGBPCompact(v)}
              width={80}
            />
            <Tooltip
              formatter={(v, name) => {
                if (Array.isArray(v)) {
                  const [lo, hi] = v as [number, number]
                  return [`${formatGBPCompact(lo)} – ${formatGBPCompact(hi)}`, String(name)]
                }
                return [typeof v === 'number' ? formatGBPCompact(v) : String(v ?? ''), String(name)]
              }}
              labelFormatter={(label) => `Year ${label}`}
              contentStyle={{ borderRadius: 8, border: '1px solid #e7e5e4', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ paddingTop: 12 }} />
            <Area
              type="monotone"
              dataKey="buyBand"
              name="Buy (5–95%)"
              stroke="none"
              fill={BUY_COLOUR}
              fillOpacity={0.15}
            />
            <Area
              type="monotone"
              dataKey="rentBand"
              name="Rent (5–95%)"
              stroke="none"
              fill={RENT_COLOUR}
              fillOpacity={0.15}
            />
            <Line
              type="monotone"
              dataKey="buyMedian"
              name="Buy median"
              stroke={BUY_COLOUR}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rentMedian"
              name="Rent median"
              stroke={RENT_COLOUR}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
