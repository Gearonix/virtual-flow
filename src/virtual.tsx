import { Undefinable }     from '@grnx-utils/types'
import { useEffect }       from 'react'
import { useLayoutEffect } from 'react'
import { useMemo }         from 'react'
import { useRef }          from 'react'
import { useState }        from 'react'

const items = Array.from({ length: 1_000 }, (_, idx) => ({
  id: Math.random().toString(36).slice(2),
  text: String(idx)
}))

const ITEM_HEIGHT = 40
const CONTAINER_HEIGHT = 610
const OVERSCAN = 3
const SCROLLING_DELAY = 100

export const Virtual = () => {
  const [listItems, setListItems] = useState(items)
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement) {
      return
    }

    let timeoutId: Undefinable<NodeJS.Timeout>

    const handleScroll = () => {
      setIsScrolling(true)

      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        setIsScrolling(false)
      }, SCROLLING_DELAY)
    }

    scrollElement.addEventListener('scroll', handleScroll)

    return () => {
      clearTimeout(timeoutId)

      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current

    if (!scrollElement) {
      return
    }

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop

      setScrollTop(scrollTop)
    }

    scrollElement.addEventListener('scroll', handleScroll)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const virtualItems = useMemo(() => {
    const rangeStart = scrollTop
    const rangeEnd = scrollTop + CONTAINER_HEIGHT

    let startIdx = Math.floor(rangeStart / ITEM_HEIGHT)
    let endIdx = Math.ceil(rangeEnd / ITEM_HEIGHT)

    startIdx = Math.max(0, startIdx - OVERSCAN)
    endIdx = Math.min(listItems.length - 1, endIdx + OVERSCAN)

    const virtualItems: any[] = []

    for (let i = startIdx; i <= endIdx; i++) {
      virtualItems.push({
        idx: i,
        offsetTop: i * ITEM_HEIGHT
      })
    }

    return virtualItems
  }, [scrollTop, listItems.length])

  const totalListHeight = ITEM_HEIGHT * listItems.length

  return (
    <div>
      <div>
        <h1>List</h1>
        <div>
          <button
            onClick={() => setListItems((items) => items.slice().reverse())}>
            reverse
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{
          height: CONTAINER_HEIGHT,
          overflow: 'auto',
          border: '1px solid lightgrey',
          position: 'relative'
        }}>
        <div
          style={{
            minHeight: totalListHeight
          }}>
          {virtualItems.map((virtualItem) => {
            const item = listItems[virtualItem.idx]
            return (
              <div
                key={virtualItem.idx}
                style={{
                  height: ITEM_HEIGHT,
                  padding: '6px 12px',
                  border: '1px solid red',
                  boxSizing: 'border-box',
                  position: 'absolute',
                  top: `${virtualItem.offsetTop}px`,
                  width: '100%'
                }}>
                {item.text}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
