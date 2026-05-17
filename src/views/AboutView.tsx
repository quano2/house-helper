export function AboutView() {
  return (
    <article className="max-w-3xl mx-auto space-y-12 text-stone-700 dark:text-slate-300 leading-relaxed">
      <Section title="The buy-vs-rent question, properly modelled">
        <p>
          Most online calculators answer a different question from the one you
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

      <Section title="Should you wait for rates to drop?">
        <p>
          Probably not the right question to ask in isolation.
        </p>
        <p>
          Rate cuts and house price rises tend to correlate — when borrowing
          gets cheaper, demand returns and prices follow. So "waiting for a
          lower rate" often comes paired with "paying more for the house plus
          the rent you sunk in the meantime". The interest you'd save on the
          mortgage is partially or fully eaten by the higher purchase price and
          the months of rent.
        </p>
        <p>
          The clear scenario where waiting wins is a <strong>recession-style
          combination</strong>: rates fall <em>and</em> prices fall. That's the
          2008-09 pattern. The typical post-hike normalisation — rates ease,
          prices flatten or recover — is much closer to a wash.
        </p>
        <p>
          A more useful framing: do you actually have a house you want to buy?
          If yes, and the model's verdict works on realistic assumptions,
          buying when you've found the right place tends to beat waiting for
          rate-timing perfection. If no, you're not really "waiting for rates"
          — you're waiting for a property, and the rate environment is
          secondary. The WaitAnalysis card on the calculator tab lets you
          test specific wait periods directly.
        </p>
      </Section>

      <Section title="Beware the indefinite-wait failure mode">
        <p>
          The most common mistake in this decision isn't picking the wrong
          time — it's <strong>indefinite deferral</strong>. People wait for
          rates to drop. Then they wait to see if rates will drop more. Then
          they wait to see if prices will react. Then they wait until they're
          surer of their job. Then their partner. Then their location. Five
          years pass; rent of £100k+ has been paid; no decision was made.
        </p>
        <p>
          If you're going to wait, set a concrete trigger — &ldquo;I'll buy when
          rates hit X%&rdquo;, &ldquo;when I've saved another £Y of
          deposit&rdquo;, &ldquo;when I've been in this job for Z months&rdquo;.
          Otherwise the wait becomes the decision by default.
        </p>
      </Section>

      <Section title="What this model can't tell you">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Whether you'll actually invest the difference.</strong> The
            verdict assumes you put every monthly saving into investments. If
            you'd spend it instead, the rent path's real wealth is much lower
            than the model shows. The mortgage is a forced-savings vehicle for
            many people — that's a real-world advantage not captured in pure
            £-comparison.
          </li>
          <li>
            <strong>Future rate or price moves.</strong> The model holds the
            mortgage rate flat for the term and uses your single house-growth
            assumption. Real rates change on remortgage; real prices follow
            cycles. The Monte Carlo card shows how brittle the verdict is to
            rate variance.
          </li>
          <li>
            <strong>Your monthly savings beyond housing.</strong> The model
            tracks your starting capital and the monthly difference between
            buying and renting, but it has no concept of your salary or
            additional savings rate. Absolute net-worth figures are
            systematically lower than reality for that reason — but the Buy − Rent
            comparison is unaffected (those savings apply equally to both
            paths).
          </li>
          <li>
            <strong>Risk tolerance.</strong> The verdict is pure expected
            value. It doesn't weigh the certainty of paying down a mortgage
            against the volatility of investment returns. Some people would
            rather have a paid-off house and lower expected wealth than a
            bigger portfolio and a landlord.
          </li>
          <li>
            <strong>Whether you want this specific house.</strong> A model
            saying "buying wins by £80k" doesn't mean the house you've found
            is the right one. Lifestyle fit, location, schools, commute,
            future flexibility — all real factors with no field in any
            calculator.
          </li>
        </ul>
      </Section>

      <Section title="Sense-checks before committing">
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>What's the price-to-rent ratio?</strong> Take the purchase
            price and divide by the annual rent of an equivalent property. If
            it's below ~18, buying tends to win comfortably. 18–25 is the grey
            zone where assumptions matter. Above 25, renting tends to win
            even with favourable rates.
          </li>
          <li>
            <strong>Run multiple horizons.</strong> Try 5, 10, 15, 25 years. If
            buying only wins at the longest horizon, you're committing to that
            length. If it wins from year 5 onwards, you have flexibility.
          </li>
          <li>
            <strong>Stress-test the assumptions.</strong> Set house growth to
            0%, set investment return to your real expectation (not the
            optimistic default), set rent inflation a bit higher. If buying
            still wins, the verdict is robust. If it only wins with rosy
            inputs, treat the answer as fragile.
          </li>
          <li>
            <strong>Read the Monte Carlo percentage, not the deterministic
            verdict.</strong> "Buy wins in 60% of futures" is a meaningfully
            different statement from "buying wins by £80k". The percentage
            tells you how robust the verdict is to plausible variance.
          </li>
        </ul>
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
