import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { YearResult } from '../finance/types'
import { formatGBP, formatGBPCompact } from '../utils/format'

type Props = {
  years: YearResult[]
  breakEvenYear: number | null
}

const BUY_COLOUR = '#15803d' // emerald-700
const RENT_COLOUR = '#b45309' // amber-700 — matches warm theme

export function BreakEvenChart({ years, breakEvenYear }: Props) {
  const data = years.map((y) => ({
    year: y.year,
    buy: Math.round(y.buyNetWorth),
    rent: Math.round(y.rentNetWorth),
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 24 }}>
          <defs>
            <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BUY_COLOUR} stopOpacity={0.35} />
              <stop offset="100%" stopColor={BUY_COLOUR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={RENT_COLOUR} stopOpacity={0.25} />
              <stop offset="100%" stopColor={RENT_COLOUR} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(v) => (typeof v === 'number' ? formatGBP(v) : String(v ?? ''))}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e7e5e4',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 12 }} />
          {breakEvenYear !== null && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="#78716c"
              strokeDasharray="4 4"
              label={{
                value: `Break-even (year ${breakEvenYear})`,
                position: 'insideTop',
                fill: '#44403c',
                fontSize: 12,
                offset: 8,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="buy"
            name="Buy"
            stroke={BUY_COLOUR}
            strokeWidth={2.5}
            fill="url(#buyGradient)"
          />
          <Area
            type="monotone"
            dataKey="rent"
            name="Rent"
            stroke={RENT_COLOUR}
            strokeWidth={2.5}
            fill="url(#rentGradient)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
