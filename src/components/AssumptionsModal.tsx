import { useEffect, useRef } from 'react'
import { Info, X } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
}

export function AssumptionsModal({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-labelledby="assumptions-title"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0 rounded-xl max-w-xl w-[calc(100vw-2rem)] bg-transparent backdrop:bg-black/50 dark:backdrop:bg-black/70"
    >
      <div className="bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 rounded-xl border border-stone-200 dark:border-slate-700 shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <h3
            id="assumptions-title"
            className="flex-1 text-base font-semibold text-stone-900 dark:text-slate-100"
          >
            How the verdict is calculated
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-stone-900 dark:text-slate-100">Invest the difference.</strong>{' '}
            Both paths start with the same capital — either the upfront buy cost
            (deposit + stamp duty + legal + mortgage fee) or your "Available cash"
            input, whichever is higher. The buy path spends the upfront cost; the
            rent path keeps everything invested. Each month, the cheaper path
            invests the saving. The verdict only matches reality if you actually
            do this every month.
          </p>

          <p>
            <strong className="text-stone-900 dark:text-slate-100">Net worth at year N.</strong>{' '}
            For buy: house value × (1 − selling cost) − any remaining mortgage +
            cash invested. Assumes you'd sell to realise equity. For rent:
            starting capital + monthly savings, all compounded.
          </p>

          <p>
            <strong className="text-stone-900 dark:text-slate-100">Investment returns</strong>{' '}
            treated as tax-free — i.e. ISA-sheltered (£20k/year limit).
          </p>

          <p>
            <strong className="text-stone-900 dark:text-slate-100">Mortgage rate</strong>{' '}
            held flat for the full term. Use the deposit/rate comparison to
            explore scenarios where it shifts.
          </p>

          <p>
            <strong className="text-stone-900 dark:text-slate-100">Not modelled:</strong>{' '}
            lumpy one-off repairs (bundled into maintenance %), remortgage product
            fees, income/non-housing tax, risk preference, the "forced savings"
            psychology of a mortgage.
          </p>

          <p className="text-xs text-stone-500 dark:text-slate-400">
            Stamp duty: England &amp; NI rates as of April 2025. LTV spreads in the
            deposit comparison: UK best-buy data, May 2026.
          </p>

          <p className="text-xs text-stone-500 dark:text-slate-400 italic pt-3 border-t border-stone-200 dark:border-slate-700">
            A model, not financial advice. Output is directional — use it to think
            through trade-offs.
          </p>
        </div>
      </div>
    </dialog>
  )
}
