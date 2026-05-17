import type { Inputs } from '../finance/types'
import type { DisplayMode } from '../utils/inflation'
import { AmortisationViewer } from '../components/AmortisationViewer'
import { ProbabilityHeatmap } from '../components/ProbabilityHeatmap'
import { SankeyDiagram } from '../components/SankeyDiagram'

type Props = {
  inputs: Inputs
  isDark: boolean
  displayMode: DisplayMode
}

export function VisualisationsView({ inputs, isDark, displayMode }: Props) {
  const isReal = displayMode === 'real'
  return (
    <div className="space-y-6">
      <p className="text-sm text-stone-600 dark:text-slate-400 max-w-2xl">
        Three different ways to look at the numbers behind your current scenario.
        Change inputs on the Calculator tab and these update accordingly.
        {isReal && (
          <span className="block mt-2 text-stone-500 dark:text-slate-500 italic">
            Note: this tab shows nominal £ regardless of the header toggle —
            heatmap percentages are mode-independent, and the amortisation / sankey
            views are about pound flows where nominal is the natural frame.
          </span>
        )}
      </p>
      <ProbabilityHeatmap inputs={inputs} />
      <AmortisationViewer inputs={inputs} isDark={isDark} />
      <SankeyDiagram inputs={inputs} isDark={isDark} />
    </div>
  )
}
