export function AboutView() {
  return (
    <article className="max-w-3xl mx-auto space-y-12 text-stone-700 dark:text-slate-300 leading-relaxed">
      <Section title="The buy-vs-rent question, properly modelled">
        <p>
          Most online calculators answer a different question than the one you
          actually want answered. They tell you the monthly cost of a mortgage and
          the monthly cost of renting, then declare a winner based on which is
          cheaper. That's wrong, because it ignores what happens to the money you
          don't spend on housing.
        </p>
        <p>
          The honest comparison is between two paths that both start with the same
          capital (your deposit + transaction fees). The buy path spends it on a
          house and pays a mortgage. The rent path keeps it invested in the market
          and pays rent. Each month, whichever path has the lower outflow invests
          the difference. At a horizon T, compare net worth: house equity + any
          cash invested for the buyer, total portfolio for the renter.
        </p>
        <p>
          This calculator implements that methodology end-to-end. The key
          assumption you have to take seriously: it only matches reality if you'd
          actually invest the difference. If you'd spend the saving on holidays,
          the rent path's wealth in reality is much lower than the model shows.
          For many people that's the real argument for buying — the mortgage is a
          forced savings vehicle.
        </p>
        <p>
          The verdict is also highly sensitive to four assumptions: time horizon,
          investment return, house appreciation, and mortgage rate. Try the
          Monte Carlo card and the Verdict heatmap (on the Visualisations tab) to
          see how brittle or robust your answer is.
        </p>
      </Section>

      <Section title="How UK stamp duty actually works">
        <p>
          Stamp Duty Land Tax (SDLT) is a tax on residential property purchases in
          England and Northern Ireland. (Scotland uses LBTT and Wales uses LTT,
          which look similar but have different bands.) It's progressive — you pay
          different rates on different slices of the price, not one flat rate on
          the whole thing.
        </p>
        <p>
          As of April 2025, the bands for a standard purchase are:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>0% on the first £125,000</li>
          <li>2% on the next £125,000 (£125k – £250k)</li>
          <li>5% on the next £675,000 (£250k – £925k)</li>
          <li>10% on the next £575,000 (£925k – £1.5m)</li>
          <li>12% on anything above £1.5m</li>
        </ul>
        <p>
          So a £350,000 house: nothing on the first £125k + 2% × £125k (£2,500) +
          5% × £100k (£5,000) = <strong>£7,500</strong>. Not 2% of £350k, not 5%
          of £350k — a slice at each band.
        </p>
        <p>
          <strong>First-time buyer relief:</strong> if you're buying your first
          home and it costs £500,000 or less, you pay 0% on the first £300,000
          and 5% on anything from £300k to £500k. So a £400k FTB purchase = 5% ×
          £100k = £5,000 (vs £10,000 standard). If the property is over £500k, FTB
          relief doesn't apply — you use the standard bands.
        </p>
        <p>
          <strong>Second homes / buy-to-let</strong> add a flat 5% surcharge on
          top of every band, applied to the full purchase price. This calculator
          doesn't model this — it's owner-occupier only.
        </p>
        <p>
          Stamp duty is a real, large, sunk cost. Unlike the deposit (which becomes
          house equity), every pound of stamp duty is permanently gone the moment
          you complete. That's why the upfront cost breakdown shows it separately
          — it's the most punishing single line item on the transaction.
        </p>
      </Section>

      <Section title="Why your bank's affordability check ≠ what you can actually afford">
        <p>
          UK banks check mortgage affordability with a simple income multiple
          (typically 4–4.5× your gross annual income) and a stress test that
          checks you could still pay if rates rose ~3% above the headline rate.
          These rules are designed to protect the bank's loan book, not to figure
          out whether you'll be comfortable.
        </p>
        <p>
          What banks don't see:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your other commitments (childcare, car payments, season ticket loans)</li>
          <li>Lifestyle costs you actually have</li>
          <li>Whether you save anything</li>
          <li>Maintenance, insurance, service charges that follow ownership</li>
          <li>Council tax, utilities, contents insurance</li>
        </ul>
        <p>
          A common pattern: the bank says "you can borrow £400k", you buy a £450k
          house, and discover that after mortgage + maintenance + insurance +
          service charge + council tax + utilities, you have less disposable income
          than when you were renting at half the cost. The mortgage was
          affordable; the lifestyle wasn't.
        </p>
        <p>
          A more honest rule of thumb: total housing costs (mortgage + everything
          else above) shouldn't exceed roughly 30% of your net (take-home) income,
          and you should still be able to save 10–15% of take-home on top of that
          comfortably. If the calculator's "Year 1 monthly costs" plus shared
          living costs is above that line for your income, the bank's affordability
          number is lying to you.
        </p>
      </Section>

      <Section title="What this site is not">
        <ul className="list-disc pl-6 space-y-1">
          <li>Financial advice. It's a model.</li>
          <li>
            A live rate source. Mortgage rates change daily — see the links in the
            deposit comparison popup for current best buys.
          </li>
          <li>
            A complete picture. There's no field for "would you rather be free to
            move at short notice", "do you want a garden", or "do you want to paint
            the walls without asking". Those are real values the model can't price.
          </li>
        </ul>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 dark:text-slate-100 mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
