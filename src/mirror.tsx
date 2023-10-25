import { Nullable }                from '@grnx-utils/types'
import { Undefinable }             from '@grnx-utils/types'
import { cloneElement }            from 'react'
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
}

export const VirtualMirror = ({
  virtualItem,
  originalNode,
  cbRef
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

  useFilteredLayoutEffect(
    (element) => {
      element.style.top = `${virtualItem.offsetTop}px`

      cbRef(element)
    },
    [layoutRef.current, virtualItem],
    layoutRef
  )

  if (!originalNode) return null

  /**
   * @reference https://react.dev/reference/react/cloneElement
   * cloneElement is legacy method, will be rewritten
   */
  return cloneElement(originalNode as ReactElement, {
    ref: layoutRef,
    key: virtualItem.idx
  })
}
