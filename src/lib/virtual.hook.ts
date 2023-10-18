import { Nullable }        from '@grnx-utils/types'
import { Undefinable }     from '@grnx-utils/types'
import { useMemo }         from 'react'
import { useLayoutEffect } from 'react'
import { useState }        from 'react'

export interface UseVirtualProps {
  count: number
  getScrollElement: () => Nullable<HTMLElement>
  itemHeight: number
  overscan?: number
  scrollingDelay?: number
}

export interface VirtualItem {
  idx: number
  offsetTop: number
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

  const virtualItems = useMemo(() => {
    const rangeStart = scrollTop
    const rangeEnd = scrollTop + listHeight

    let startIdx = Math.floor(rangeStart / itemHeight)
    let endIdx = Math.ceil(rangeEnd / itemHeight)

    startIdx = Math.max(0, startIdx - overscan)
    endIdx = Math.min(itemsCount - 1, endIdx + overscan)

    const virtualItems: VirtualItem[] = []

    for (let i = startIdx; i <= endIdx; i++) {
      virtualItems.push({
        idx: i,
        offsetTop: i * itemHeight
      })
    }

    return virtualItems
  }, [scrollTop, itemsCount, listHeight])

  const totalListHeight = itemHeight * itemsCount

  return {
    totalListHeight,
    virtualItems,
    isScrolling
  }
}
