import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

export function BreakEvenChart({ years, breakEvenYear }: Props) {
  const data = years.map((y) => ({
    year: y.year,
    buy: Math.round(y.buyNetWorth),
    rent: Math.round(y.rentNetWorth),
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 16, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            label={{ value: 'Year', position: 'insideBottom', offset: -10, fill: '#64748b' }}
          />
          <YAxis
            stroke="#64748b"
            tickFormatter={(v: number) => formatGBPCompact(v)}
            width={80}
          />
          <Tooltip
            formatter={(v) => (typeof v === 'number' ? formatGBP(v) : String(v ?? ''))}
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 12 }} />
          {breakEvenYear !== null && (
            <ReferenceLine
              x={breakEvenYear}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: `Break-even (year ${breakEvenYear})`,
                position: 'insideTop',
                fill: '#475569',
                fontSize: 12,
                offset: 8,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="buy"
            name="Buy"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="rent"
            name="Rent"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
