import { useEffect } from 'react'
import { useMemo }   from 'react'

import { useLatest } from '@/shared/hooks/use-latest.hook'

type ObserverCallback = (entry: ResizeObserverEntry, ro: ResizeObserver) => void

export const useResizeObserver = (cb: ObserverCallback) => {
  const latestCb = useLatest(cb)

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver((entries, observer) => {
        entries.forEach((entry) => latestCb.current(entry, observer))
      }),
    []
  )

  useEffect(() => {
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return resizeObserver
}
