<h1 align="center">
virtual-flow
</h1>
<p align="center">
    An attempt to implement virtual scroll functionality in React for optimizing the handling of large datasets
<p>
<br/>

### Usage

Most of the solutions and implementations were taken from [Ayub Begimkulov](https://github.com/Ayub-Begimkulov/youtube-tutorials/blob/master/virtualization-from-scratch/src/examples/DynamicHeight-improved.tsx).

I just improved and extended it by decomposing, covering it with tests and adding a top-level API for easy use.

---

### Installation

```
$ yarn add virtual-flow
```
Import the `VirtualFlow` component.

```tsx
import { VirtualFlow } from 'virtual-flow'

export const VirtualizedList = () => {
  return (
    <VirtualFlow>
      {items.map((item, idx) => (
        <Item key={idx}>
          {item.text}
        </Item>
      ))}
    </VirtualFlow>
  )
}
```

If you are using a component, you should use [forwardRef](https://react.dev/reference/react/forwardRef)
to pass the ref to the regular element.

```tsx
export const Item = forwardRef<
  HTMLDivElement,
  WithChildren<ItemProps>
>(({ children }, ref) => {
  return (
    <div ref={ref}>
      {children}
    </div>
  )
})
```

The library can work with dynamic heights of elements, implements caching of element heights,
reacts to changes in the length of elements (using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)) and also uses techniques such as scroll correction.


<img src="https://github.com/Gearonix/virtual-flow/blob/media/showcase.gif" width="70%" height="50%" />

### Run Example

```sh
$ nx serve dev
```

### Run tests with Vitest
```sh
$ nx test
```

## Build library

```sh
$ nx build
```

---

## Usage API

| Property                                |                   Type                   | Description                           |
| --------------------------------------- | :--------------------------------------: | :--------------------------------------- |
| onScroll                                |            (scrollTop: number) => void           | Callback, which will be called at the time of scrolling               |
| estimateHeight                                   |                  number                  | Approximate length of the element, it is highly recommended to set|
| scrollingDelay                                  |                  number                  | Delay at which callback `onScroll` will be called |
| overscan                                |           number           | Number of elements that need to be rendered additionally |
| itemHeight                |           (height: number) => number            | Constant height of the element. Use only if you have elements of the same length |
