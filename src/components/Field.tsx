import type { ReactNode } from 'react'

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

  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      <input
        type="number"
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        value={Number.isFinite(displayValue) ? displayValue : ''}
        min={min}
        max={max}
        step={displayStep}
        onChange={(e) => {
          const v = e.target.valueAsNumber
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
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-1">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </section>
  )
}
