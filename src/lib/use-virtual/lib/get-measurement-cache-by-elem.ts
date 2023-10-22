import { MutableRefObject }        from 'react'

import { LatestInstance }          from '@/lib/use-virtual/use-virtual.interfaces'
import { VIRTUAL_INDEX_ATTRIBUTE } from '@/shared/consts'
import { NoVirtualIndexException } from '@/shared/exceptions'

export interface UseMeasurementCacheByElementProps {
  element: Element
  latestInstance: MutableRefObject<LatestInstance>
}

export const getMeasurementCacheByElement = ({
  element,
  latestInstance
}: UseMeasurementCacheByElementProps) => {
  const idxAttribute = element.getAttribute(VIRTUAL_INDEX_ATTRIBUTE) ?? ''
  const elementIdx = Number.parseInt(idxAttribute, 10)

  if (Number.isNaN(elementIdx)) {
    throw new NoVirtualIndexException()
  }

  const { getItemKey, measurementCache } = latestInstance.current

  return {
    cacheKey: getItemKey(elementIdx),
    measurementCache
  }
}
