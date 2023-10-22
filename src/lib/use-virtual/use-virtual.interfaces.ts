import { Nullable } from '@grnx-utils/types'

export type ItemKey = string | number

export interface UseVirtualProps {
  count: number
  getScrollElement: () => Nullable<HTMLElement>
  itemHeight?: (height: number) => number
  overscan?: number
  getEstimateHeight?: (idx: number) => number
  getItemKey: (idx: number) => ItemKey
  scrollingDelay?: number
}

export interface VirtualItem {
  key: ItemKey
  idx: number
  offsetTop: number
  virtualHeight: number
}