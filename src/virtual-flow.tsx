import { CSSProperties }          from 'react'
import { useCallback }            from 'react'
import { useMemo }                from 'react'
import { useRef }                 from 'react'

import { VirtualContextProvider } from '@/context'
import { useVirtual }             from '@/core'
import { VirtualMirror }          from '@/mirror'
import { useGenerateVirtualIds }  from '@/shared/hooks'
import { WithArrayChildren }      from '@/shared/interfaces'

export interface VirtualFlowProps {
  estimateHeight?: number
  itemHeight?: (height: number) => number
  scrollingDelay?: number
  overscan?: number
  onScroll?: (scrollTop: number, isScrolling: boolean) => void
}

export const VirtualFlow = ({
  children,
  estimateHeight,
  itemHeight,
  overscan,
  scrollingDelay,
  onScroll
}: WithArrayChildren<VirtualFlowProps>) => {
  const virtualRowsList = useGenerateVirtualIds(children)

  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualRows = useVirtual({
    count: virtualRowsList.length,
    getEstimateHeight: useCallback(() => estimateHeight ?? 80, []),
    getItemKey: useCallback(
      (idx: number) => virtualRowsList[idx]!.id,
      [virtualRowsList]
    ),
    getScrollElement: useCallback(() => scrollRef.current, []),
    overscan,
    scrollingDelay,
    itemHeight,
    onScroll
  })

  const containerStyles: CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      overflow: 'auto',
      boxSizing: 'border-box',
      position: 'relative'
    }),
    []
  )

  return (
    <div ref={scrollRef} style={containerStyles}>
      <div
        style={{
          height: virtualRows.totalListHeight
        }}>
        {virtualRows.virtualItems.map((virtualItem) => (
          <VirtualMirror
            key={virtualItem.idx}
            cbRef={virtualRows.measureElement}
            virtualItem={virtualItem}
            originalNode={children[virtualItem.idx]}
          />
        ))}
      </div>
    </div>
  )
}

export const VirtualFlowContextWrapper = (
  props: WithArrayChildren<VirtualFlowProps>
) => (
  <VirtualContextProvider>
    <VirtualFlow {...props} />
  </VirtualContextProvider>
)
