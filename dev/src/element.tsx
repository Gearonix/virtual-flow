import { WithChildren } from '@grnx-utils/types'
import { forwardRef }   from 'react'

export interface ExampleElementProps {
  height: number
}

export const ExampleElement = forwardRef<
  HTMLDivElement,
  WithChildren<ExampleElementProps>
>(({ children, height }, ref) => {
  return (
    <div
      style={{
        padding: '6px 12px',
        border: '1px solid red',
        boxSizing: 'border-box',
        width: '100%',
        height
      }}
      ref={ref}>
      {children}
    </div>
  )
})
