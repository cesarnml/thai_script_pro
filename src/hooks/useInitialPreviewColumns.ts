import { useEffect, useRef } from 'react'
import { getInitialColumnsForWidth } from '../data/sheetOptions'

export interface InitialPreviewColumnsAdjustment {
  columns: number
  ghostCopiesPerRow: number
}

interface UseInitialPreviewColumnsOptions {
  fontSize: string
  columns: number
  ghostCopiesPerRow: number
  onInitialize: (adjustment: InitialPreviewColumnsAdjustment) => void
}

export function useInitialPreviewColumns({
  fontSize,
  columns,
  ghostCopiesPerRow,
  onInitialize,
}: UseInitialPreviewColumnsOptions) {
  const previewRootRef = useRef<HTMLDivElement>(null)
  const hasInitializedColumnsRef = useRef(false)

  useEffect(() => {
    if (hasInitializedColumnsRef.current) return

    const previewRoot = previewRootRef.current
    const previewSurface = previewRoot?.querySelector<HTMLElement>(
      '[data-preview-surface="true"]',
    )
    if (!previewSurface) return

    const styles = window.getComputedStyle(previewSurface)
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0
    const availableWidthPx = Math.max(
      0,
      previewSurface.clientWidth - paddingLeft - paddingRight,
    )
    const initialColumns = getInitialColumnsForWidth(fontSize, availableWidthPx)

    hasInitializedColumnsRef.current = true

    if (initialColumns === columns) return

    onInitialize({
      columns: initialColumns,
      ghostCopiesPerRow: Math.min(ghostCopiesPerRow, initialColumns),
    })
  }, [columns, fontSize, ghostCopiesPerRow, onInitialize])

  return { previewRootRef }
}
