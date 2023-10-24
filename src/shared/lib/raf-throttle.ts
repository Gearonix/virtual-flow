import { AnyFunction } from '@grnx-utils/types'
import { Nullable }    from '@grnx-utils/types'

/**
 * throttling, but with requestAnimationFrame
 * to reduce amount of function calls
 * @param cb {Fn extends (...args: any[]) => unknown}
 */
export const rafThrottle = <Fn extends AnyFunction<unknown>>(cb: Fn) => {
  let isThrottled = false
  let latestArgs: Nullable<Parameters<Fn>> = null

  return (...args: Parameters<Fn>) => {
    latestArgs = args

    if (isThrottled) return

    isThrottled = true

    requestAnimationFrame(() => {
      cb(...latestArgs!)
      isThrottled = false
    })
  }
}
