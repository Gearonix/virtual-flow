import { AnyObject }                  from '@grnx-utils/types'
import { WithChildren }               from '@grnx-utils/types'
import { createContext }              from 'react'
import { useEffect }                  from 'react'
import { Reducer }                    from 'react'
import { useCallback }                from 'react'
import { useMemo }                    from 'react'
import { useReducer }                 from 'react'

import { UnreachableCaseException }   from '@/shared/exceptions'
import { exhaustiveCheck }            from '@/shared/lib'
import { isObject }                   from '@/shared/type-guards'
import { isString }                   from '@/shared/type-guards'

import { CachePayload }               from './virtual-context.interfaces'
import { VirtualContextUpdateParams } from './virtual-context.interfaces'
import { VirtualContextUpdateMethod } from './virtual-context.interfaces'
import { VirtualContextPayload }      from './virtual-context.interfaces'
import { VirtualStatePayload }        from './virtual-context.interfaces'

export const VirtualContext = createContext<VirtualContextPayload>(
  {} as VirtualContextPayload
)

export const VirtualContextProvider = ({
  children
}: WithChildren<AnyObject>) => {
  const initialState = useMemo<VirtualStatePayload>(
    () => ({
      listHeight: 0,
      scrollTop: 0,
      isScrolling: false,
      measurementCache: {}
    }),
    []
  )

  const [state, update] = useReducer<
    Reducer<VirtualStatePayload, Partial<VirtualStatePayload>>
  >((virtualState, payload) => {
    if ('measurementCache' in payload) {
      return {
        ...virtualState,
        measurementCache: {
          ...virtualState.measurementCache,
          ...payload.measurementCache
        }
      }
    }

    return {
      ...virtualState,
      ...payload
    } satisfies VirtualStatePayload
  }, initialState)

  const addToCache = useCallback(
    (payload: CachePayload) => {
      update({
        measurementCache: {
          [payload.key]: payload.height
        }
      })
    },
    [update]
  )

  const updateState = useCallback(
    ([payload, value]: VirtualContextUpdateParams) => {
      if (isObject(payload)) {
        return update({
          ...payload
        })
      }

      if (isString(payload)) {
        return update({
          [payload]: value
        })
      }

      /**
       * Exhaustive check
       * @reference https://dev.to/babak/exhaustive-type-checking-with-typescript-4l3f
       */

      exhaustiveCheck(payload)
    },
    [update]
  )

  const contextInstance: VirtualContextPayload = useMemo(
    () => ({
      state,
      /**
       * assign a value to avoid mapping all parameters
       */
      update: updateState as VirtualContextUpdateMethod,
      addToCache
    }),
    [state]
  )
  useEffect(() => {
    return () => {
      console.log('unmount')
    }
  }, [])

  return (
    <VirtualContext.Provider value={contextInstance}>
      {children}
    </VirtualContext.Provider>
  )
}
