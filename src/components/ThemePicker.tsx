import { themeList, type ThemeId } from '../themes'

type Props = {
  theme: ThemeId
  onChange: (t: ThemeId) => void
}

export function ThemePicker({ theme, onChange }: Props) {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="mx-auto max-w-6xl px-6 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-yellow-900 mr-2">
          Theme preview:
        </span>
        {themeList.map((t) => {
          const active = t.id === theme
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={
                active
                  ? 'bg-yellow-900 text-white px-3 py-1 rounded-full font-medium'
                  : 'text-yellow-900 hover:bg-yellow-100 px-3 py-1 rounded-full'
              }
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
