import                         './style.css'

import { faker }          from '@faker-js/faker'
import { VirtualFlow }    from '@project'
import { useState }       from 'react'

import { ExampleElement } from './element'

/**
 * Generating random elements
 */
const items = Array.from({ length: 1_00 }, () => ({
  text: faker.lorem.paragraphs(),
  height: 45 + Math.round(Math.random() * 100) // random height (45-120px)
}))

export const Entrypoint = () => {
  const [listItems, setListItems] = useState(items)

  return (
    <div>
      <div>
        <h1>Virtual Flow Example</h1>
        <div>
          <button
            className="button"
            onClick={() => setListItems((items) => items.slice().reverse())}>
            Reverse
          </button>
        </div>
      </div>
      <div className="container">
        <VirtualFlow>
          {...listItems.map((item, idx) => (
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
