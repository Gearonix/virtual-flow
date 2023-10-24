import { Nullable }                from '@grnx-utils/types'
import { cloneElement }            from 'react'
import { ReactElement }            from 'react'
import { ReactNode }               from 'react'
import { useLayoutEffect }         from 'react'
import { useRef }                  from 'react'

import { VirtualItem }             from '@/core/use-virtual.interfaces'
import { VIRTUAL_INDEX_ATTRIBUTE } from '@/shared/consts'
import { useFilterLayoutEffect }   from '@/shared/hooks'

export interface VirtualElementMirrorProps {
  originalNode: ReactNode
  cbRef: (element: Nullable<Element>) => void
  virtualItem: VirtualItem
}

export const VirtualElementMirror = ({
  virtualItem,
  originalNode,
  cbRef
}: VirtualElementMirrorProps) => {
  const layoutRef = useRef<Nullable<HTMLElement>>(null)

  useFilterLayoutEffect(
    (element) => {
      element!.style.position = 'absolute'

      element.setAttribute(VIRTUAL_INDEX_ATTRIBUTE, virtualItem.idx.toString())
    },
    [],
    layoutRef
  )

  useFilterLayoutEffect(
    (element) => {
      element.style.top = `${virtualItem.offsetTop}px`

      cbRef(element)
    },
    [layoutRef.current],
    layoutRef
  )

  return cloneElement(originalNode as ReactElement, {
    ref: layoutRef,
    key: virtualItem.idx
  })
}
