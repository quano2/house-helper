/**
 * Box-Muller transform for normally-distributed sampling.
 * Standard for Monte Carlo work where returns are modelled as normal.
 * (Real returns are roughly log-normal — normal is a fine approximation here.)
 */
export function sampleNormal(mean: number, stdDev: number): number {
  let u1 = Math.random()
  while (u1 === 0) u1 = Math.random() // avoid log(0)
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * stdDev
}
