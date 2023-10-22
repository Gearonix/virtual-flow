import { Nullable }        from '@grnx-utils/types'
import { VirtualFlow }         from '@project'
import { useEffect }       from 'react'
import { useRef }          from 'react'

import { useUniversalRef } from './universal-ref'

const EXPERIMENTAL_FILES = false as const

export const Entrypoint = () => {
  const universalRef = useUniversalRef<Element>((element) => {
    console.log(element)
  })

  const elementRef = useRef(null)
  const elementRef2 = useRef<Nullable<HTMLElement>>(null)

  useEffect(() => {
    console.log(elementRef)
    console.log(elementRef2.current?.textContent)
  }, [elementRef.current, elementRef2.current])

  if (EXPERIMENTAL_FILES) {
    return (
      <div>
        <div ref={universalRef}>ref1</div>
        <div ref={universalRef(elementRef)}>ref2</div>
        <div ref={universalRef(elementRef, elementRef2)}>ref3</div>
      </div>
    )
  }

  return <VirtualFlow />
}
