import { isNumber }            from '@grnx-utils/types'
import { Nullable }            from '@grnx-utils/types'
import { MutableRefObject }    from 'react'
import { useCallback }         from 'react'

import { CachePayload }        from '@/context/virtual-context.interfaces'
import { getCacheKey }         from '@/core/lib'
import { getElementHeight }    from '@/core/lib'
import { fixScrollCorrection } from '@/core/lib/scroll-correction'
import { LatestInstance }      from '@/core/use-virtual.interfaces'
import { useResizeObserver }   from '@/shared/hooks'

export interface UseMeasureElementProps {
  addToCache: (payload: CachePayload) => void
  latestInstance: MutableRefObject<LatestInstance>
}

/**
 * Returns a callbackRef that dynamically measures the length of the
 * element and writes it to the cache (for optimization)
 * @reference https://elfi-y.medium.com/react-callback-refs-a-4bd2da317269
 * @param addToCache - method from the VirtualContext
 * @param latestInstance - instance of useLatest hooke
 * @returns (element: Nullable<Element>) => void - callbackRef
 */
export const useMeasureElement = ({
  addToCache,
  latestInstance
}: UseMeasureElementProps) => {
  const observeElementHeight = useCallback((
    element: Nullable<Element>,
    resizeObserver: ResizeObserver,
    entry?: ResizeObserverEntry
  ) => {
    if (!element) return

    if (!element.isConnected) {
      return resizeObserver.unobserve(element)
    }

    const { cacheKey, elementIdx } = getCacheKey({
      element,
      latestInstance
    })

    const { measurementCache } = latestInstance.current
    const isResize = Boolean(entry)

    resizeObserver.observe(element)

    if (isResize && isNumber(measurementCache[cacheKey])) return

    const height = getElementHeight({
      element,
      entry
    })

    if (measurementCache[cacheKey] === height) return

    fixScrollCorrection({
      height,
      elementIdx,
      latestInstance
    })

    addToCache({
      key: cacheKey,
      height
    })
  }, [])

  const itemsResizeObserver = useResizeObserver((entry, resizeObserver) => {
    observeElementHeight(entry.target, resizeObserver, entry)
  })

  return useCallback(
    (element: Nullable<Element>) => {
      observeElementHeight(element, itemsResizeObserver)
    },
    [latestInstance, itemsResizeObserver]
  )
}
