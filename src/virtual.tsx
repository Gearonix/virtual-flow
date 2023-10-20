import { faker }       from '@faker-js/faker'
import { useCallback } from 'react'
import { useRef }      from 'react'
import { useState }    from 'react'

import { useVirtual }  from '@/lib/virtual.hook'

const items = Array.from({ length: 1_00 }, () => ({
  id: Math.random().toString(36).slice(2),
  text: faker.lorem.text()
}))

export const Virtual = () => {
  const [listItems, setListItems] = useState(items)

  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualFlow = useVirtual({
    count: listItems.length,
    estimateHeight: useCallback(() => 40, []),
    getItemKey: useCallback((idx: number) => listItems[idx]!.id, [listItems]),
    getScrollElement: useCallback(() => scrollRef.current, [])
  })

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
          height: 600,
          overflow: 'auto',
          /**
           * Can cause a bug at the end with scrollHeight
           */
          // border: '1px solid lightgrey',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
        <div
          style={{
            height: virtualFlow.totalListHeight
          }}>
          {virtualFlow.virtualItems.map((virtualItem) => {
            const item = listItems[virtualItem.idx]
            // console.log(virtualItem)
            return (
              <div
                key={virtualItem.idx}
                data-vindex={virtualItem.idx}
                ref={virtualFlow.measureElement}
                style={{
                  height: virtualItem.height,
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
