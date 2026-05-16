import { useEffect, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  label: string
  hint?: string
  unit?: string
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
  children?: ReactNode
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
}: Props) {
  // Round display value to avoid float artefacts (e.g. 0.07 * 100 → 7.0000000001)
  const displayValue = asPercent ? Number((value * 100).toFixed(4)) : value
  const displayStep = step ?? (asPercent ? 0.1 : 1)

  // Hold the visible text locally so the user can freely clear, partially edit,
  // or type things like "5." without React snapping the field back. Commit a
  // number to parent state only when the text parses cleanly; on blur, fall
  // back to the last committed value if the text was left empty/invalid.
  const [text, setText] = useState(String(displayValue))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setText(String(displayValue))
  }, [displayValue, focused])

  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      <input
        type="number"
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        value={text}
        min={min}
        max={max}
        step={displayStep}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          if (text === '' || !Number.isFinite(Number(text))) {
            setText(String(displayValue))
          }
        }}
        onChange={(e) => {
          const next = e.target.value
          setText(next)
          if (next === '') return
          const v = Number(next)
          if (Number.isFinite(v)) {
            onChange(asPercent ? v / 100 : v)
          }
        }}
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
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
        className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  )
}

export function Section({
  title,
  icon: Icon,
  children,
  columnsClass = 'grid-cols-1 sm:grid-cols-2',
}: {
  title: string
  icon?: LucideIcon
  children: ReactNode
  columnsClass?: string
}) {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 border-b border-slate-200 pb-1">
        {Icon && <Icon className="h-4 w-4 text-orange-600" aria-hidden="true" />}
        {title}
      </h3>
      <div className={`grid gap-4 ${columnsClass}`}>{children}</div>
    </section>
  )
}
