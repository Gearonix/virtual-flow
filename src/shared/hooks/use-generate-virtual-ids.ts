import { useMemo } from 'react'
import uuid        from 'uuid-v4'

export const useGenerateVirtualIds = (count: number) => {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        id: uuid()
      })),
    [count]
  )
}
