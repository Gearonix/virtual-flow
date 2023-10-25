import { Nullable }                from '@grnx-utils/types'
import { Undefinable }             from '@grnx-utils/types'
import { cloneElement }            from 'react'
import { useEffect }               from 'react'
import { ReactElement }            from 'react'
import { ReactNode }               from 'react'
import { useRef }                  from 'react'

import { VirtualItem }             from '@/core/use-virtual.interfaces'
import { VIRTUAL_INDEX_ATTRIBUTE } from '@/shared/consts'
import { useFilteredLayoutEffect } from '@/shared/hooks'

export interface VirtualElementMirrorProps {
  originalNode: Undefinable<ReactNode>
  cbRef: (element: Nullable<Element>) => void
  virtualItem: VirtualItem
  allRows: any
}

export const VirtualElementMirror = ({
  virtualItem,
  originalNode,
  cbRef,
  allRows
}: VirtualElementMirrorProps) => {
  const layoutRef = useRef<Nullable<HTMLElement>>(null)

  useFilteredLayoutEffect(
    (element) => {
      element!.style.position = 'absolute'

      element.setAttribute(VIRTUAL_INDEX_ATTRIBUTE, virtualItem.idx.toString())
    },
    [],
    layoutRef
  )

  useEffect(() => {
    if (!layoutRef.current) return
    const element = layoutRef.current
    element.style.top = `${virtualItem.offsetTop}px`

    cbRef(element)
  }, [layoutRef.current, allRows])

  if (!originalNode) return null

  return cloneElement(originalNode as ReactElement, {
    ref: layoutRef,
    key: virtualItem.idx
  })
}
