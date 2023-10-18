import { Nullable }        from '@grnx-utils/types'
import { Undefinable }     from '@grnx-utils/types'
import { useMemo }         from 'react'
import { useLayoutEffect } from 'react'
import { useState }        from 'react'

export interface UseVirtualProps {
  count: number
  getScrollElement: () => Nullable<HTMLElement>
  itemHeight: (height: number) => number
  overscan?: number
  scrollingDelay?: number
}

export interface VirtualItem {
  idx: number
  offsetTop: number
  height: number
}

export const useVirtual = ({
  count: itemsCount,
  getScrollElement,
  scrollingDelay = 100,
  itemHeight,
  overscan = 3
}: UseVirtualProps) => {
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
    const rangeStart = scrollTop
    const rangeEnd = scrollTop + listHeight

    let startIdx = -1
    let endIdx = -1

    const allRows: VirtualItem[] = new Array(itemsCount).fill(null)
    let totalHeight = 0

    for (let idx = 0; idx < allRows.length; idx++) {
      const row: VirtualItem = {
        idx,
        height: itemHeight(idx),
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
  }, [scrollTop, overscan, listHeight, itemHeight, itemsCount])

  return {
    totalListHeight: totalHeight,
    virtualItems,
    isScrolling
  }
}
