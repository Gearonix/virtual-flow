import { UnreachableCaseException } from '@/shared/exceptions'

export const exhaustiveCheck = (unreachableValue: never) => {
  throw new UnreachableCaseException(unreachableValue)
}
