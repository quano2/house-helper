# House Helper — project context

UK buy-vs-rent calculator for Joe's personal decision (and publicly available for anyone who finds it useful). Live at **https://quano2.github.io/house-helper/**. Repo: `quano2/house-helper` (public).

This doc captures **what's been decided and why**, especially the "tried and removed" things — so we don't keep re-litigating choices that have already been made.

---

## What it is

A web calculator that compares buying vs renting over time using the proper **"invest the difference"** methodology (both paths start with same capital; whichever has lower monthly outflow invests the difference at the chosen return; compare net worth at horizon). Same methodology as the NYTimes calculator, but UK-specific (SDLT, no CGT on primary residence, ISA wrapper for investments).

**Scope**: UK only. England & NI for stamp duty (Scotland LBTT and Wales LTT differ — not modelled). Owner-occupier only.

**Built because** the gold-standard calculators are US-only; UK ones tend to be either simple monthly-cost comparisons or stamp-duty-only.

---

## Tech stack

- **React 19** + **Vite** + **TypeScript** + **Tailwind v4** + **Recharts**
- **Vitest** for the financial primitive tests (42 tests, all must pass for deploy)
- **GitHub Pages** for hosting, auto-deploys via Actions on push to main (`.github/workflows/deploy.yml`)
- No backend, no API calls. Everything client-side.

---

## File layout

```
src/
  finance/                Pure TypeScript math (no React)
    types.ts              Inputs, YearResult, SimulationResult types
    defaults.ts           Default input values (with calibration date in comment)
    sdlt.ts               UK stamp duty calculator (Apr 2025 rates)
    mortgage.ts           Monthly payment, amortisation schedule, closed-form balance
    investment.ts         FV of lump sum + monthly contributions
    simulate.ts           Month-by-month buy-vs-rent simulator (single rate paths
                          via simulate(); per-year arrays via simulateWithRates())
    monteCarlo.ts         Wraps simulateWithRates() with sampled rate paths
    random.ts             Box-Muller normal sampler
    *.test.ts             Unit tests for each module
  components/             UI components
    Field.tsx             Number input with £/% prefix, tabular-nums, comma formatting,
                          local-text editing state. Plus ToggleField, Section.
    InputForm.tsx         All inputs grouped into sections
    ResultsPanel.tsx      Verdict card + chart + monthly costs + upfront breakdown + stats
    BreakEvenChart.tsx    Net wealth over time (Recharts ComposedChart)
    MonteCarloPanel.tsx   500-sim fan chart + "buy wins in X%" headline
    DepositComparison.tsx Modal: 6-row table of deposits with LTV-adjusted rates
    AssumptionsModal.tsx  Modal: short list of load-bearing assumptions
    SavedScenarios.tsx    Local-storage scenario save/load chips
    HeaderActions.tsx     Share / Print / Dark-mode toggle
    TabNav.tsx            Calculator / Visualisations / About tab bar
    ProbabilityHeatmap.tsx 9 rates × 6 horizons verdict grid
    AmortisationViewer.tsx Slider + stacked bar of interest/principal per year
    SankeyDiagram.tsx     Recharts Sankey of where each pound goes on the buy path
  views/
    CalculatorView.tsx    Original calculator content (saved + form + results)
    VisualisationsView.tsx Three viz stacked
    AboutView.tsx         Three articles + disclaimer
  utils/
    format.ts             Intl-based £ / % / £ compact formatters
    storage.ts            localStorage for saved scenarios
    url.ts                Input ↔ URL search params sync
  App.tsx                 Shell: state, theme, tab routing
  index.css               Tailwind + @custom-variant dark + color-scheme on .dark
concept.md                Early planning notes (factors considered)
build-plan.md             Early Mac setup + stack + deploy plan
README.md                 Public-facing summary
.github/workflows/deploy.yml  Build + test + Pages deploy
.claude/launch.json       Dev-server config for the preview tool (unused in deployed flow)
```

---

## Key decisions and the reasoning behind them

### Methodology / model

- **Invest-the-difference is the only fair comparison.** Both paths start with same capital (deposit + stamp duty + legal + mortgage fee). The cheaper monthly path invests the difference at the investment return. The verdict assumes the renter actually does this every month — if they wouldn't, the rent path's real wealth is much lower.
- **Investment returns assumed tax-free** (ISA-sheltered, £20k/yr limit). Realistic for typical deposit amounts.
- **Mortgage rate held flat for the term.** Joe's explicit call: "you can't predict rates in 5 years anyway, modelling the reset is substituting one guess for another." **Don't reintroduce rate-reset modelling without asking.**
- **Selling cost applied at horizon** regardless of whether you'd actually sell. The verdict measures "potential wealth at horizon"; using the equity requires selling.
- **Maintenance smoothed** (not lumpy). 1%/yr default is the long-run average.
- **Council tax + utilities tracked** for monthly affordability display but **don't affect the verdict** (same both paths).

### Calibration dates (refresh periodically)

- **SDLT bands**: April 2025 (hardcoded in `src/finance/sdlt.ts`). Comment notes refresh source.
- **Default mortgage rate 4.8%**: calibrated against May 2026 broker quotes (4.70% at 25% deposit, ~4.80% at 15% deposit). Comment in `defaults.ts`.
- **LTV rate spreads** in deposit comparison (`DepositComparison.tsx`): calibrated against HomeOwners Alliance best-buy data May 2026. Spreads are roughly stable over time; absolute rates change daily.
- **Monte Carlo σ values** in `monteCarlo.ts`: house 7%, rent 2%, equity 16% — UK historical-ish, not time-sensitive.

### UI / UX

- **Single layout: side-by-side** form + results on desktop, stacked on mobile. (Tried stacked / verdict-first / centred — Joe picked this.)
- **Two themes: warm (light) and cool (dark).** Light = amber/orange/stone; dark = slate with sky accents. (Tried warm-dark, neutral-dark, cool-dark — Joe picked cool.) Dark follows OS preference by default; manual toggle persists in localStorage.
- **Three tabs**: Calculator (default) / Visualisations / About. Tab state is per-session; URL preserves form inputs only.
- **Modals for secondary content** (deposit comparison, assumptions). Native `<dialog>` element with `showModal()` — browser handles focus trap, escape, scroll lock.
- **All numeric inputs**: £/% prefix inside the input, tabular-nums for digit alignment, local-text editing state (lets you backspace freely without React snapping value back), comma thousand separators when not focused.
- **URL serialises only non-default values** for shareable scenarios.
- **localStorage** for saved scenarios + theme override.
- **Print view** hides interactive controls (`print:hidden`).

### Tried and removed (don't add back without explicit ask)

- **HRAD / additional-property surcharge toggle** — out of scope (owner-occupier only).
- **General inflation input** — only affected insurance/service-charge growth, third-order noise. Now held flat.
- **Re-mortgage fee fields** — modelling inconsistent (we don't model rate changes, so fee-without-rate-change was half a feature).
- **Historical backtesting (UK 1985–2023)** — UK history is one long housing bull market; any start year favoured buying because of the period, not the underlying choice. **Don't reintroduce without a balanced dataset.**
- **UK area picker (cities / postcode / map)** — city averages are too broad (Salford ≠ Didsbury) and presenting them precisely is misleadingly authoritative.
- **Bundled LTV rate hint on the mortgage rate field** — date-stamped rates go stale within months. (Calibrated spreads in the deposit-comparison modal are OK because they're relative to the user's input.)
- **Scenario chip presets** ("First-time buyer", "London market") — not pulling their weight.
- **LayoutPicker, ThemePicker, DarkVariantPicker** — temporary "try all" demos; chosen winner locked in, picker removed.
- **General rule that emerged**: don't bundle market-rate data (mortgage rates, house prices, rents, returns) as static values that look authoritative. Live data needs an API; static data ages badly and misleads.

---

## Joe's preferences (collaboration notes)

- **Be exhaustive in brainstorms.** Don't pre-curate or filter for "what matters" — include small/minor items too, Joe will prune. Pre-filtering robs him of the call.
- **Plain English over jargon.** HRAD → "Second home / buy-to-let". SDLT → "stamp duty". "Years to simulate" → "Time horizon" (renamed because the original didn't read as a real-world question).
- **Push back where useful**, with reasons. Joe asks "should we do X?" expecting honest analysis, not a yes-bot.
- **Honest about trade-offs** rather than overselling. He's specifically asked "are you happy with the math" and similar — wants known limitations called out.
- **Likes seeing options to choose between** — themes / layouts / dark variants / area pickers all built as 3-way selectors so he could pick. Same pattern works well for new design decisions.
- **Project is personal, not a portfolio piece.** Don't inflate scope for "looking impressive". Public deployment is "in case anyone finds it useful", not a product.
- **Joe is new to Mac dev.** Was set up at start of project (Homebrew, Node, gh CLI). All working now.

---

## Deployment

- Push to `main` → GitHub Action runs `npm ci && npm test && npm run build` → publishes `dist/` to Pages → live at https://quano2.github.io/house-helper/ in ~1–2 min.
- **Test failures block deploy** (intentional — broken math shouldn't reach the live site).
- Vite config has `base: './'` so build output works at any URL prefix (also lets you open `dist/index.html` directly from filesystem as a sanity check).

---

## Math validated against external sources

Primitives have been hand-cross-checked:

- **SDLT £350k non-FTB = £7,500** — matches MoneyHelper calculator
- **Monthly P&I £200k @ 5% / 25y = £1,169.18** — matches every external mortgage calculator
- **FTB on £350k saves £5,000** (£7.5k standard → £2.5k FTB) — verified
- Direction sensitivities all correct: higher rent → buy wins more; higher return → rent wins more; higher house growth → buy wins more; FTB cheaper upfront

The **integrated simulator** hasn't been cross-checked end-to-end against another full calculator (NYTimes/Zillow). Self-written tests validate direction but not absolute numbers vs a third-party tool. For personal-decision use this is fine — magnitudes ±10% is what matters, not the last £100.

---

## Open items / things we discussed but didn't build

These were considered and parked. Don't build without asking, but they're known candidates:

- **Sensitivity tornado chart** — show which inputs swing the verdict most. Cheap to build, surprisingly rare in calculators.
- **Real vs nominal toggle** — switch between today's pounds and future pounds.
- **Joint income mode** — two incomes, two LISAs, two ISA allowances.
- **Lifestyle benefits / intangibles** layer — Joe explicitly parked this as "nice-to-have, optional, off by default". Don't add unless he asks.
- **Furniture differential cost** — Joe explicitly said "don't add this, was a thought between us".
- **Save-for-deposit timeline** as a sibling tool — natural precursor question.
- **Mortgage overpayment toggle** — model already shows optimal strategy at default rates; only matters in edge cases (low investment return).

---

## Communication shortcuts

- "stamp duty" (user-facing) = SDLT (code)
- "second home / buy-to-let" (user-facing) = HRAD surcharge (code, internal capability of `sdlt.ts` but never exposed)
- "Time horizon" (user-facing) = `yearsToSimulate` (code)
- "invest the difference" = the model's load-bearing assumption — both paths invest spare cash at the chosen return

---

## When making changes

1. **Run `npm test`** — must pass; deploy is gated on this.
2. **Run `npm run build`** to verify TypeScript + Vite compile cleanly.
3. **Commit messages** use the established style (focused, explains the why), with `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer.
4. **Push to main** auto-deploys via GitHub Actions in ~2 min.
5. **Don't commit data files that go stale** — repeat learning, gets misleading fast.
