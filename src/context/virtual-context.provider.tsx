import { AnyObject }                  from '@grnx-utils/types'
import { isObject }                   from '@grnx-utils/types'
import { isString }                   from '@grnx-utils/types'
import { WithChildren }               from '@grnx-utils/types'
import { createContext }              from 'react'
import { useEffect }                  from 'react'
import { Reducer }                    from 'react'
import { useCallback }                from 'react'
import { useMemo }                    from 'react'
import { useReducer }                 from 'react'

import { CachePayload }               from './virtual-context.interfaces'
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

  // TODO: refactor this stuff
  const updateState = useCallback(
    (...args: Parameters<VirtualContextUpdateMethod>) => {
      if (isObject(args[0])) {
        return update({
          ...(args[0] as any)
        })
      }

      update({
        [args[0]]: args[1]!
      })
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
