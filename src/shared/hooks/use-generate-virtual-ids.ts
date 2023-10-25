import { ReactNode } from 'react'
import { useMemo }   from 'react'
import uuid          from 'uuid-v4'

export const useGenerateVirtualIds = (elements: ReactNode[]) => {
  return useMemo(
    () =>
      Array.from({ length: elements.length }, (_, idx) => ({
        id: uuid()
      })),
    [elements]
  )
}
