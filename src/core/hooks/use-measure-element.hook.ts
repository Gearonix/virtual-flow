import { isNumber }                     from '@grnx-utils/types'
import { Nullable }                     from '@grnx-utils/types'
import { MutableRefObject }             from 'react'
import { useCallback }                  from 'react'
import { useMemo }                      from 'react'

import { CachePayload }                 from '@/context/virtual-context.interfaces'
import { getElementHeight }             from '@/core/lib'
import { getMeasurementCacheByElement } from '@/core/lib'
import { LatestInstance }               from '@/core/use-virtual.interfaces'

export interface UseMeasureElementProps {
  addToCache: (payload: CachePayload) => void
  latestInstance: MutableRefObject<LatestInstance>
}

/**
 * Returns a callbackRef that dynamically measures the length of the
 * element and writes it to the cache (for optimization)
 * @reference https://elfi-y.medium.com/react-callback-refs-a-4bd2da317269
 * @param addToCache - method from the VirtualContext
 * @param latestInstance - instance of useLatest hook
 * @returns (element: Nullable<Element>) => void - callbackRef
 */
export const useMeasureElement = ({
  addToCache,
  latestInstance
}: UseMeasureElementProps) => {
  const itemsResizeObserver = useMemo(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target

        if (!element.isConnected) {
          return void resizeObserver.unobserve(element)
        }

        const { cacheKey, measurementCache } = getMeasurementCacheByElement({
          element,
          latestInstance
        })

        const elementHeight = getElementHeight({
          element,
          entry
        })

        if (measurementCache[cacheKey] === elementHeight) return

        addToCache({
          key: cacheKey,
          height: elementHeight
        })
      })
    })

    return resizeObserver
  }, [])

  const measureElement = useCallback(
    (element: Nullable<Element>) => {
      if (!element) return

      const { cacheKey, measurementCache } = getMeasurementCacheByElement({
        element,
        latestInstance
      })
      itemsResizeObserver.observe(element)

      if (isNumber(measurementCache[cacheKey])) return

      addToCache({
        key: cacheKey,
        height: getElementHeight({ element })
      })
    },
    [latestInstance, itemsResizeObserver]
  )

  return measureElement
}
