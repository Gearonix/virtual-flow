import { AnyFunction } from '@grnx-utils/types'

export const createDOMScheduler = <T>() => {
  const tasksToRun: AnyFunction<T>[] = []
  let isScheduled = false

  return (cb: AnyFunction<T>) => {
    tasksToRun.push(cb)

    if (isScheduled) return

    isScheduled = true

    requestAnimationFrame(() => {
      tasksToRun.slice().forEach((task) => task())

      tasksToRun.length = 0
      isScheduled = false
    })
  }
}
