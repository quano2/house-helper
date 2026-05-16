export type LayoutId = 'side-by-side' | 'stacked' | 'verdict-first' | 'centered'

export const layoutList: { id: LayoutId; label: string }[] = [
  { id: 'side-by-side', label: 'Side-by-side' },
  { id: 'stacked', label: 'Stacked (form on top)' },
  { id: 'verdict-first', label: 'Verdict first' },
  { id: 'centered', label: 'Centered column' },
]
