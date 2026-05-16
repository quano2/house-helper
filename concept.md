# Buy vs Rent Calculator — Concept Notes

A living document. Tick things off, scratch things out, add new ones as the build evolves.

---

## Decisions (2026-05-14)
- **Market:** UK only. Encode SDLT bands, no CGT on primary residence, no mortgage interest relief, ISA wrapper for the invest-the-difference path.
- **Scope:** Full break-even + scenarios — year-by-year net-wealth curves, break-even chart, scenario toggles (rate resets, flat prices, low equity returns).
- **Audience:** Public-ready from day one — mobile-friendly, no jargon, shareable URLs from the first deploy.
- **Lifestyle / intangibles:** Optional layer, off by default, opt-in toggle. Purpose is to **challenge** the financial verdict (show points from *both* sides) rather than weight a decision. Not a core feature — financial math is the product.
- **Rental deposit treatment:** Acknowledged but not modelled — the realistic loss (foregone interest on ~1–2 months rent + occasional unfair landlord deductions) is in the low-hundreds-of-pounds range. Noise vs the big levers (SDLT, agent fees, rate resets).

---

## 1. What already exists

A buy-vs-rent calculator is a well-trodden genre. Before building, worth being honest that most people are served fine by existing tools — so the bar for "is this worth building?" is: *do I want a tool that's tuned to **my** assumptions and **UK** rules, that's transparent about its math, that I can change?* If yes, build. If not, just use the NYTimes one and move on.

### The gold standard
- **NYT Rent vs Buy** — interactive, very comprehensive, has the famous decision-band chart. US-centric (property tax, mortgage interest deduction, US closing costs). Closed-source. ([nytimes.com/interactive/2014/upshot/buy-rent-calculator.html](https://www.nytimes.com/interactive/2014/upshot/buy-rent-calculator.html))

### Big US ones (mostly oriented to lead-gen for mortgages)
- [Zillow](https://www.zillow.com/rent-vs-buy-calculator) — shows break-even horizon
- [NerdWallet](https://www.nerdwallet.com/mortgages/calculators/rent-vs-buy-calculator)
- [Redfin](https://www.redfin.com/rent-vs-buy-calculator)
- [Bankrate](https://www.bankrate.com/real-estate/rent-vs-buy-calculator/), [AmeriSave](https://www.amerisave.com/learn/rent-vs-buy-a-house-calculator), [Homebuyer.com](https://homebuyer.com/tools/rent-vs-buy-calculator), [CNN](https://www.cnn.com/business/calculators/rent-vs-buy-calculator), [AARP](https://www.aarp.org/money/personal-finance/rent-buy-home-calculator/), [Better.com](https://better.com/rent-vs-buy-calculator)

### UK-specific
- [calculatemystampduty.co.uk — Rent vs Buy with Stamp Duty Factor](https://calculatemystampduty.co.uk/tools/rent-vs-buy-stamp-duty-factor) — closest analogue in UK; 1–30y horizon, break-even year, year-by-year
- [MoneyHelper Stamp Duty calc](https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator), [Rightmove](https://www.rightmove.co.uk/stamp-duty-calculator), [Savills](https://www.savills.co.uk/resources-and-tools/residential-stamp-duty-calculator.aspx) — stamp duty only, not rent vs buy
- Money Saving Expert has rent vs buy guides but no first-class calculator
- **Gap:** no widely-known UK calculator that is *both* comprehensive (deposit opportunity cost vs ISA returns, all transaction costs, leasehold service charges) *and* transparent about its formulas

### Honest verdict
For pure number-crunching, NYTimes still wins. The case for building one yourself:
1. You want to encode **UK-specific** rules (SDLT bands, no CGT on primary residence, no mortgage interest relief, ISA shelter for the alternative-investment side)
2. You want to **see the math** — not trust a closed black box
3. You want **scenario comparison** — what if rates renew at 6% vs 4%? what if house prices flatline for 5 years?
4. The "intangibles" list — encoding your own qualitative weights, not just £s

If those four reasons resonate, building is justified. If you'd be happy plugging your numbers into NYTimes once and being done, don't build.

---

## 2. Factors to model

Marking what you originally listed vs additions.

### Listed already
- House price
- Interest rate (mortgage)
- Market returns (for the rent-and-invest-difference alternative)
- Maintenance
- Moving costs

### You mentioned forgetting
- Renting deposit — important nuance: in the UK it's held in a DPS scheme and **returned**. So it's not "lost" — it's an *opportunity cost* on whatever the deposit could have earned while held (typically 1–2 months rent over the tenancy length). Worth modelling but smaller effect than people think.

### Upfront — buying (mostly sunk costs)
- **Stamp Duty Land Tax (SDLT)** — biggest sunk cost; depends on price, FTB status, second-home status. UK thresholds change — don't hardcode, make editable.
- Solicitor / conveyancing fees (~£1,000–£2,500)
- Survey (Level 2/3) — £400–£1,500
- Mortgage arrangement / product fee — often £999–£1,999, sometimes added to loan
- Mortgage broker fee (if used)
- Land Registry fee + local authority searches
- Removal costs (also applies to renting move-in)

### Upfront — renting
- Holding deposit (typically 1 week's rent, refunded into first month)
- Tenancy deposit (5 weeks' rent under Tenant Fees Act cap)
- First month rent in advance
- Removals

### Ongoing — buying
- Mortgage **interest** (this is a real cost) vs **principal** (this is forced savings into equity, *not* a cost — important model distinction)
- Council tax (same for renter & owner — usually nets out, but worth including for completeness)
- **Buildings insurance** (owner only, ~£200–£400/yr)
- Contents insurance (both, slightly higher for owners)
- **Maintenance** — rule of thumb 1%/year of property value; realistic range 0.5–2%. Joe should sanity-check this against the house type (new-build vs Victorian terrace = very different).
- Major repair contingencies — boiler (~£3k every 12–15y), roof, windows. The 1% maintenance figure is supposed to cover this on average; modelling specific lumpy items is more honest.
- **Service charge & ground rent** (leasehold flats only — can be £1k–£5k/yr+, sometimes catastrophic with cladding remediation)
- Possibly: lease extension cost if lease drops below 80 years

### Ongoing — renting
- Rent (with annual increase — often pegged to CPI/RPI or market; model 3–5%/yr)
- Contents insurance
- Council tax (same as owner)
- Utilities (same as owner)

### Exit — buying
- **Estate agent fee** on sale — 1–1.8% + VAT (high-street), or fixed-fee online
- Solicitor fees on sale (~£1,000–£1,500)
- EPC (~£60–£120)
- Early Repayment Charge if you exit a fixed-rate deal early (often 1–5% of balance)

### Exit — renting
- Mostly just removals + any deposit deductions

### Macro / market
- **House price appreciation** — UK long-run real return ≈ 1–2% above inflation, but huge regional variance and decade-long flat periods possible. Model as a tweakable assumption, not a fact.
- **Rent inflation** — usually tracks CPI ± local market
- **General inflation (CPI)** — affects real vs nominal returns
- **Expected stock market return** — typical assumption ~7% nominal / ~5% real for a global equity portfolio
- **Tax on the alternative investment** — if held inside an ISA, gains are tax-free (£20k/yr allowance — relevant if your deposit is bigger). Outside an ISA, dividend tax + CGT apply.
- **Volatility / sequence-of-returns risk** — neither house prices nor stocks return their average smoothly. Worth a "what if returns are bad for the first 5 years" scenario.

### UK tax specifics (don't get this wrong — it's a structural advantage to buying)
- **No CGT on primary residence** (Principal Private Residence relief) — owner-occupier gets full appreciation tax-free
- **No mortgage interest tax relief** for primary residence (different from US, and different from UK buy-to-let)
- **ISA wrapper** can make the rent-and-invest alternative tax-free up to £20k/yr — model this as an option, not a default

### Mortgage realism (UK-specific gotcha)
- UK mortgages are typically **fixed for 2–5 years**, then revert to SVR or you remortgage at the prevailing rate. So the "interest rate" input shouldn't be a single number for 25 years — at minimum, let the user say "fixed at X% for Y years, then assume Z%". This is a major source of risk most calculators ignore.

### Opportunity cost — the heart of the model
The *real* comparison isn't rent vs mortgage. It's:
- **Buy path:** capital tied up in deposit + transaction costs + monthly mortgage + maintenance, ending with house equity (after sale costs)
- **Rent path:** same starting capital invested (deposit + would-be transaction costs), monthly rent paid, *any* monthly cost difference also invested, ending with portfolio value

Whichever path leaves you with more net wealth at horizon T wins. The break-even chart should show this as a curve over T.

### Intangibles (optional layer — you mentioned wanting this)
Not £, but worth letting the user weight them:
- **Flexibility** (renter wins) — how easy to move for a job, relationship
- **Security of tenure** (owner wins; UK rental is precarious with Section 21, though renters' rights reform is in flight — verify current state when you build)
- **Customisation / renovation** (owner wins)
- **Responsibility for repairs** (renter wins — landlord problem, not yours)
- **Pets, decoration freedom** (owner wins)
- **Forced savings** (owner wins psychologically — mortgage principal is harder to skip than an investment contribution)
- **Liquidity** (renter wins — house is not easily turned back into cash)
- **Landlord risk** (rent rises, no-fault eviction, neglectful landlord)

---

## 3. Scenarios worth supporting (not just point estimates)
- "What if I have to move in 3 years vs 10 years vs 25 years?" — sensitivity to horizon is the single biggest finding most people get wrong
- "What if mortgage rates jump to X% at my first remortgage?"
- "What if house prices are flat (0% real) for the first 5 years?"
- "What if stock returns are 3% instead of 7%?"
- "What if rent grows at 5% rather than 3%?"

A break-even chart (years on X, net wealth difference on Y) communicates this far better than a single number.

---

## 4. Things I'd challenge in your framing
- **"Renting deposit is lost money"** — it isn't, in the UK. It's returned (minus damages). The cost is the foregone return on that money while it's held, which is small over a 1–2 year tenancy. Stamp duty, by contrast, *is* lost money — much bigger lever.
- **"Calculate whether it's better to buy or rent"** — there is no single answer; it's a function of time horizon, your specific numbers, and your risk tolerance. Frame the tool's output as a *break-even horizon and sensitivity*, not a verdict.
- **"Random benefits"** — useful to include, but don't let them sway a financial decision worth tens of thousands. Keep the £ analysis and the lifestyle analysis visibly separate.

---

## 5. Open questions for Joe
All initial scope questions answered (see Decisions at top). Next batch of questions will appear here as we hit modelling choices — e.g. what default values to seed the form with, how to surface scenario comparisons in the UI, where to draw the line between "input field" and "advanced setting".
