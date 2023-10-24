import { Nullable }        from '@grnx-utils/types'
import { Undefinable }     from '@grnx-utils/types'
import { useContext }      from 'react'
import { useLayoutEffect } from 'react'

import { VirtualContext }  from '@/context/virtual-context.provider'
import { rafThrottle }     from '@/shared/lib'

export interface UseInitializeScrollProps {
  scrollingDelay: number
  getScrollElement: () => Nullable<Element>
}

/**
 * Initializes the useScroll hook. Adds a ResizeObserver to the main element,
 * measures scrollTop and isScrolling when updated
 * @param scrollingDelay
 * @param getScrollElement
 */
export const useInitializeScrollElements = ({
  scrollingDelay,
  getScrollElement
}: UseInitializeScrollProps) => {
  const ctx = useContext(VirtualContext)

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

    const throttledHandleScroll = rafThrottle(handleScroll)

    scrollElement.addEventListener('scroll', throttledHandleScroll)

    return () => {
      resizeObserver.unobserve(scrollElement)
      clearTimeout(timeoutId)
      scrollElement.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [getScrollElement])
}
