import { ItemCacheKey } from '@/core/use-virtual.interfaces'
import { VirtualItem }  from '@/core/use-virtual.interfaces'

export interface CalculateVirtualItemsProps {
  rangeStart: number
  rangeEnd: number
  itemsCount: number
  overscan: number
  getItemKey: (idx: number) => ItemCacheKey
  getItemHeight: (idx: number) => number
}

/** calculateVirtualItems
 * @returns virtualItems {VirtualItem[]} - items to render depending on the scroll position
 * @returns totalHeight {number} - The total height of all elements
 */

export const calculateVirtualItems = ({
  rangeStart,
  itemsCount,
  rangeEnd,
  overscan,
  getItemKey,
  getItemHeight
}: CalculateVirtualItemsProps) => {
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
