import { fireEvent }                   from '@testing-library/react'
import { renderHook }                  from '@testing-library/react-hooks'
import { act }                         from 'react-dom/test-utils'
import { afterEach }                   from 'vitest'
import { beforeEach }                  from 'vitest'
import { describe }                    from 'vitest'
import { expect }                      from 'vitest'
import { test }                        from 'vitest'
import { vi }                          from 'vitest'

import { VirtualContextPayload }       from '@/context/virtual-context.interfaces'
import { useInitializeScrollElements } from '@/core/hooks/use-initialize-scroll.hook'
import { UseInitializeScrollProps }    from '@/core/hooks/use-initialize-scroll.hook'
import { createTestingWrapper }        from '@/shared/lib'
import { rafThrottle }                 from '@/shared/lib'

describe('use-initialize-scroll-elements', () => {
  let virtualWrapper: ReturnType<typeof createTestingWrapper>
  let ctx: Partial<VirtualContextPayload>
  let scrollElement: Element
  let getScrollElement: () => Element
  let scrollingDelay: number
  let props: UseInitializeScrollProps
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    ctx = {
      update: vi.fn()
    } as unknown as Partial<VirtualContextPayload>

    virtualWrapper = createTestingWrapper(ctx)

    scrollElement = document.createElement('div')
    getScrollElement = () => scrollElement
    props = {
      scrollingDelay,
      getScrollElement
    }
  })

  test('should initialize scroll elements and update context', () => {
    const { unmount } = renderHook(() => useInitializeScrollElements(props), {
      wrapper: virtualWrapper
    })

    act(() => {
      scrollElement.scrollTop = 100
      fireEvent.scroll(scrollElement)
    })

    vi.advanceTimersByTime(scrollingDelay)

    rafThrottle(() => {
      expect(ctx.update).toHaveBeenCalledWith({ isScrolling: false })
    })()

    unmount()
  })
})
