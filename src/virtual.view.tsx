import { CSSProperties }          from 'react'
import { useCallback }            from 'react'
import { useMemo }                from 'react'
import { useRef }                 from 'react'

import { VirtualContextProvider } from '@/context'
import { useVirtual }             from '@/core'
import { VirtualElementMirror }   from '@/element-mirror.view'
import { useGenerateVirtualIds }  from '@/shared/hooks'
import { WithArrayChildren }      from '@/shared/interfaces'

export interface VirtualFlowProps {}

export const VirtualFlow = ({ children }: WithArrayChildren) => {
  const virtualRowsList = useGenerateVirtualIds(children)

  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualRows = useVirtual({
    count: virtualRowsList.length,
    getEstimateHeight: useCallback(() => 80, []),
    getItemKey: useCallback(
      (idx: number) => virtualRowsList[idx]!.id,
      [virtualRowsList]
    ),
    getScrollElement: useCallback(() => scrollRef.current, [])
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
          <VirtualElementMirror
            key={virtualItem.idx}
            cbRef={virtualRows.measureElement}
            virtualItem={virtualItem}
            originalNode={children[virtualItem.idx]}
            allRows={virtualRowsList}
          />
        ))}
      </div>
    </div>
  )
}

export const VirtualFlowContextWrapper = ({ children }: WithArrayChildren) => (
  <VirtualContextProvider>
    <VirtualFlow>{children}</VirtualFlow>
  </VirtualContextProvider>
)
