import { faker }          from '@faker-js/faker'
import { VirtualFlow }    from '@project'
import { useState }       from 'react'

import { ExampleElement } from './element'

const items = Array.from({ length: 1_00 }, () => ({
  id: Math.random().toString(36).slice(2),
  text: faker.lorem.paragraphs(),
  height: 80 + Math.round(Math.random() * 10)
}))

export const Entrypoint = () => {
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
        className="container"
        style={{
          height: 600
        }}>
        <VirtualFlow>
          {listItems.map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <ExampleElement key={idx} height={item.height}>
              {item.text}
            </ExampleElement>
          ))}
        </VirtualFlow>
      </div>
    </div>
  )
}
