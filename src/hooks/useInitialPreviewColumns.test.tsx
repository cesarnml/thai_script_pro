import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useInitialPreviewColumns } from './useInitialPreviewColumns'

function TestHarness({
  fontSize = 'medium',
  columns = 3,
  ghostCopiesPerRow = 2,
  onInitialize = vi.fn(),
}: {
  fontSize?: string
  columns?: number
  ghostCopiesPerRow?: number
  onInitialize?: (adjustment: { columns: number; ghostCopiesPerRow: number }) => void
}) {
  const { previewRootRef } = useInitialPreviewColumns({
    fontSize,
    columns,
    ghostCopiesPerRow,
    onInitialize,
  })

  return (
    <div ref={previewRootRef}>
      <div data-preview-surface="true" />
    </div>
  )
}

describe('useInitialPreviewColumns', () => {
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
    }
  })

  it('reports the largest preview-safe column count on first load', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if ((this as HTMLElement).dataset.previewSurface === 'true') return 720
        return 0
      },
    })

    const onInitialize = vi.fn()
    render(<TestHarness onInitialize={onInitialize} />)

    await waitFor(() => {
      expect(onInitialize).toHaveBeenCalledWith({
        columns: 9,
        ghostCopiesPerRow: 2,
      })
    })
  })

  it('does not report an update when the default columns already fit', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if ((this as HTMLElement).dataset.previewSurface === 'true') return 250
        return 0
      },
    })

    const onInitialize = vi.fn()
    render(<TestHarness columns={3} onInitialize={onInitialize} />)

    await waitFor(() => {
      expect(onInitialize).not.toHaveBeenCalled()
    })
  })

  it('clamps ghost copies when the measured columns are lower than the current value', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if ((this as HTMLElement).dataset.previewSurface === 'true') return 420
        return 0
      },
    })

    const onInitialize = vi.fn()
    render(<TestHarness ghostCopiesPerRow={8} onInitialize={onInitialize} />)

    await waitFor(() => {
      expect(onInitialize).toHaveBeenCalledWith({
        columns: 5,
        ghostCopiesPerRow: 5,
      })
    })
  })
})
