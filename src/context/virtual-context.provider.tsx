import { AnyObject }                  from '@grnx-utils/types'
import { isString }                   from '@grnx-utils/types'
import { WithChildren }               from '@grnx-utils/types'
import { createContext }              from 'react'
import { Reducer }                    from 'react'
import { useCallback }                from 'react'
import { useMemo }                    from 'react'
import { useReducer }                 from 'react'

import { CachePayload }               from '@/context/virtual-context.interfaces'
import { VirtualContextUpdateMethod } from '@/context/virtual-context.interfaces'
import { VirtualContextPayload }      from '@/context/virtual-context.interfaces'
import { VirtualStatePayload }        from '@/context/virtual-context.interfaces'

export const VirtualContext = createContext<VirtualContextPayload>(
  {} as VirtualContextPayload
)

export const VirtualProvider = ({ children }: WithChildren<AnyObject>) => {
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
  >(
    useCallback((virtualState, payload) => {
      return {
        ...virtualState,
        ...payload
      } satisfies VirtualStatePayload
    }, []),
    initialState
  )

  const addToCache = useCallback(
    (payload: CachePayload) => {
      return {
        ...state.measurementCache,
        [payload.key]: payload.height
      }
    },
    [state]
  )

  const updateState = (...args: Parameters<VirtualContextUpdateMethod>) => {
    if (isString(args[0]) && args[1]) {
      return update({
        [args[0]]: args[1]
      })
    }

    update(args[0] as Partial<VirtualStatePayload>)
  }

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

  return (
    <VirtualContext.Provider value={contextInstance}>
      {children}
    </VirtualContext.Provider>
  )
}
