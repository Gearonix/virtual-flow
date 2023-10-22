import { AnyFunction }  from '@grnx-utils/types'
import { VoidFunction } from '@grnx-utils/types'

export interface CreatePropsValidatorOptions<T> {
  validate: VoidFunction<Partial<T>>
}

/**
 * creates a wrapper over the hook and checks the necessary props
 * @param hook {AnyFunction<unknown, T>}
 * @param opts {CreatePropsValidatorOptions<T>}
 */

export const createPropsValidator = <T>(
  hook: AnyFunction<unknown, T>,
  opts: CreatePropsValidatorOptions<T>
) => {
  return (props: T) => {
    opts.validate(props)

    return hook(props)
  }
}
