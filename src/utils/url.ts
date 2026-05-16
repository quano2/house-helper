import type { Inputs } from '../finance/types'
import { defaultInputs } from '../finance/defaults'

/**
 * Encode inputs as URL search params. Only includes fields that differ from
 * the default — keeps the URL short and means a bare URL means "defaults".
 */
export function inputsToParams(inputs: Inputs): URLSearchParams {
  const params = new URLSearchParams()
  for (const key of Object.keys(inputs) as (keyof Inputs)[]) {
    const value = inputs[key]
    const defaultVal = defaultInputs[key]
    if (typeof value === 'boolean') {
      if (value !== defaultVal) params.set(key, value ? '1' : '0')
    } else if (typeof value === 'number') {
      if (value !== defaultVal) params.set(key, String(value))
    }
  }
  return params
}

/**
 * Decode URL search params into inputs. Unknown keys are ignored.
 * Missing keys fall back to defaults — so a fresh URL gives default inputs.
 */
export function paramsToInputs(params: URLSearchParams): Inputs {
  const result: Inputs = { ...defaultInputs }
  for (const [key, value] of params.entries()) {
    if (!(key in defaultInputs)) continue
    const k = key as keyof Inputs
    const defaultVal = defaultInputs[k]
    if (typeof defaultVal === 'boolean') {
      ;(result[k] as boolean) = value === '1'
    } else if (typeof defaultVal === 'number') {
      const num = Number(value)
      if (Number.isFinite(num)) {
        ;(result[k] as number) = num
      }
    }
  }
  return result
}

export function readInputsFromUrl(): Inputs {
  if (typeof window === 'undefined') return defaultInputs
  return paramsToInputs(new URLSearchParams(window.location.search))
}

export function writeInputsToUrl(inputs: Inputs): void {
  if (typeof window === 'undefined') return
  const params = inputsToParams(inputs)
  const search = params.toString()
  const url = search ? `?${search}` : window.location.pathname
  window.history.replaceState(null, '', url)
}
