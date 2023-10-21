import { Nullable }        from '@grnx-utils/types'
import { Undefinable }     from '@grnx-utils/types'
import { useCallback }     from 'react'
import { useLayoutEffect } from 'react'
import { useMemo }         from 'react'
import { useState }        from 'react'

import { useLatest }       from '@/lib/use-latest.hook'

type ItemKey = string | number

export interface UseVirtualProps {
  count: number
  getScrollElement: () => Nullable<HTMLElement>
  itemHeight?: (height: number) => number
  overscan?: number
  getEstimateHeight?: (idx: number) => number
  getItemKey: (idx: number) => ItemKey
  scrollingDelay?: number
}

export interface VirtualItem {
  key: ItemKey
  idx: number
  offsetTop: number
  virtualHeight: number
}

const DEFAULT_OVERSCAN = 3 as const
const DEFAULT_SCROLLING_DELAY = 100 as const
const VIRTUAL_INDEX_ATTRIBUTE = 'data-vindex' as const

const validateProps = ({
  itemHeight,
  getEstimateHeight
}: Partial<UseVirtualProps>) => {
  if (!itemHeight && !getEstimateHeight) {
    // TODO: rewrite this
    throw new Error('validateProps Error')
  }
}

export const useVirtual = ({
  count: itemsCount,
  getScrollElement,
  scrollingDelay = DEFAULT_SCROLLING_DELAY,
  itemHeight,
  overscan = DEFAULT_OVERSCAN,
  getEstimateHeight,
  getItemKey
}: UseVirtualProps) => {
  validateProps({ itemHeight, getEstimateHeight })
  const [measurementCache, setMeasurementCache] = useState<
    Record<ItemKey, number>
  >({})
  const [listHeight, setListHeight] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  useLayoutEffect(() => {
    const scrollElement = getScrollElement()

    if (!scrollElement) {
      return
    }

    let timeoutId: Undefinable<NodeJS.Timeout>

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop

      setScrollTop(scrollTop)
      setIsScrolling(true)

      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        setIsScrolling(false)
      }, scrollingDelay)
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const height = entry.target.getBoundingClientRect().height
      setListHeight(height)
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

      if (typeof measurementCache[itemKey] === 'number') {
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
        // TODO: rewrite this
        return console.error(`you forgot ${VIRTUAL_INDEX_ATTRIBUTE}`)
      }

      const { measurementCache, getItemKey } = latestData.current
      const cacheKey = getItemKey(elementIdx)

      if (typeof measurementCache[cacheKey] === 'number') return

      const elementRect = element.getBoundingClientRect()

      setMeasurementCache((cache) => ({
        ...cache,
        [cacheKey]: elementRect.height
      }))
    },
    [latestData]
  )

  return {
    totalListHeight: totalHeight,
    virtualItems,
    isScrolling,
    measureElement
  }
}

export {}
