import { Nullable }        from '@grnx-utils/types'
import { Undefinable }     from '@grnx-utils/types'
import { useCallback }     from 'react'
import { useMemo }         from 'react'
import { useLayoutEffect } from 'react'
import { useState }        from 'react'

type ItemKey = string | number

export interface UseVirtualProps {
  count: number
  getScrollElement: () => Nullable<HTMLElement>
  itemHeight?: (height: number) => number
  overscan?: number
  estimateHeight?: (idx: number) => number
  getItemKey: (idx: number) => ItemKey
  scrollingDelay?: number
}

export interface VirtualItem {
  key: ItemKey
  idx: number
  offsetTop: number
  height: number
}

const DEFAULT_OVERSCAN = 3 as const
const DEFAULT_SCROLLING_DELAY = 100 as const
const VIRTUAL_INDEX_ATTRIBUTE = 'data-vindex' as const

const validateProps = ({
  itemHeight,
  estimateHeight
}: Partial<UseVirtualProps>) => {
  if (!itemHeight && !estimateHeight) {
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
  estimateHeight,
  getItemKey
}: UseVirtualProps) => {
  validateProps({ itemHeight, estimateHeight })
  const [measurmentCache, setMeasurmentCache] = useState<
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
      if (!entry) {
        return
      }

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

      if (typeof measurmentCache[itemKey] === 'number') {
        return measurmentCache[itemKey]!
      }

      return estimateHeight!(idx)
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
        height: getItemHeight(idx),
        offsetTop: totalHeight
      }

      totalHeight += row.height
      allRows[idx] = row

      if (startIdx === -1 && row.offsetTop + row.height > rangeStart) {
        startIdx = Math.max(0, idx - overscan)
      }

      if (endIdx === -1 && row.offsetTop + row.height - 10 >= rangeEnd) {
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
    estimateHeight,
    measurmentCache
  ])

  const measureElement = useCallback((element: Nullable<Element>) => {
    if (!element) return

    const idxAttribute = element.getAttribute(VIRTUAL_INDEX_ATTRIBUTE) ?? ''
    const elementIdx = Number.parseInt(idxAttribute, 10)

    if (Number.isNaN(elementIdx)) {
      // TODO: rewrite this
      return console.error('you forgot data-vindex')
    }

    const elementRect = element.getBoundingClientRect()
    const cacheKey = getItemKey(elementIdx)

    setMeasurmentCache((cache) => ({
      ...cache,
      [cacheKey]: elementRect.height
    }))
  }, [])

  return {
    totalListHeight: totalHeight,
    virtualItems,
    isScrolling,
    measureElement
  }
}
