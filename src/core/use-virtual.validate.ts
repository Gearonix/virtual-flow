import { UseVirtualProps }             from '@/core/use-virtual.interfaces'
import { UseVirtualValidateException } from '@/shared/exceptions'

/**
 * validates props for useVirtual hook
 * @param itemHeight - constant height of the element. Use if you know the
 * height of each element in advance and it is the same.
 * @param getEstimateHeight - approximate length of each element
 */

export const validateProps = ({
  itemHeight,
  getEstimateHeight
}: Partial<UseVirtualProps>) => {
  if (!itemHeight && !getEstimateHeight) {
    throw new UseVirtualValidateException()
  }
}
