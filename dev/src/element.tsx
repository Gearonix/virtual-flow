import { forwardRef } from 'react'
import { WithChildren } from '@grnx-utils/types'

export const ExampleElement = forwardRef<
  HTMLDivElement,
  WithChildren<{ height: number }>
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