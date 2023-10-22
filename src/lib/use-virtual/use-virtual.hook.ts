import { isNumber }                     from '@grnx-utils/types'
import { Nullable }                     from '@grnx-utils/types'
/* Canary new react hook 👌 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { use }                          from 'react'
import { useCallback }                  from 'react'
import { useMemo }                      from 'react'

import { VirtualContextPayload }        from '@/context/virtual-context.interfaces'
import { VirtualContext }               from '@/context/virtual-context.provider'
import { getElementHeight }             from '@/lib/use-virtual/lib/get-element-height'
import { DEFAULT_OVERSCAN }             from '@/shared/consts'
import { DEFAULT_SCROLLING_DELAY }      from '@/shared/consts'
import { useLatest }                    from '@/shared/hooks'
import { withPropsValidator }           from '@/shared/lib'

import { getMeasurementCacheByElement } from './lib/get-measurement-cache-by-elem'
import { useInitializeScrollHandlers }  from './use-initialize-scroll.hook'
import { LatestInstance }               from './use-virtual.interfaces'
import { UseVirtualProps }              from './use-virtual.interfaces'
import { VirtualItem }                  from './use-virtual.interfaces'
import { validateProps as validate }    from './use-virtual.validate'

export const useVirtual = withPropsValidator(
  ({
    count: itemsCount,
    getScrollElement,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    itemHeight,
    overscan = DEFAULT_OVERSCAN,
    getEstimateHeight,
    getItemKey
  }: UseVirtualProps) => {
    const ctx: VirtualContextPayload = use(VirtualContext)

    const { measurementCache, scrollTop, isScrolling, listHeight } = ctx.state

    const latestInstance = useLatest({
      measurementCache,
      getItemKey
    } satisfies LatestInstance)

    useInitializeScrollHandlers({
      scrollingDelay,
      getScrollElement
    })

    const { virtualItems, totalHeight } = useMemo(() => {
      const getItemHeight = (idx: number) => {
        if (itemHeight) {
          return itemHeight(idx)
        }

        const itemKey = getItemKey(idx)

        if (isNumber(measurementCache[itemKey])) {
          return measurementCache[itemKey]!
        }

        return getEstimateHeight!(idx)
      }

      const rangeStart = scrollTop
      const rangeEnd = scrollTop + listHeight

      let startIdx = -1
      let endIdx = -1

      const allRows: VirtualItem[] = new Array(itemsCount).fill(null)
      let totalHeight = 0

      for (let idx = 0; idx < allRows.length; idx++) {
        const itemKey = getItemKey(idx)

        const row: VirtualItem = {
          key: itemKey,
          idx,
          virtualHeight: getItemHeight(idx),
          offsetTop: totalHeight
        }

        totalHeight += row.virtualHeight
        allRows[idx] = row

        if (row.offsetTop + row.virtualHeight > rangeStart && !~startIdx) {
          startIdx = Math.max(0, idx - overscan)
        }

        if (row.offsetTop + row.virtualHeight >= rangeEnd && !~endIdx) {
          endIdx = Math.min(itemsCount - 1, idx + overscan)
        }
      }

      endIdx = endIdx === -1 ? itemsCount - 1 : endIdx

      const virtualItems = allRows.slice(startIdx, endIdx + 1)

      return {
        virtualItems,
        totalHeight
      }
    }, [
      scrollTop,
      overscan,
      listHeight,
      itemHeight,
      itemsCount,
      getEstimateHeight,
      measurementCache
    ])

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

          ctx.addToCache({
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

        ctx.addToCache({
          key: cacheKey,
          height: getElementHeight({ element })
        })
      },
      [latestInstance, itemsResizeObserver]
    )

    return {
      totalListHeight: totalHeight,
      virtualItems,
      isScrolling,
      measureElement
    }
  },
  {
    validate
  }
)
