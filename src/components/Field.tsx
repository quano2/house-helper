import { useEffect, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  hint?: ReactNode
  unit?: ReactNode
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  /**
   * If true, the visible value is value*100 (e.g. 4.5 for 0.045) and onChange
   * receives the divided value. Use for fractional rates / percentages.
   */
  asPercent?: boolean
  /**
   * If true, display the value with thousands separators when not focused
   * (e.g. "350,000"). Becomes raw digits while focused for easy editing.
   * Only meaningful for whole-number money fields.
   */
  thousands?: boolean
  children?: ReactNode
}

const thousandsFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 0,
})

function formatForDisplay(value: number, focused: boolean, thousands?: boolean): string {
  if (!Number.isFinite(value)) return ''
  if (focused) return String(value)
  if (thousands) return thousandsFormatter.format(value)
  return String(value)
}

export function Field({
  label,
  hint,
  unit,
  value,
  onChange,
  min,
  max,
  step,
  asPercent,
  thousands,
}: Props) {
  const displayValue = asPercent ? Number((value * 100).toFixed(4)) : value
  const displayStep = step ?? (asPercent ? 0.1 : 1)

  const [text, setText] = useState(() => formatForDisplay(displayValue, false, thousands))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setText(formatForDisplay(displayValue, false, thousands))
  }, [displayValue, focused, thousands])

  const inputType = thousands ? 'text' : 'number'

  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-stone-700 dark:text-slate-300">{label}</span>
        {unit &&
          (typeof unit === 'string' ? (
            <span className="text-xs text-stone-500 dark:text-slate-500">{unit}</span>
          ) : (
            unit
          ))}
      </div>
      <input
        type={inputType}
        inputMode={thousands ? 'decimal' : undefined}
        className="mt-1 w-full rounded-md border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-stone-900 dark:text-slate-100 px-3 py-2 text-sm tabular-nums focus:border-orange-500 dark:focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:focus:ring-sky-400"
        value={text}
        min={!thousands ? min : undefined}
        max={!thousands ? max : undefined}
        step={!thousands ? displayStep : undefined}
        onFocus={() => {
          setFocused(true)
          setText(formatForDisplay(displayValue, true, thousands))
        }}
        onBlur={() => {
          setFocused(false)
          const cleaned = text.replace(/,/g, '')
          if (cleaned === '' || !Number.isFinite(Number(cleaned))) {
            setText(formatForDisplay(displayValue, false, thousands))
          }
        }}
        onChange={(e) => {
          const next = e.target.value
          setText(next)
          const cleaned = next.replace(/,/g, '')
          if (cleaned === '') return
          const v = Number(cleaned)
          if (Number.isFinite(v)) {
            onChange(asPercent ? v / 100 : v)
          }
        }}
      />
      {hint && <p className="mt-1 text-xs text-stone-500 dark:text-slate-400">{hint}</p>}
    </label>
  )
}

export function ToggleField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-stone-300 dark:border-slate-600 accent-orange-600 dark:accent-sky-500 focus:ring-orange-500 dark:focus:ring-sky-400"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-stone-700 dark:text-slate-300">{label}</span>
        {hint && <span className="block text-xs text-stone-500 dark:text-slate-400">{hint}</span>}
      </span>
    </label>
  )
}

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: LucideIcon
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900 dark:text-slate-100 border-b border-stone-200 dark:border-slate-700 pb-1">
        {Icon && <Icon className="h-4 w-4 text-orange-600 dark:text-sky-400" aria-hidden="true" />}
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  )
}
