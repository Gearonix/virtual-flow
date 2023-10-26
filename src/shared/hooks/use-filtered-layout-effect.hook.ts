import { Nullable }         from '@grnx-utils/types'
import { DependencyList }   from 'react'
import { MutableRefObject } from 'react'
import { useLayoutEffect }  from 'react'

export const useFilteredLayoutEffect = <
  Ref extends Element,
  Fn extends (element: Ref) => void
>(
  cb: Fn,
  deps: DependencyList,
  ref: MutableRefObject<Nullable<Ref>>
) => {
  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    cb(ref.current)
  }, deps)
}
