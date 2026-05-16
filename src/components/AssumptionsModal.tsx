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
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 p-0 rounded-xl max-w-2xl w-[calc(100vw-2rem)] bg-transparent backdrop:bg-black/50 dark:backdrop:bg-black/70"
    >
      <div className="bg-white dark:bg-slate-900 text-stone-900 dark:text-slate-100 rounded-xl border border-stone-200 dark:border-slate-700 shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-orange-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3
              id="assumptions-title"
              className="text-base font-semibold text-stone-900 dark:text-slate-100"
            >
              How the verdict is calculated
            </h3>
            <p className="text-sm text-stone-600 dark:text-slate-400 mt-1">
              The load-bearing assumptions behind the numbers above.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-stone-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm text-stone-700 dark:text-slate-300 leading-relaxed">
          <Section title="The big one — invest the difference">
            <p>
              Both paths start with the same capital (deposit + stamp duty + legal +
              mortgage fee). The buy path spends it on the house; the rent path keeps
              it invested. Each month, whichever path has the lower out-of-pocket
              cost invests the saving at your chosen return.
            </p>
            <p className="mt-2">
              <strong className="text-stone-900 dark:text-slate-100">This is the load-bearing assumption.</strong> The verdict only
              matches reality if you actually put the saving into investments every
              month. If you'd spend it instead, the rent path's wealth in reality is
              much lower than the model shows.
            </p>
          </Section>

          <Section title="What “net worth at year N” means">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-stone-900 dark:text-slate-100">Buy:</strong>{' '}
                house value × (1 − selling cost) − remaining mortgage + any cash
                invested. Assumes you sell to realise the equity; if you'd keep
                living there the equity is on paper only.
              </li>
              <li>
                <strong className="text-stone-900 dark:text-slate-100">Rent:</strong>{' '}
                starting capital + all monthly savings, compounded at the investment
                return.
              </li>
            </ul>
          </Section>

          <Section title="Investment returns">
            <p>
              Treated as tax-free — i.e. held inside an ISA (£20k/year contribution
              limit). Realistic for typical deposit amounts. If your savings would
              exceed the annual ISA cap, some money sits in a general account and
              pays CGT / dividend tax, reducing the effective return.
            </p>
          </Section>

          <Section title="Mortgage rate">
            <p>
              Held flat for the full term. In reality UK fixes are typically 2–5
              years; when you remortgage the new rate may be different. The model
              doesn't predict rate changes. The deposit/rate comparison popup is the
              place to play with different rate scenarios.
            </p>
          </Section>

          <Section title="What isn't modelled">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Lumpy one-off repairs (boiler, roof, windows) — averaged into the
                annual maintenance %.
              </li>
              <li>
                Mortgage product fees on remortgage every few years.
              </li>
              <li>
                Income, taxes other than CGT/SDLT, life events, dependents.
              </li>
              <li>
                The psychological "forced savings" effect of a mortgage payment —
                people often save more reliably when it's a non-skippable bill.
              </li>
              <li>
                Risk preference. The verdict is pure expected value; it doesn't
                weight the certainty of paying down a mortgage vs the volatility of
                investment returns. (The Monte Carlo card gives a sense of the
                variance.)
              </li>
            </ul>
          </Section>

          <Section title="Data and sources">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-stone-900 dark:text-slate-100">Stamp duty bands:</strong>{' '}
                England &amp; Northern Ireland rates as of April 2025 (Scotland LBTT and
                Wales LTT differ — not modelled).
              </li>
              <li>
                <strong className="text-stone-900 dark:text-slate-100">LTV rate spreads</strong>{' '}
                (in the deposit comparison): calibrated against UK best-buy data,
                May 2026.
              </li>
              <li>
                <strong className="text-stone-900 dark:text-slate-100">Selling cost</strong>{' '}
                default 2%: typical estate agent + solicitor estimate.
              </li>
              <li>
                Other defaults (rents, growth rates, maintenance) are reasonable
                starting points — edit to match your situation.
              </li>
            </ul>
          </Section>

          <p className="text-xs text-stone-500 dark:text-slate-400 italic pt-2 border-t border-stone-200 dark:border-slate-700">
            This is a model, not financial advice. The output should be treated as
            directional — use it to think through trade-offs, not as a precise
            prediction of your future net worth.
          </p>
        </div>
      </div>
    </dialog>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1">
        {title}
      </h4>
      <div>{children}</div>
    </section>
  )
}
