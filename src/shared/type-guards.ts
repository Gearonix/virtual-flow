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
