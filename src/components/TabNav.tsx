import { BarChart3, BookOpen, Calculator } from 'lucide-react'

export type TabId = 'calculator' | 'visualisations' | 'about'

const TABS: { id: TabId; label: string; icon: typeof Calculator }[] = [
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'visualisations', label: 'Visualisations', icon: BarChart3 },
  { id: 'about', label: 'About', icon: BookOpen },
]

type Props = {
  active: TabId
  onChange: (id: TabId) => void
}

export function TabNav({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Main"
      className="border-b border-amber-200 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-950 print:hidden"
    >
      <div className="mx-auto max-w-6xl px-6 flex gap-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'flex items-center gap-2 px-4 py-3 text-sm font-medium text-orange-700 dark:text-sky-400 border-b-2 border-orange-600 dark:border-sky-400 -mb-px'
                  : 'flex items-center gap-2 px-4 py-3 text-sm text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200 border-b-2 border-transparent -mb-px'
              }
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
