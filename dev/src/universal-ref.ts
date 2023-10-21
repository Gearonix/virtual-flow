import { Nullable }         from '@grnx-utils/types'
import { Undefinable }      from '@grnx-utils/types'
import { MutableRefObject } from 'react'
import { RefCallback }      from 'react'
import { useRef }           from 'react'
import { useCallback }      from 'react'

type RefItem<T> =
  | RefCallback<Nullable<T>>
  | MutableRefObject<Nullable<T>>
  | Undefinable<null>

export const isRef = (value: unknown): value is RefItem<unknown> => {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && 'current' in value!) ||
    value === null
  )
}

export const setRef = <T>(ref: RefItem<T>, value: T) => {
  if (!ref) {
    return
  }

  if (typeof ref === 'function') {
    return ref(value)
  }

  ref.current = value
}

export interface UniversalRef<T> {
  (element: Nullable<T>): void
  (...refs: RefItem<T>[]): (element: Nullable<T>) => void
}

/**
 * useUniversalRef
 * @param originalRef {RefItem<T extends HTMLElement>}
 */

export const useUniversalRef = <T>(originalRef: NonNullable<RefItem<T>>) => {
  const refsToMerge = useRef<Nullable<RefItem<T>[]>>(null)

  const callbackRefMerger = useCallback(
    (element: Nullable<T>) => {
      setRef(originalRef, element)

      refsToMerge.current?.forEach((ref) => {
        setRef(ref, element)
      })
    },
    [originalRef, refsToMerge]
  )

  return useCallback(
    (...args: [Nullable<T>] | RefItem<T>[]) => {
      if (args.length === 1 && !isRef(args[0])) {
        setRef(originalRef, args[0])
        return
      }

      refsToMerge.current = args as RefItem<T>[]

      return callbackRefMerger
    },
    [callbackRefMerger, originalRef]
  ) as UniversalRef<T>
}
