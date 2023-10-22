import { AnyFunction }  from '@grnx-utils/types'
import { VoidFunction } from '@grnx-utils/types'

export interface CreatePropsValidatorOptions<T> {
  validate: VoidFunction<Partial<T>>
}

/**
 * creates a wrapper over the hook and checks the necessary props
 * @param hook {T}
 * @param opts {CreatePropsValidatorOptions<Props<T>>}
 */

type Props<T extends AnyFunction<unknown>> = Parameters<T>[0]

export const createPropsValidator = <T extends AnyFunction<any>>(
  hook: T,
  opts: CreatePropsValidatorOptions<Props<T>>
) => {
  return (props: Props<T>): ReturnType<T> => {
    opts.validate(props)

    return hook(props)
  }
}
