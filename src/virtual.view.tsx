import { CSSProperties }          from 'react'
import { useCallback }            from 'react'
import { useMemo }                from 'react'
import { useRef }                 from 'react'

import { VirtualContextProvider } from '@/context'
import { useVirtual }             from '@/core'
import { VirtualElementMirror }   from '@/element-mirror.view'
import { useGenerateVirtualIds }  from '@/shared/hooks'
import { WithArrayChildren }      from '@/shared/interfaces'

export const VirtualFlow = ({ children }: WithArrayChildren) => {
  const virtualIds = useGenerateVirtualIds(children.length)

  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualFlow = useVirtual({
    count: virtualIds.length,
    getEstimateHeight: useCallback(() => 40, []),
    getItemKey: useCallback((idx: number) => virtualIds[idx]!.id, [virtualIds]),
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
          height: virtualFlow.totalListHeight
        }}>
        {virtualFlow.virtualItems.map((virtualItem) => (
          <VirtualElementMirror
            key={virtualItem.idx}
            cbRef={virtualFlow.measureElement}
            virtualItem={virtualItem}
            originalNode={children[virtualItem.idx]}
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
