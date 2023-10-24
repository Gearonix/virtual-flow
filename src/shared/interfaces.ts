import { ReactNode } from 'react'

export type WithArrayChildren<T = NonNullable<unknown>> = {
  children: ReactNode[]
} & T
