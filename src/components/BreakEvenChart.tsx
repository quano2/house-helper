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
  isDark?: boolean
}

const BUY_LIGHT = '#15803d'
const BUY_DARK = '#34d399'
const RENT_LIGHT = '#b45309'
const RENT_DARK = '#fbbf24'

export function BreakEvenChart({ years, breakEvenYear, isDark = false }: Props) {
  const data = years.map((y) => ({
    year: y.year,
    buy: Math.round(y.buyNetWorth),
    rent: Math.round(y.rentNetWorth),
  }))

  const buyColour = isDark ? BUY_DARK : BUY_LIGHT
  const rentColour = isDark ? RENT_DARK : RENT_LIGHT
  const gridStroke = isDark ? '#334155' : '#e7e5e4'
  const axisStroke = isDark ? '#94a3b8' : '#78716c'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'
  const tooltipBorder = isDark ? '#334155' : '#e7e5e4'
  const tooltipText = isDark ? '#f1f5f9' : '#1c1917'

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 24 }}>
          <defs>
            <linearGradient id="buyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={buyColour} stopOpacity={0.35} />
              <stop offset="100%" stopColor={buyColour} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rentColour} stopOpacity={0.25} />
              <stop offset="100%" stopColor={rentColour} stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(v) => (typeof v === 'number' ? formatGBP(v) : String(v ?? ''))}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${tooltipBorder}`,
              background: tooltipBg,
              color: tooltipText,
              fontSize: 13,
            }}
            labelStyle={{ color: tooltipText }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend wrapperStyle={{ paddingTop: 12, color: axisStroke }} />
          {breakEvenYear !== null && (
            <ReferenceLine
              x={breakEvenYear}
              stroke={axisStroke}
              strokeDasharray="4 4"
              label={{
                value: `Break-even (year ${breakEvenYear})`,
                position: 'insideTop',
                fill: axisStroke,
                fontSize: 12,
                offset: 8,
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="buy"
            name="Buy"
            stroke={buyColour}
            strokeWidth={2.5}
            fill="url(#buyGradient)"
          />
          <Area
            type="monotone"
            dataKey="rent"
            name="Rent"
            stroke={rentColour}
            strokeWidth={2.5}
            fill="url(#rentGradient)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
