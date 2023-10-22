import { ValueOf }      from '@grnx-utils/types'

import { ItemCacheKey } from '@/core/use-virtual.interfaces'

export interface CachePayload {
  key: ItemCacheKey
  height: number
}

export interface VirtualStatePayload {
  listHeight: number
  scrollTop: number
  isScrolling: boolean
  measurementCache: Record<ItemCacheKey, number>
}

export interface VirtualContextPayload {
  state: VirtualStatePayload
  update: VirtualContextUpdateMethod
  addToCache: (payload: CachePayload) => void
}

export interface VirtualContextUpdateMethod {
  (payload: Partial<VirtualStatePayload>): void
  <T extends keyof VirtualStatePayload>(
    propertyKey: T,
    value: VirtualStatePayload[T]
  ): void
}

export type VirtualContextUpdateParams = [
  Partial<VirtualStatePayload> | keyof VirtualStatePayload,
  ValueOf<VirtualStatePayload>
]
