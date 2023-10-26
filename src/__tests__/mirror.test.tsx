import                                  '@testing-library/jest-dom/vitest'

import { render }                  from '@testing-library/react'
import { screen }                  from '@testing-library/react'
import React                       from 'react'
import { JSX }                     from 'react'
import { beforeEach }              from 'vitest'
import { describe }                from 'vitest'
import { Mock }                    from 'vitest'
import { expect }                  from 'vitest'
import { test }                    from 'vitest'
import { vi }                      from 'vitest'

import { mockVirtualItem }         from '@/__tests__/testing-utils'
import { VirtualItem }             from '@/core/use-virtual.interfaces'
import { VirtualMirror }           from '@/mirror'
import { VIRTUAL_INDEX_ATTRIBUTE } from '@/shared/consts'

describe('virtual-mirror', () => {
  let cbRef: Mock
  let virtualItem: VirtualItem
  let originalNode: JSX.Element

  beforeEach(() => {
    cbRef = vi.fn()

    virtualItem = mockVirtualItem()
    originalNode = <div style={{ background: '#fff' }}>original-node</div>
  })

  test('renders with the correct attributes and styles', () => {
    render(
      <VirtualMirror
        virtualItem={virtualItem}
        originalNode={originalNode}
        cbRef={cbRef}
      />
    )

    const mirrorElement = screen.getByTestId('isolated-mirror')

    expect(mirrorElement).toBeInTheDocument()

    expect(mirrorElement).toHaveAttribute(VIRTUAL_INDEX_ATTRIBUTE, '2')

    expect(mirrorElement).toHaveStyle({ top: '100px' })

    expect(screen.getByText('original-node')).toBeInTheDocument()

    expect(cbRef).toHaveBeenCalledWith(screen.getByText('original-node'))
  })

  test('does not render if originalNode is null', () => {
    render(
      <VirtualMirror
        virtualItem={virtualItem}
        originalNode={null}
        cbRef={cbRef}
      />
    )

    const mirrorElement = screen.queryByTestId('isolated-mirror')
    expect(mirrorElement).not.toBeInTheDocument()

    expect(cbRef).not.toHaveBeenCalledWith(screen.queryByText('original-node'))
  })
})
