import { AnyObject } from '@grnx-utils/types'

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}

export const isString = <T extends string>(value: unknown): value is T => {
  return typeof value === 'string'
}

export const isObject = (value: unknown): value is AnyObject => {
  return typeof value === 'object' && value !== null
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function'
}
