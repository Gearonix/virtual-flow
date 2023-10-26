import { el }                              from '@faker-js/faker'
import { AnyFunction }                     from '@grnx-utils/types'
import { act }                             from '@testing-library/react-hooks'
import { renderHook }                      from '@testing-library/react-hooks'
import { MutableRefObject }                from 'react'
import { beforeAll }                       from 'vitest'
import { beforeEach }                      from 'vitest'
import { describe }                        from 'vitest'
import { expect }                          from 'vitest'
import { Mock }                            from 'vitest'
import { test }                            from 'vitest'
import { vi }                              from 'vitest'

import { mockElementWithVirtualAttribute } from '@/__tests__/testing-utils'
import { mockLatestInstance }              from '@/__tests__/testing-utils'
import { mockResizeObserver }              from '@/__tests__/testing-utils'
import { useMeasureElement }               from '@/core/hooks/use-measure-element.hook'
import { UseMeasureElementProps }          from '@/core/hooks/use-measure-element.hook'
import * as cacheKeyModule                 from '@/core/lib'
import * as scrollCorrectionModule         from '@/core/lib/scroll-correction'
import { LatestInstance }                  from '@/core/use-virtual.interfaces'
import { VIRTUAL_INDEX_ATTRIBUTE }         from '@/shared/consts'

describe('use-measure-element', () => {
  let observe: Mock
  let fixScrollCorrection: Mock
  let getCacheKey: Mock
  let addToCache: Mock
  let props: UseMeasureElementProps
  let element: HTMLElement
  let latestInstance: MutableRefObject<LatestInstance>
  let hook: AnyFunction<AnyFunction>
  const mockCacheKey = 'key_0'
  const mockCacheIndex = 0

  beforeEach(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    hook = () => useMeasureElement(props)
    fixScrollCorrection = vi.fn()
    getCacheKey = vi.fn(() => ({
      cacheKey: mockCacheKey,
      elementIdx: 0
    }))
    addToCache = vi.fn()

    observe = mockResizeObserver().observe

    vi.spyOn(scrollCorrectionModule, 'fixScrollCorrection').mockImplementation(
      fixScrollCorrection
    )

    vi.spyOn(cacheKeyModule, 'getCacheKey').mockImplementation(getCacheKey)

    latestInstance = mockLatestInstance(mockCacheKey)

    props = {
      addToCache,
      latestInstance
    }

    element = mockElementWithVirtualAttribute(mockCacheIndex)
  })

  test('should observe element height and add it to the cache', () => {
    const { result } = renderHook(hook)

    act(() => {
      result.current(element)
    })

    expect(observe).toHaveBeenCalled()
    expect(fixScrollCorrection).toHaveBeenCalled()
    expect(getCacheKey).toHaveBeenCalled()

    expect(addToCache).toHaveBeenCalledWith({
      key: 'key_0',
      height: 0
    })
  })

  test('should not add to cache when height equal cache height', () => {
    const currentHeight = element.getBoundingClientRect().height
    const cache = latestInstance.current.measurementCache

    cache[mockCacheKey] = currentHeight

    const { result } = renderHook(hook)

    act(() => {
      result.current(element)
    })

    expect(observe).toHaveBeenCalled()
    expect(getCacheKey).toHaveBeenCalled()

    expect(fixScrollCorrection).not.toHaveBeenCalled()
    expect(addToCache).not.toHaveBeenCalled()
  })
})
