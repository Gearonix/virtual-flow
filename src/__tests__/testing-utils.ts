import { MutableRefObject }        from 'react'
import { vi }                      from 'vitest'

import { ItemCacheKey }            from '../core/use-virtual.interfaces'
import { VirtualItem }             from '../core/use-virtual.interfaces'
import { LatestInstance }          from '../core/use-virtual.interfaces'
import { VIRTUAL_INDEX_ATTRIBUTE } from '../shared/consts'

export const mockResizeObserver = () => {
  const observe = vi.fn()
  const unobserve = vi.fn()
  const disconnect = vi.fn()

  const ResizeObserverMock = vi.fn(() => ({
    observe,
    unobserve,
    disconnect
  }))

  vi.stubGlobal('ResizeObserver', ResizeObserverMock)

  return { observe, unobserve, disconnect }
}

export const mockLatestInstance = (mockCacheKey: ItemCacheKey) => {
  return {
    current: {
      measurementCache: {},
      getItemKey: (idx: number) => `key_${idx}`,
      allItems: [
        {
          key: mockCacheKey,
          idx: 0,
          offsetTop: 0,
          virtualHeight: 120
        }
      ]
    }
  } as MutableRefObject<LatestInstance>
}

export const mockElementWithVirtualAttribute = (cacheIdx: number) => {
  const element = document.createElement('div')

  element.setAttribute(VIRTUAL_INDEX_ATTRIBUTE, cacheIdx.toString())

  document.body.append(element)

  return element
}

export const mockVirtualItem = (): VirtualItem => ({
  idx: 2,
  offsetTop: 100,
  key: 0,
  virtualHeight: 60
})
