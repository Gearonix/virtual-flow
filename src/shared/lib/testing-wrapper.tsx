import { WithChildren }           from '@grnx-utils/types'

import { VirtualContextProvider } from '@/context'
import { VirtualContextPayload }  from '@/context/virtual-context.interfaces'

export const createTestingContextWrapper = (ctx: Partial<VirtualContextPayload>) => {
  return ({ children }: WithChildren<NonNullable<unknown>>) => {
    return (
      <VirtualContextProvider overrideValues={ctx}>
        {children}
      </VirtualContextProvider>
    )
  }
}
