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
    <div className="element" style={{ height }} ref={ref}>
      {children}
    </div>
  )
})
