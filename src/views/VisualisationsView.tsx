import type { Inputs } from '../finance/types'
import { AmortisationViewer } from '../components/AmortisationViewer'
import { ProbabilityHeatmap } from '../components/ProbabilityHeatmap'
import { SankeyDiagram } from '../components/SankeyDiagram'

type Props = {
  inputs: Inputs
  isDark: boolean
}

export function VisualisationsView({ inputs, isDark }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-stone-600 dark:text-slate-400 max-w-2xl">
        Three different ways to look at the numbers behind your current scenario.
        Change inputs on the Calculator tab and these update accordingly.
      </p>
      <ProbabilityHeatmap inputs={inputs} />
      <AmortisationViewer inputs={inputs} isDark={isDark} />
      <SankeyDiagram inputs={inputs} isDark={isDark} />
    </div>
  )
}
