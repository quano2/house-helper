import { layoutList, type LayoutId } from '../layouts'

type Props = {
  layout: LayoutId
  onChange: (l: LayoutId) => void
}

export function LayoutPicker({ layout, onChange }: Props) {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="mx-auto max-w-6xl px-6 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-yellow-900 mr-2">Layout preview:</span>
        {layoutList.map((l) => {
          const active = l.id === layout
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onChange(l.id)}
              className={
                active
                  ? 'bg-yellow-900 text-white px-3 py-1 rounded-full font-medium'
                  : 'text-yellow-900 hover:bg-yellow-100 px-3 py-1 rounded-full'
              }
            >
              {l.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
