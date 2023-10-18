import { useCallback }      from 'react'
import { useRef }           from 'react'
import { useState }         from 'react'

import { useVirtual }       from '@/lib/virtual.hook'

const items = Array.from({ length: 1_000 }, (_, idx) => ({
  id: Math.random().toString(36).slice(2),
  text: String(idx)
}))

export const Virtual = () => {
  const [listItems, setListItems] = useState(items)

  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualFlow = useVirtual({
    count: listItems.length,
    itemHeight: 40,
    containerHeight: 610,
    getScrollElement: useCallback(() => scrollRef.current, [])
  })

  console.log(virtualFlow.isScrolling)

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
          height: 610,
          overflow: 'auto',
          border: '1px solid lightgrey',
          position: 'relative'
        }}>
        <div
          style={{
            minHeight: virtualFlow.totalListHeight
          }}>
          {virtualFlow.virtualItems.map((virtualItem) => {
            const item = listItems[virtualItem.idx]
            return (
              <div
                key={virtualItem.idx}
                style={{
                  height: 40,
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
