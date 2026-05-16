import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LineChart as LineIcon } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { amortisationSchedule, monthlyMortgagePayment } from '../finance/mortgage'
import { formatGBP, formatGBPCompact } from '../utils/format'

type Props = {
  inputs: Inputs
  isDark?: boolean
}

const BUY_LIGHT = '#15803d'
const BUY_DARK = '#34d399'
const SUNK_LIGHT = '#b45309'
const SUNK_DARK = '#fbbf24'

export function AmortisationViewer({ inputs, isDark = false }: Props) {
  const principal = Math.max(0, inputs.housePrice - Math.min(inputs.depositAmount, inputs.housePrice))
  const schedule = useMemo(
    () => amortisationSchedule(principal, inputs.mortgageRate, inputs.mortgageTermYears),
    [principal, inputs.mortgageRate, inputs.mortgageTermYears],
  )

  const monthly = monthlyMortgagePayment(
    principal,
    inputs.mortgageRate,
    inputs.mortgageTermYears,
  )

  // Aggregate per year for the chart
  const yearly = useMemo(() => {
    const out: { year: number; interest: number; principal: number; balance: number }[] = []
    for (let y = 1; y <= inputs.mortgageTermYears; y++) {
      const slice = schedule.slice((y - 1) * 12, y * 12)
      const interest = slice.reduce((s, m) => s + m.interest, 0)
      const principalPaid = slice.reduce((s, m) => s + m.principal, 0)
      const balance = slice[slice.length - 1]?.balance ?? 0
      out.push({ year: y, interest, principal: principalPaid, balance })
    }
    return out
  }, [schedule, inputs.mortgageTermYears])

  const [selectedYear, setSelectedYear] = useState(1)
  const selected = yearly[Math.min(selectedYear, yearly.length) - 1]
  const totalInterest = yearly.reduce((s, y) => s + y.interest, 0)
  const percentPaid = selected
    ? ((principal - selected.balance) / Math.max(1, principal)) * 100
    : 0

  const principalColour = isDark ? BUY_DARK : BUY_LIGHT
  const interestColour = isDark ? SUNK_DARK : SUNK_LIGHT
  const gridStroke = isDark ? '#334155' : '#e7e5e4'
  const axisStroke = isDark ? '#94a3b8' : '#78716c'
  const tooltipBg = isDark ? '#0f172a' : '#ffffff'
  const tooltipBorder = isDark ? '#334155' : '#e7e5e4'
  const tooltipText = isDark ? '#f1f5f9' : '#1c1917'

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <LineIcon className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
            Amortisation — where each year's payment goes
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
            Early years: most of your payment is interest. Later years: most is
            principal (building equity). Drag the slider to inspect a specific year.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 items-center mb-4">
        <div>
          <label className="block">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-sm font-medium text-stone-700 dark:text-slate-300">
                Year {selectedYear} of {inputs.mortgageTermYears}
              </span>
              <span className="text-xs text-stone-500 dark:text-slate-400 tabular-nums">
                {percentPaid.toFixed(1)}% paid off
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={inputs.mortgageTermYears}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full accent-orange-600 dark:accent-sky-500"
            />
          </label>
        </div>
        <div className="rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-wide font-semibold text-stone-600 dark:text-slate-400">
            Monthly P&amp;I
          </p>
          <p className="text-xl font-bold tabular-nums text-stone-900 dark:text-slate-100">
            {formatGBP(monthly)}
          </p>
        </div>
      </div>

      {selected && (
        <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
          <SplitStat
            label="Interest this year"
            value={formatGBP(selected.interest)}
            tone="amber"
          />
          <SplitStat
            label="Principal this year"
            value={formatGBP(selected.principal)}
            tone="emerald"
          />
          <SplitStat
            label="Balance remaining"
            value={formatGBP(selected.balance)}
            tone="neutral"
          />
        </div>
      )}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yearly} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
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
                fontSize: 12,
              }}
              labelStyle={{ color: tooltipText }}
              itemStyle={{ color: tooltipText }}
            />
            <Legend wrapperStyle={{ paddingTop: 12, color: axisStroke }} />
            <Bar dataKey="principal" stackId="a" name="Principal" fill={principalColour} />
            <Bar dataKey="interest" stackId="a" name="Interest" fill={interestColour} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-stone-500 dark:text-slate-400">
        Total interest over {inputs.mortgageTermYears}y:{' '}
        <span className="font-semibold tabular-nums text-stone-700 dark:text-slate-300">
          {formatGBP(totalInterest)}
        </span>{' '}
        (on a {formatGBP(principal)} loan at {(inputs.mortgageRate * 100).toFixed(2)}%).
      </p>
    </div>
  )
}

function SplitStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'amber' | 'emerald' | 'neutral'
}) {
  const valueClass =
    tone === 'amber'
      ? 'text-amber-800 dark:text-amber-500'
      : tone === 'emerald'
        ? 'text-emerald-700 dark:text-emerald-500'
        : 'text-stone-900 dark:text-slate-100'
  return (
    <div className="rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-3 py-3">
      <p className="text-[10px] uppercase tracking-wide font-semibold text-stone-600 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold tabular-nums ${valueClass}`}>{value}</p>
    </div>
  )
}
