import { useContext }            from 'react'

import { VirtualContextPayload } from './virtual-context.interfaces'
import { VirtualContext }        from './virtual-context.provider'

export const useVirtualContext = () => {
  return useContext(VirtualContext) as VirtualContextPayload
}
