const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

const gbpCompact = new Intl.NumberFormat('en-GB', {
  notation: 'compact',
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 1,
})

const pct = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  maximumFractionDigits: 2,
})

export const formatGBP = (n: number) => gbp.format(n)
export const formatGBPCompact = (n: number) => gbpCompact.format(n)
export const formatPercent = (n: number) => pct.format(n)
