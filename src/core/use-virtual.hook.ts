import { isNumber }                    from '@grnx-utils/types'
/* Canary new react hook 👌 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { use }                         from 'react'
import { useMemo }                     from 'react'

import { VirtualContextPayload }       from '@/context/virtual-context.interfaces'
import { VirtualContext }              from '@/context/virtual-context.provider'
import { useMeasureElement }           from '@/core/hooks'
import { DEFAULT_OVERSCAN }            from '@/shared/consts'
import { DEFAULT_SCROLLING_DELAY }     from '@/shared/consts'
import { useLatest }                   from '@/shared/hooks'
import { withPropsValidator }          from '@/shared/lib'

import { useInitializeScrollElements } from './hooks'
import { calculateVirtualItems }       from './lib'
import { LatestInstance }              from './use-virtual.interfaces'
import { UseVirtualProps }             from './use-virtual.interfaces'
import { validateProps as validate }   from './use-virtual.validate'

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

    useInitializeScrollElements({
      scrollingDelay,
      getScrollElement
    })

    const { virtualItems, totalHeight, allItems } = useMemo(() => {
      const getItemHeight = (idx: number) => {
        if (itemHeight) {
          return itemHeight(idx)
        }

        const itemKey = getItemKey(idx)

        if (isNumber(measurementCache[itemKey])) {
          return measurementCache[itemKey]
        }

        return getEstimateHeight!(idx)
      }

      return calculateVirtualItems({
        overscan,
        getItemHeight,
        getItemKey,
        itemsCount,
        rangeStart: scrollTop,
        rangeEnd: scrollTop + listHeight
      })
    }, [
      scrollTop,
      overscan,
      listHeight,
      itemHeight,
      itemsCount,
      getEstimateHeight,
      measurementCache
    ])

    const latestInstance = useLatest({
      measurementCache,
      getItemKey,
      allItems,
      getScrollElement,
      scrollTop
    } satisfies LatestInstance)

    const measureElement = useMeasureElement({
      latestInstance,
      addToCache: ctx.addToCache
    })

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
