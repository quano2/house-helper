import { useMemo } from 'react'
import { Layer, Rectangle, Sankey, Tooltip } from 'recharts'
import { GitFork } from 'lucide-react'
import type { Inputs } from '../finance/types'
import { amortisationSchedule, monthlyMortgagePayment } from '../finance/mortgage'
import { calculateSdlt } from '../finance/sdlt'
import { formatGBP, formatGBPCompact } from '../utils/format'

type Props = {
  inputs: Inputs
  isDark?: boolean
}

export function SankeyDiagram({ inputs, isDark = false }: Props) {
  const data = useMemo(() => {
    const principal = Math.max(
      0,
      inputs.housePrice - Math.min(inputs.depositAmount, inputs.housePrice),
    )
    const sdlt = calculateSdlt(inputs.housePrice, { firstTimeBuyer: inputs.firstTimeBuyer })
    const horizonMonths = inputs.yearsToSimulate * 12
    const termMonths = inputs.mortgageTermYears * 12
    const monthsActive = Math.min(horizonMonths, termMonths)

    const schedule = amortisationSchedule(principal, inputs.mortgageRate, inputs.mortgageTermYears)
    const slice = schedule.slice(0, monthsActive)
    const totalInterest = slice.reduce((s, m) => s + m.interest, 0)
    const totalPrincipalPaid = slice.reduce((s, m) => s + m.principal, 0)
    const balanceRemaining =
      slice[slice.length - 1]?.balance ?? principal

    const deposit = Math.min(Math.max(0, inputs.depositAmount), inputs.housePrice)
    const equityBuilt = deposit + totalPrincipalPaid // = housePrice - balanceRemaining
    const monthly = monthlyMortgagePayment(principal, inputs.mortgageRate, inputs.mortgageTermYears)
    const totalMortgageOutflow = monthly * monthsActive
    void totalMortgageOutflow

    // Sunk monthly costs over the horizon
    const maintenanceTotal = inputs.housePrice * inputs.maintenancePercent * inputs.yearsToSimulate
    const insuranceTotal = inputs.buildingsInsuranceAnnual * inputs.yearsToSimulate
    const serviceTotal = inputs.serviceChargeAnnual * inputs.yearsToSimulate
    const fees = inputs.legalAndSurveyFees + inputs.mortgageArrangementFee
    const sunkCostsTotal =
      sdlt + fees + totalInterest + maintenanceTotal + insuranceTotal + serviceTotal

    const totalCashOut = deposit + totalInterest + totalPrincipalPaid + maintenanceTotal +
      insuranceTotal + serviceTotal + sdlt + fees

    const nodes = [
      { name: `Cash spent · ${formatGBPCompact(totalCashOut)}` }, // 0
      { name: `Equity built · ${formatGBPCompact(equityBuilt)}` }, // 1
      { name: `Interest to bank · ${formatGBPCompact(totalInterest)}` }, // 2
      { name: `Stamp duty + fees · ${formatGBPCompact(sdlt + fees)}` }, // 3
      { name: `Maintenance · ${formatGBPCompact(maintenanceTotal)}` }, // 4
      ...(insuranceTotal > 0
        ? [{ name: `Insurance · ${formatGBPCompact(insuranceTotal)}` }]
        : []),
      ...(serviceTotal > 0
        ? [{ name: `Service charge · ${formatGBPCompact(serviceTotal)}` }]
        : []),
    ]

    const links = [
      { source: 0, target: 1, value: Math.max(1, Math.round(equityBuilt)) },
      { source: 0, target: 2, value: Math.max(1, Math.round(totalInterest)) },
      { source: 0, target: 3, value: Math.max(1, Math.round(sdlt + fees)) },
      { source: 0, target: 4, value: Math.max(1, Math.round(maintenanceTotal)) },
    ]
    let nextIdx = 5
    if (insuranceTotal > 0) {
      links.push({ source: 0, target: nextIdx, value: Math.max(1, Math.round(insuranceTotal)) })
      nextIdx++
    }
    if (serviceTotal > 0) {
      links.push({ source: 0, target: nextIdx, value: Math.max(1, Math.round(serviceTotal)) })
    }

    return {
      nodes,
      links,
      summary: {
        totalCashOut,
        equityBuilt,
        sunkCostsTotal,
        balanceRemaining,
      },
    }
  }, [inputs])

  const nodeColour = isDark ? '#0ea5e9' : '#ea580c'
  const textColour = isDark ? '#e2e8f0' : '#292524'

  return (
    <div className="rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <GitFork className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-slate-100">
            Where every pound goes (buy path, {inputs.yearsToSimulate}y)
          </h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
            Sankey of your buy-path money flow over the horizon. The "equity built"
            branch is the only one you get back when you sell — everything else is
            sunk into ownership.
          </p>
        </div>
      </div>

      <div className="w-full h-[360px]">
        <Sankey
          width={600}
          height={360}
          data={data}
          nodePadding={20}
          nodeWidth={12}
          linkCurvature={0.5}
          iterations={32}
          node={<SankeyNode fill={nodeColour} text={textColour} />}
          link={{ stroke: nodeColour, strokeOpacity: 0.15 }}
        >
          <Tooltip content={<SankeyTooltip isDark={isDark} />} />
        </Sankey>
      </div>

      <p className="mt-4 text-xs text-stone-500 dark:text-slate-400 leading-relaxed">
        Over {inputs.yearsToSimulate} years you spend{' '}
        <span className="font-semibold tabular-nums text-stone-700 dark:text-slate-300">
          {formatGBP(data.summary.totalCashOut)}
        </span>{' '}
        on ownership. Of that,{' '}
        <span className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-500">
          {formatGBP(data.summary.equityBuilt)}
        </span>{' '}
        becomes equity you can sell, and{' '}
        <span className="font-semibold tabular-nums text-amber-800 dark:text-amber-500">
          {formatGBP(data.summary.sunkCostsTotal)}
        </span>{' '}
        is sunk into the cost of owning.
      </p>
    </div>
  )
}

// Strip the appended amount from a node name ("Equity built · £420K" → "Equity built")
function stripAmount(name: string): string {
  const i = name.indexOf(' · ')
  return i >= 0 ? name.slice(0, i) : name
}

// Custom Sankey tooltip — clean source → target with the value once
type RechartsTooltipPayload = {
  payload?: {
    source?: number | { name?: string }
    target?: number | { name?: string }
    sourceNodes?: { name?: string }[]
    targetNodes?: { name?: string }[]
    value?: number
    name?: string
  }
}

function SankeyTooltip({
  active,
  payload,
  isDark,
}: {
  active?: boolean
  payload?: RechartsTooltipPayload[]
  isDark?: boolean
}) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null

  const bg = isDark ? '#0f172a' : '#ffffff'
  const border = isDark ? '#334155' : '#e7e5e4'
  const text = isDark ? '#f1f5f9' : '#1c1917'
  const muted = isDark ? '#94a3b8' : '#78716c'

  // Node hover (single name, no source/target)
  if (data.name && data.source === undefined) {
    return (
      <div
        style={{ background: bg, border: `1px solid ${border}`, color: text }}
        className="rounded-md px-3 py-2 text-xs shadow-md"
      >
        <span className="font-semibold tabular-nums">{stripAmount(data.name)}</span>
      </div>
    )
  }

  // Link hover — pull source/target names from the structure recharts provides
  const sourceName =
    typeof data.source === 'object' && data.source?.name
      ? data.source.name
      : data.sourceNodes?.[0]?.name
  const targetName =
    typeof data.target === 'object' && data.target?.name
      ? data.target.name
      : data.targetNodes?.[0]?.name

  return (
    <div
      style={{ background: bg, border: `1px solid ${border}`, color: text }}
      className="rounded-md px-3 py-2 text-xs shadow-md"
    >
      {sourceName && targetName && (
        <div style={{ color: muted }} className="mb-1">
          {stripAmount(sourceName)} → {stripAmount(targetName)}
        </div>
      )}
      <div className="font-semibold tabular-nums">
        {typeof data.value === 'number' ? formatGBP(data.value) : ''}
      </div>
    </div>
  )
}

// Custom node renderer so labels are readable on both themes
function SankeyNode({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  fill,
  text,
}: {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  payload?: { name: string }
  containerWidth?: number
  fill: string
  text: string
}) {
  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined ||
    !payload
  ) {
    return null
  }
  const isOnLeft = (containerWidth ?? 600) / 2 > x
  const textX = isOnLeft ? x + width + 8 : x - 8
  const textAnchor = isOnLeft ? 'start' : 'end'
  return (
    <Layer key={`node-${index}`}>
      <Rectangle x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.9} />
      <text
        x={textX}
        y={y + height / 2}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        fontSize={11}
        fill={text}
      >
        {payload.name}
      </text>
    </Layer>
  )
}
