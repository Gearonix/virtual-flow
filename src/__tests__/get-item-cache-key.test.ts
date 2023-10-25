import { MutableRefObject }        from 'react'
import { beforeEach }              from 'vitest'
import { describe }                from 'vitest'
import { expect }                  from 'vitest'
import { test }                    from 'vitest'

import { getCacheKey }             from '@/core/lib'
import { LatestInstance }          from '@/core/use-virtual.interfaces'
import { VIRTUAL_INDEX_ATTRIBUTE } from '@/shared/consts'
import { NoVirtualIndexException } from '@/shared/exceptions'

describe('get-item-cache-key', () => {
  let element: Element
  let latestInstance: MutableRefObject<LatestInstance>

  beforeEach(() => {
    element = document.createElement('div')
    element.setAttribute(VIRTUAL_INDEX_ATTRIBUTE, '5')

    latestInstance = {
      current: {
        getItemKey: (index: number) => `key_${index}`
      }
    } as MutableRefObject<LatestInstance>
  })

  test('should return the correct cache key and element index', () => {
    expect(
      getCacheKey({
        element,
        latestInstance
      })
    ).toEqual({
      cacheKey: 'key_5',
      elementIdx: 5
    })
  })

  test('should throw NoVirtualIndexException for invalid element index', () => {
    element.setAttribute(VIRTUAL_INDEX_ATTRIBUTE, 'invalid_idx')

    expect(() =>
      getCacheKey({
        element,
        latestInstance
      })).toThrowError(NoVirtualIndexException)
  })

  test('should handle missing data-vindex attribute', () => {
    element = document.createElement('div')

    expect(() =>
      getCacheKey({
        element,
        latestInstance
      })).toThrowError(NoVirtualIndexException)
  })
})
