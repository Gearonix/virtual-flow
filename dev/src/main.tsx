import { StrictMode } from 'react'
import * as ReactDOM  from 'react-dom/client'

import { Entrypoint } from './entrypoint'

const root = ReactDOM.createRoot(document.querySelector('#app') as HTMLElement)
root.render(
  <StrictMode>
    <Entrypoint />
  </StrictMode>
)
