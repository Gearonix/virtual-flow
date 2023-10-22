import { UnreachableCaseException } from '@/shared/exceptions'

/**
 * Exhaustive check
 * @reference https://dev.to/babak/exhaustive-type-checking-with-typescript-4l3f
 */

export const exhaustiveCheck = (unreachableValue: never) => {
  throw new UnreachableCaseException(unreachableValue)
}
