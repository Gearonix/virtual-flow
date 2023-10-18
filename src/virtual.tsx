import { useState } from 'react'

const items = Array.from({ length: 1_000 }, (_, idx) => ({
  id: Math.random().toString(36).slice(2),
  text: String(idx)
}))

const itemHeight = 40
const containerHeight = 600

export const Virtual = () => {
  const [listItems, setListItems] = useState(items)

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
        style={{
          height: containerHeight,
          overflow: 'auto',
          border: '1px solid lightgrey'
        }}>
        {listItems.map((item, idx) => {
          return (
            <div
              key={idx}
              style={{
                height: itemHeight,
                padding: '6px 12px'
              }}>
              {item.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
