# House Helper

A UK-focused buy-vs-rent calculator for owner-occupiers. Compares net wealth at horizon for buying vs renting and investing the difference — including stamp duty, transaction costs, maintenance, moving costs, and the opportunity cost of the deposit.

Built because the gold-standard calculators (NYTimes) are US-only, and UK options are either simple monthly-cost comparisons or stamp-duty-only.

## Features
- Live break-even chart (net wealth over time, buy vs rent)
- Year-1 monthly cost breakdown so you can sanity-check affordability separately from the long-term wealth question
- Monte Carlo simulation (500 runs) showing the probability of buying winning across realistic distributions of rates, prices, and returns
- Save scenarios to local storage, share via URL, print
- Light + dark mode

## Out of scope (deliberate)
- Mortgage rate resets (UK fixes are 2–5y then remortgage — we hold rates flat for the simulation)
- Second-home / buy-to-let stamp duty surcharge — owner-occupier only
- Bundled market data (mortgage rates, area averages) — date-stamped data goes stale fast and would mislead

## Stack
React 19 + Vite + TypeScript + Tailwind v4 + Recharts. Vitest for the financial formulas.

## Run locally
```sh
npm install
npm run dev      # dev server at http://localhost:5173
npm test         # run unit tests
npm run build    # production build into ./dist
```

## See also
- [`concept.md`](./concept.md) — model, assumptions, factors considered
- [`build-plan.md`](./build-plan.md) — stack and deployment plan

## License
TBD.
