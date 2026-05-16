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
  isDark?: boolean
}

const BUY_LIGHT = '#15803d'
const BUY_DARK = '#34d399'
const RENT_LIGHT = '#b45309'
const RENT_DARK = '#fbbf24'

export function MonteCarloPanel({ inputs, isDark = false }: Props) {
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
  const statAccentClass =
    pBuy >= 0.5
      ? 'text-emerald-700 dark:text-emerald-400'
      : 'text-amber-800 dark:text-amber-400'

  const buyColour = isDark ? BUY_DARK : BUY_LIGHT
  const rentColour = isDark ? RENT_DARK : RENT_LIGHT
  const gridStroke = isDark ? '#44403c' : '#e7e5e4'
  const axisStroke = isDark ? '#a8a29e' : '#78716c'
  const tooltipBg = isDark ? '#1c1917' : '#ffffff'
  const tooltipBorder = isDark ? '#44403c' : '#e7e5e4'
  const tooltipText = isDark ? '#f5f5f4' : '#1c1917'

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <Dices className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            How robust is the verdict?
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
            The verdict above assumes one fixed set of market conditions. In reality,
            house prices, rents and investment returns vary every year. This re-runs
            the simulation <span className="font-semibold text-stone-900 dark:text-stone-200">{result.runs} times</span>,
            varying each year's rates within realistic ranges, and counts how often
            buying ends ahead.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center mb-4">
        <div className="rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-5 py-4 text-center sm:text-left">
          <p className="text-xs uppercase tracking-wide font-semibold text-stone-600 dark:text-stone-400">
            Buy wins in
          </p>
          <p className={`text-4xl font-bold tabular-nums ${statAccentClass}`}>
            {formatPercent(pBuy)}
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">of futures</p>
        </div>
        <p className="text-sm text-stone-700 dark:text-stone-300">
          <span className="font-semibold text-stone-900 dark:text-stone-100">{verdictText}.</span>{' '}
          {pBuy >= 0.55 ? (
            <>The buy path beats rent in most plausible scenarios.</>
          ) : pBuy >= 0.45 ? (
            <>Neither side has a meaningful edge — the answer depends heavily on assumptions you can't pin down.</>
          ) : (
            <>The rent path beats buy in most plausible scenarios.</>
          )}
        </p>
      </div>

      <div className="rounded-md bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-4 py-3 text-xs text-stone-700 dark:text-stone-300 mb-4 leading-relaxed">
        <span className="font-semibold text-stone-900 dark:text-stone-100">How to read the chart:</span>{' '}
        the solid lines are the <em>median</em> outcome for each path — what happens
        in the middle of the pack. The shaded bands cover the middle 90% of outcomes
        (5th to 95th percentile). <span className="font-semibold text-stone-900 dark:text-stone-100">Wide bands mean the
        answer is highly sensitive to luck</span>; narrow bands mean the path is
        relatively predictable.
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 8, bottom: 24 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="year"
              stroke={axisStroke}
              tick={{ fill: axisStroke }}
              label={{ value: 'Year', position: 'insideBottom', offset: -10, fill: axisStroke }}
            />
            <YAxis
              stroke={axisStroke}
              tick={{ fill: axisStroke }}
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
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${tooltipBorder}`,
                background: tooltipBg,
                color: tooltipText,
                fontSize: 12,
              }}
              labelStyle={{ color: tooltipText }}
              itemStyle={{ color: tooltipText }}
            />
            <Legend wrapperStyle={{ paddingTop: 12, color: axisStroke }} />
            <Area
              type="monotone"
              dataKey="buyBand"
              name="Buy (5–95%)"
              stroke="none"
              fill={buyColour}
              fillOpacity={0.15}
            />
            <Area
              type="monotone"
              dataKey="rentBand"
              name="Rent (5–95%)"
              stroke="none"
              fill={rentColour}
              fillOpacity={0.15}
            />
            <Line
              type="monotone"
              dataKey="buyMedian"
              name="Buy median"
              stroke={buyColour}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="rentMedian"
              name="Rent median"
              stroke={rentColour}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
