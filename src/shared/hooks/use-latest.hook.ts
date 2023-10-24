import { useInsertionEffect } from 'react'
import { useRef }             from 'react'

export const useLatest = <T>(value: T) => {
  const valueRef = useRef(value)

  useInsertionEffect(() => {
    valueRef.current = value
  })

  return valueRef
}