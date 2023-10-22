export interface GetElementHeightProps {
  entry?: ResizeObserverEntry
  element: Element
}

/**
 * Use the height of either the element or
 * the new value from the ResizeObserver
 * @param element {Element}
 * @param entry {ResizeObserverEntry}
 */

export const getElementHeight = ({ element, entry }: GetElementHeightProps) => {
  return (
    entry?.borderBoxSize[0].blockSize ?? element.getBoundingClientRect().height
  )
}
