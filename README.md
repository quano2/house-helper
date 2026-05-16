# House Helper

A UK-focused buy-vs-rent calculator. Compares the true cost of buying vs renting over time — including stamp duty, transaction costs, mortgage rate resets, maintenance, and the opportunity cost of investing the deposit instead.

Built because the gold-standard calculators (NYT) are US-only, and UK options are either simple monthly-cost comparisons or stamp-duty-only.

## Status
Scaffold up. Financial model and inputs next.

See [`concept.md`](./concept.md) for the model and assumptions, [`build-plan.md`](./build-plan.md) for the stack and roadmap.

## Stack
React + Vite + TypeScript + Tailwind v4 + Recharts. Vitest for the financial formulas.

## Run locally
```sh
npm install
npm run dev      # dev server at http://localhost:5173
npm test         # run unit tests
npm run build    # production build into ./dist
```

## License
TBD.
