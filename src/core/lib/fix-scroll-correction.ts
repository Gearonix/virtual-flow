import { MutableRefObject } from 'react'

import { LatestInstance }   from '@/core/use-virtual.interfaces'

export interface FixScrollCorrectionProps {
  height: number
  elementIdx: number
  latestInstance: MutableRefObject<LatestInstance>
}

export const fixScrollCorrection = ({
  height,
  elementIdx,
  latestInstance
}: FixScrollCorrectionProps) => {
  const { getScrollElement, scrollTop, allItems } = latestInstance.current

  const virtualElement = allItems[elementIdx]

  const delta = height - virtualElement.virtualHeight

  if (delta === 0 || virtualElement.offsetTop >= scrollTop) return

  const scrollElement = getScrollElement()

  if (scrollElement) {
    scrollElement.scrollBy(0, delta)
  }
}
