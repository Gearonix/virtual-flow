import { beforeEach }       from 'vitest'
import { describe }         from 'vitest'
import { expect }           from 'vitest'
import { test }             from 'vitest'

import { getElementHeight } from '@/core/lib'

describe('get-element-height', () => {
  let element: Element
  let entry: ResizeObserverEntry

  beforeEach(() => {
    element = {
      getBoundingClientRect: () => ({
        height: 100
      })
    } as Element

    entry = {
      borderBoxSize: [{ blockSize: 200, inlineSize: -1 }]
    } as unknown as ResizeObserverEntry
  })

  test('should be defined', () => {
    expect(getElementHeight).toBeDefined()
  })

  test('should return the element height when entry is null', () => {
    expect(getElementHeight({ element })).toEqual(100)
  })

  test('should return the block size from entry when it is available', () => {
    element = {} as Element

    expect(getElementHeight({ element, entry })).toEqual(200)
  })

  test('should return element height when entry is available but lacks block size', () => {
    entry = { borderBoxSize: [{}] } as unknown as ResizeObserverEntry

    const result = getElementHeight({ element, entry })
    expect(result).toEqual(100)
  })

  test('should return the block size from entry when it is available', () => {
    expect(getElementHeight({ element, entry })).toEqual(200)
  })
})
