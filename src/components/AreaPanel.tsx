import { useMemo, useState } from 'react'
import { Building2, Map as MapIcon, MapPin, Search } from 'lucide-react'
import { lookupAreaByPostcode, ukAreas, type UkArea } from '../area/data'
import { formatGBP } from '../utils/format'

type Props = {
  onApply: (housePrice: number, monthlyRent: number) => void
  /** Active area id (last applied) for visual feedback on chips/pins */
  activeAreaId?: string | null
}

type TabId = 'cities' | 'postcode' | 'map'

const TABS: { id: TabId; label: string; icon: typeof Building2 }[] = [
  { id: 'cities', label: 'Cities', icon: Building2 },
  { id: 'postcode', label: 'Postcode', icon: Search },
  { id: 'map', label: 'Map', icon: MapIcon },
]

export function AreaPanel({ onApply, activeAreaId }: Props) {
  const [tab, setTab] = useState<TabId>('cities')

  return (
    <div className="rounded-lg border border-amber-200 bg-white p-4 mb-8 print:hidden">
      <div className="flex items-start gap-3 mb-4">
        <MapPin className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900">
            Quick-fill from a UK area
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Set house price and rent to the average for a city. Numbers are approximate (late 2024) — adjust to match your specific area.
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-stone-200">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                active
                  ? 'border-b-2 border-orange-600 text-orange-700 px-3 py-2 text-sm font-medium flex items-center gap-1.5 -mb-px'
                  : 'border-b-2 border-transparent text-stone-600 hover:text-stone-900 px-3 py-2 text-sm flex items-center gap-1.5 -mb-px'
              }
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'cities' && <CitiesTab onApply={onApply} activeAreaId={activeAreaId} />}
      {tab === 'postcode' && <PostcodeTab onApply={onApply} />}
      {tab === 'map' && <MapTab onApply={onApply} activeAreaId={activeAreaId} />}
    </div>
  )
}

// ─── Cities tab ──────────────────────────────────────────────────────────────

function CitiesTab({
  onApply,
  activeAreaId,
}: {
  onApply: (price: number, rent: number) => void
  activeAreaId?: string | null
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ukAreas.map((c) => {
        const active = c.id === activeAreaId
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onApply(c.averageHousePrice, c.averageMonthlyRent)}
            title={`${c.name}: ${formatGBP(c.averageHousePrice)} avg house, ${formatGBP(c.averageMonthlyRent)}/mo rent`}
            className={
              active
                ? 'bg-orange-600 text-white text-sm rounded-full px-3 py-1.5 font-medium shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 border border-amber-200 text-stone-800 text-sm rounded-full px-3 py-1.5'
            }
          >
            <span className="font-medium">{c.name}</span>
            <span className={active ? 'text-orange-100 ml-2 text-xs tabular-nums' : 'text-stone-500 ml-2 text-xs tabular-nums'}>
              £{Math.round(c.averageHousePrice / 1000)}k · £{c.averageMonthlyRent}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Postcode tab ────────────────────────────────────────────────────────────

function PostcodeTab({ onApply }: { onApply: (price: number, rent: number) => void }) {
  const [postcode, setPostcode] = useState('')
  const matched = useMemo(() => lookupAreaByPostcode(postcode), [postcode])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="e.g. M1 2AB, EH1 1YZ, SW1A 2AA"
          className="flex-1 text-sm rounded-md border border-stone-300 px-3 py-2 bg-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {postcode.trim().length > 0 && (
        matched ? (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-stone-800">
                Closest match: <span className="font-semibold">{matched.name}</span>
                <span className="text-stone-500 text-xs ml-2">({matched.region})</span>
              </p>
              <p className="text-xs text-stone-600 mt-1 tabular-nums">
                Average house: {formatGBP(matched.averageHousePrice)} · Average rent: {formatGBP(matched.averageMonthlyRent)}/mo
              </p>
            </div>
            <button
              type="button"
              onClick={() => onApply(matched.averageHousePrice, matched.averageMonthlyRent)}
              className="text-sm bg-orange-600 text-white px-3 py-1.5 rounded-md hover:bg-orange-700 shrink-0"
            >
              Use these
            </button>
          </div>
        ) : (
          <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            No data bundled for that postcode area. Try a major city postcode (M1, EH1, BS1, etc.) or pick one from the Cities tab.
          </p>
        )
      )}

      <p className="text-xs text-stone-500">
        Lookup uses the postcode area (the leading letters). Data covers ~18 major UK cities.
      </p>
    </div>
  )
}

// ─── Map tab ─────────────────────────────────────────────────────────────────

// Stylised British Isles outline — not cartographically accurate, just enough
// to be recognisable. Two paths: Great Britain and Ireland.
const GB_PATH =
  'M 28,128 L 35,130 L 50,131 L 65,130 L 75,127 L 85,118 L 92,108 L 95,98 L 92,88 L 88,80 L 85,68 L 80,58 L 75,52 L 72,46 L 75,38 L 78,28 L 75,18 L 70,10 L 62,8 L 55,14 L 52,24 L 50,34 L 48,42 L 45,48 L 50,54 L 55,58 L 50,62 L 42,66 L 38,72 L 35,80 L 33,90 L 30,98 L 28,108 L 26,118 Z'
const IE_PATH =
  'M 12,82 L 20,78 L 25,84 L 26,94 L 23,106 L 16,112 L 8,108 L 5,98 L 6,88 Z'

function MapTab({
  onApply,
  activeAreaId,
}: {
  onApply: (price: number, rent: number) => void
  activeAreaId?: string | null
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const focusId = hoveredId ?? activeAreaId ?? null
  const focused: UkArea | null = focusId
    ? ukAreas.find((c) => c.id === focusId) ?? null
    : null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start">
      <div className="mx-auto sm:mx-0">
        <svg viewBox="0 0 100 140" className="w-56 h-auto" role="img" aria-label="UK map with city pins">
          {/* Sea background */}
          <rect width="100" height="140" fill="#fef3c7" rx="6" />
          {/* Land */}
          <path d={GB_PATH} fill="#fde68a" stroke="#d97706" strokeWidth="0.6" strokeLinejoin="round" />
          <path d={IE_PATH} fill="#fde68a" stroke="#d97706" strokeWidth="0.6" strokeLinejoin="round" />

          {/* City pins */}
          {ukAreas.map((c) => {
            const active = c.id === activeAreaId
            const hovered = c.id === hoveredId
            const r = active || hovered ? 2.4 : 1.8
            const fill = active ? '#c2410c' : hovered ? '#ea580c' : '#f97316'
            return (
              <g key={c.id}>
                <circle
                  cx={c.mapX}
                  cy={c.mapY}
                  r={r}
                  fill={fill}
                  stroke="#fff"
                  strokeWidth="0.5"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onApply(c.averageHousePrice, c.averageMonthlyRent)}
                />
                {/* Bigger invisible hit target for mobile */}
                <circle
                  cx={c.mapX}
                  cy={c.mapY}
                  r={5}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onApply(c.averageHousePrice, c.averageMonthlyRent)}
                />
              </g>
            )
          })}
        </svg>
      </div>

      <div className="min-h-[120px]">
        {focused ? (
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-stone-600">
              {focused.region}
            </p>
            <p className="text-xl font-semibold text-stone-900">{focused.name}</p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-stone-500 uppercase tracking-wide">Avg house</dt>
                <dd className="font-semibold tabular-nums text-stone-900">
                  {formatGBP(focused.averageHousePrice)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500 uppercase tracking-wide">Avg rent / mo</dt>
                <dd className="font-semibold tabular-nums text-stone-900">
                  {formatGBP(focused.averageMonthlyRent)}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => onApply(focused.averageHousePrice, focused.averageMonthlyRent)}
              className="mt-4 text-sm bg-orange-600 text-white px-3 py-1.5 rounded-md hover:bg-orange-700"
            >
              Use these numbers
            </button>
          </div>
        ) : (
          <p className="text-sm text-stone-500 italic">
            Hover or tap a pin to see its averages.
          </p>
        )}
      </div>
    </div>
  )
}
