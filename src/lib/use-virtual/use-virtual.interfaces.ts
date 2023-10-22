import { Nullable } from '@grnx-utils/types'

export type ItemCacheKey = string | number

export interface UseVirtualProps {
  count: number
  getScrollElement: () => Nullable<HTMLElement>
  itemHeight?: (height: number) => number
  overscan?: number
  getEstimateHeight?: (idx: number) => number
  getItemKey: (idx: number) => ItemCacheKey
  scrollingDelay?: number
}

export interface VirtualItem {
  key: ItemCacheKey
  idx: number
  offsetTop: number
  virtualHeight: number
}