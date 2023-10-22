export interface GetElementHeightProps {
  entry?: ResizeObserverEntry
  element: Element
}

export const getElementHeight = ({ element, entry }: GetElementHeightProps) => {
  return (
    entry?.borderBoxSize[0].blockSize ?? element.getBoundingClientRect().height
  )
}
