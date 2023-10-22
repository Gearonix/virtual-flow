import { isNumber }                  from '@grnx-utils/types'
import { Nullable }                  from '@grnx-utils/types'
import { Undefinable }               from '@grnx-utils/types'
import { useCallback }               from 'react'
import { useLayoutEffect }           from 'react'
import { useMemo }                   from 'react'
/* Canary new react hook 👌 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { use }                       from 'react'

import { VirtualContext }            from '@/context/virtual-context.provider'
import { DEFAULT_OVERSCAN }          from '@/shared/consts'
import { DEFAULT_SCROLLING_DELAY }   from '@/shared/consts'
import { VIRTUAL_INDEX_ATTRIBUTE }   from '@/shared/consts'
import { NoVirtualIndexException }   from '@/shared/exceptions'
import { useLatest }                 from '@/shared/hooks'
import { createPropsValidator }      from '@/shared/lib'

import { UseVirtualProps }           from './use-virtual.interfaces'
import { VirtualItem }               from './use-virtual.interfaces'
import { validateProps as validate } from './use-virtual.validate'

export const useVirtual = createPropsValidator(
  ({
    count: itemsCount,
    getScrollElement,
    scrollingDelay = DEFAULT_SCROLLING_DELAY,
    itemHeight,
    overscan = DEFAULT_OVERSCAN,
    getEstimateHeight,
    getItemKey
  }: UseVirtualProps) => {
    const ctx = use(VirtualContext)

    const { measurementCache, scrollTop, isScrolling, listHeight } = ctx.state
    useLayoutEffect(() => {
      const scrollElement = getScrollElement()

      if (!scrollElement) {
        return
      }

      let timeoutId: Undefinable<NodeJS.Timeout>

      const handleScroll = () => {
        const scrollTop = scrollElement.scrollTop

        ctx.update({
          scrollTop,
          isScrolling: true
        })

        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
          ctx.update('isScrolling', false)
        }, scrollingDelay)
      }

      const resizeObserver = new ResizeObserver(([entry]) => {
        const height = entry.target.getBoundingClientRect().height
        ctx.update('listHeight', height)
      })

      resizeObserver.observe(scrollElement)

      scrollElement.addEventListener('scroll', handleScroll)

      return () => {
        resizeObserver.unobserve(scrollElement)
        clearTimeout(timeoutId)
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }, [getScrollElement])

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

    // TODO: bring out the logic to custom hook

    const itemsResizeObserver = useMemo(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const element = entry.target

          if (!element || !element.isConnected) {
            return void resizeObserver.unobserve(element)
          }

          const idxAttribute =
            element.getAttribute(VIRTUAL_INDEX_ATTRIBUTE) ?? ''
          const elementIdx = Number.parseInt(idxAttribute, 10)

          if (Number.isNaN(elementIdx)) {
            throw new NoVirtualIndexException()
          }

          const { measurementCache, getItemKey } = latestData.current
          const cacheKey = getItemKey(elementIdx)

          const elementHeight =
            entry.borderBoxSize[0].blockSize ??
            element.getBoundingClientRect().height

          if (measurementCache[cacheKey] === elementHeight) return

          ctx.addToCache({
            key: cacheKey,
            height: elementHeight
          })
        })
      })
      return resizeObserver
    }, [])

    const latestData = useLatest({
      measurementCache,
      getItemKey
    })

    const measureElement = useCallback(
      (element: Nullable<Element>) => {
        if (!element) return

        const idxAttribute = element.getAttribute(VIRTUAL_INDEX_ATTRIBUTE) ?? ''
        const elementIdx = Number.parseInt(idxAttribute, 10)

        if (Number.isNaN(elementIdx)) {
          throw new NoVirtualIndexException()
        }

        const { measurementCache, getItemKey } = latestData.current
        const cacheKey = getItemKey(elementIdx)
        itemsResizeObserver.observe(element)

        if (typeof measurementCache[cacheKey] === 'number') return

        const elementRect = element.getBoundingClientRect()

        ctx.addToCache({
          key: cacheKey,
          height: elementRect.height
        })
      },
      [latestData, itemsResizeObserver]
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
