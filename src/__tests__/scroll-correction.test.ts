import { MutableRefObject }    from 'react'
import { beforeEach }          from 'vitest'
import { Mock }                from 'vitest'
import { describe }            from 'vitest'
import { expect }              from 'vitest'
import { test }                from 'vitest'
import { vi }                  from 'vitest'

import { fixScrollCorrection } from '@/core/lib/scroll-correction'
import { LatestInstance }      from '@/core/use-virtual.interfaces'

describe('fix-scroll-correction', () => {
  let height: number
  let latestInstance: MutableRefObject<LatestInstance>
  let elementIdx: number
  let scrollBy: Mock

  beforeEach(() => {
    height = 100
    elementIdx = 0
    scrollBy = vi.fn()

    latestInstance = {
      current: {
        getScrollElement: vi.fn(() => ({
          scrollBy
        })),
        scrollTop: 0,
        allItems: [{ virtualHeight: 100, offsetTop: 0 }]
      }
    } as unknown as MutableRefObject<LatestInstance>
  })

  test('should not scroll if delta is 0', () => {
    fixScrollCorrection({
      height,
      elementIdx,
      latestInstance
    })

    expect(latestInstance.current.getScrollElement).not.toHaveBeenCalled()
  })

  test('should not scroll if virtualElement is above scrollTop', () => {
    latestInstance.current.scrollTop = 200
    latestInstance.current.allItems[0].offsetTop = 300

    fixScrollCorrection({
      height,
      elementIdx,
      latestInstance
    })

    expect(latestInstance.current.getScrollElement).not.toHaveBeenCalled()
  })

  test('should scroll by delta if delta is non-zero', () => {
    height = 120
    latestInstance.current.scrollTop = 20

    fixScrollCorrection({
      height,
      elementIdx,
      latestInstance
    })

    expect(latestInstance.current.getScrollElement).toHaveBeenCalled()

    /**
     * requestAnimationFrame is used because the scrollBy
     * method is called with createDOMScheduler.
     * @see @/shared/lib/dom-scheduler.ts
     */
    requestAnimationFrame(() => {
      expect(scrollBy).toHaveBeenCalledWith(0, 20)
    })
  })
})
