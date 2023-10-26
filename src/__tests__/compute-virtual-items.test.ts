import { beforeEach }                 from 'vitest'
import { expect }                     from 'vitest'
import { describe }                   from 'vitest'
import { test }                       from 'vitest'

import { CalculateVirtualItemsProps } from '@/core/lib/compute-virtual-items'
import { computeVirtualItems }        from '@/core/lib/compute-virtual-items'

describe('compute-virtual-items', () => {
  let payload: CalculateVirtualItemsProps

  beforeEach(() => {
    payload = {
      rangeStart: 100,
      rangeEnd: 400,
      itemsCount: 1000,
      overscan: 5,
      getItemKey: (idx: number) => `item-${idx}`,
      getItemHeight: () => 50
    }
  })

  test('calculates virtual items and total height', () => {
    const result = computeVirtualItems(payload)

    expect(result.virtualItems).toHaveLength(13)
    expect(result.totalHeight).toBe(50_000)
  })

  test('handles case where rangeStart and rangeEnd are at the beginning', () => {
    payload.rangeStart = 0
    payload.rangeEnd = 1200

    const result = computeVirtualItems(payload)

    expect(result.virtualItems).toHaveLength(29)
    expect(result.totalHeight).toBe(50_000)
  })

  test('handles a small range with no overscan', () => {
    payload.rangeStart = 50
    payload.rangeEnd = 75

    const result = computeVirtualItems(payload)

    expect(result.virtualItems).toHaveLength(7)
    expect(result.totalHeight).toBe(50_000)
  })
})
