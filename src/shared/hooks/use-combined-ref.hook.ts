import { Nullable }         from '@grnx-utils/types'
import { Undefinable }      from '@grnx-utils/types'
import { VoidFunction }     from '@grnx-utils/types'
import { MutableRefObject } from 'react'
import { useCallback }      from 'react'

import { isFunction }       from '@/shared/type-guards'

type RefItem<T> =
  | VoidFunction<Nullable<T>>
  | MutableRefObject<Nullable<T>>
  | Undefinable<null>

export const useCombinedRef = <T>(...refs: RefItem<T>[]) => {
  return useCallback((element: Nullable<T>) => {
    refs.forEach((ref) => {
      if (!ref) return

      if (isFunction(ref)) {
        return ref(element)
      }

      ref.current = element
    })
  }, refs)
}
