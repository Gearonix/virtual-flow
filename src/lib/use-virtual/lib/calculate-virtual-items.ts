import { useContext }     from 'react'

import { VirtualContext } from '@/context/virtual-context.provider'
import { VirtualItem }    from '@/lib/use-virtual/use-virtual.interfaces'

export interface CalculateVirtualItemsProps {
  scrollTop: number
  listHeight: number
  itemsCount: number

}


export const calculateVirtualItems = () => {
  const rangeStart = scrollTop
  const rangeEnd = scrollTop + listHeight

  let startIdx = -1
  let endIdx = -1

  const allRows: VirtualItem[] = new Array(itemsCount).fill(null)
  let totalHeight = 0

  for (let idx = 0; idx < allRows.length; idx++) {
    const itemKey = getItemKey(idx)

    const row: VirtualItem = {
      key: itemKey,
      idx,
      virtualHeight: getItemHeight(idx),
      offsetTop: totalHeight
    }

    totalHeight += row.virtualHeight
    allRows[idx] = row

    if (row.offsetTop + row.virtualHeight > rangeStart && !~startIdx) {
      startIdx = Math.max(0, idx - overscan)
    }

    if (row.offsetTop + row.virtualHeight >= rangeEnd && !~endIdx) {
      endIdx = Math.min(itemsCount - 1, idx + overscan)
    }
  }

  endIdx = endIdx === -1 ? itemsCount - 1 : endIdx

  const virtualItems = allRows.slice(startIdx, endIdx + 1)

  return {
    virtualItems,
    totalHeight
  }
}
