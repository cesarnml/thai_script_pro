import { useCallback, useRef, useState } from 'react'
import type { SheetConfig } from '../data/sheetOptions'
import {
  downloadPracticePdf,
  type DownloadPracticePdfArgs,
  type PdfExportProgress,
} from '../pdf/downloadPracticePdf'

type PdfExportPhase =
  | 'idle'
  | 'preparing'
  | 'generating'
  | 'downloading'
  | 'error'

export interface PdfExportState {
  phase: PdfExportPhase
  label: string
  statusMessage: string
}

const IDLE_PDF_EXPORT_STATE: PdfExportState = {
  phase: 'idle',
  label: 'Download PDF',
  statusMessage: '',
}

async function waitForNextPaint(): Promise<void> {
  if (
    typeof window !== 'undefined' &&
    typeof window.requestAnimationFrame === 'function'
  ) {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
    return
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
}

function getPdfExportState(
  phase: Exclude<PdfExportPhase, 'idle' | 'error'>,
  completed?: number,
  total?: number,
): PdfExportState {
  if (phase === 'preparing') {
    return {
      phase,
      label: 'Preparing PDF...',
      statusMessage: 'Preparing your PDF...',
    }
  }

  if (phase === 'generating') {
    const hasProgress =
      typeof completed === 'number' && typeof total === 'number' && total > 0
    return {
      phase,
      label: hasProgress ? `Building ${completed}/${total}` : 'Building PDF...',
      statusMessage: hasProgress
        ? `Building your PDF pages (${completed} of ${total})...`
        : 'Building your PDF pages...',
    }
  }

  return {
    phase,
    label: 'Starting download...',
    statusMessage: 'Starting your PDF download...',
  }
}

interface UsePdfExportOptions {
  selectedConsonantIds: string[]
  selectedVowelIds: string[]
  config: SheetConfig
  onError?: () => void
  downloadPdf?: (options: DownloadPracticePdfArgs) => Promise<void>
}

export function usePdfExport({
  selectedConsonantIds,
  selectedVowelIds,
  config,
  onError,
  downloadPdf = downloadPracticePdf,
}: UsePdfExportOptions) {
  const [pdfExportState, setPdfExportState] = useState<PdfExportState>(
    IDLE_PDF_EXPORT_STATE,
  )
  const isPdfExportingRef = useRef(false)

  const handleDownloadPdf = useCallback(async () => {
    if (isPdfExportingRef.current) return

    isPdfExportingRef.current = true
    setPdfExportState(getPdfExportState('preparing'))

    try {
      await waitForNextPaint()

      await downloadPdf({
        selectedConsonantIds,
        selectedVowelIds,
        config,
        onProgress: ({ phase, completed, total }: PdfExportProgress) => {
          setPdfExportState(getPdfExportState(phase, completed, total))
        },
      })
    } catch (error) {
      console.error('PDF export failed', error)
      setPdfExportState({
        phase: 'error',
        label: 'Download PDF',
        statusMessage: '',
      })
      onError?.()
    } finally {
      isPdfExportingRef.current = false
      setPdfExportState(IDLE_PDF_EXPORT_STATE)
    }
  }, [config, downloadPdf, onError, selectedConsonantIds, selectedVowelIds])

  return {
    handleDownloadPdf,
    pdfExportState,
  }
}
