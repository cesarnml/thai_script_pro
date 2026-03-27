import { useEffect, useRef, useState } from 'react'
import { ContentSelection } from './components/ContentSelection'
import { SheetOptions } from './components/SheetOptions'
import { Preview } from './components/Preview'
import { OutputActions } from './components/OutputActions'
import { useContentSelection } from './hooks/useContentSelection'
import {
  DEFAULT_SHEET_CONFIG,
  FONT_FAMILY_MAP,
  getInitialColumnsForWidth,
  getMaxColumnsForFontSize,
} from './data/sheetOptions'
import type { SheetConfig } from './data/sheetOptions'
import { downloadPracticePdf } from './pdf/downloadPracticePdf'

type PdfExportPhase = 'idle' | 'preparing' | 'generating' | 'downloading' | 'error'

interface PdfExportState {
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
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
    return
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
}

function normalizeSheetConfig(config: SheetConfig): SheetConfig {
  const maxColumns = getMaxColumnsForFontSize(config.fontSize)
  const columns = Math.min(config.columns, maxColumns)

  return {
    ...config,
    columns,
    ghostCopiesPerRow: Math.min(config.ghostCopiesPerRow, columns),
  }
}

function App() {
  const selection = useContentSelection()
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(DEFAULT_SHEET_CONFIG)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [pdfExportState, setPdfExportState] = useState<PdfExportState>(IDLE_PDF_EXPORT_STATE)
  const toastTimeoutRef = useRef<number | null>(null)
  const previewRootRef = useRef<HTMLDivElement>(null)
  const hasInitializedColumnsRef = useRef(false)
  const isPdfExportingRef = useRef(false)
  const selectedFontFamily = FONT_FAMILY_MAP[sheetConfig.font] || '"Sarabun", sans-serif'

  useEffect(() => {
    if (hasInitializedColumnsRef.current) return

    const previewRoot = previewRootRef.current
    const previewSurface = previewRoot?.querySelector<HTMLElement>('[data-preview-surface="true"]')
    if (!previewSurface) return

    const styles = window.getComputedStyle(previewSurface)
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
    const paddingRight = Number.parseFloat(styles.paddingRight) || 0
    const availableWidthPx = Math.max(0, previewSurface.clientWidth - paddingLeft - paddingRight)
    const initialColumns = getInitialColumnsForWidth(sheetConfig.fontSize, availableWidthPx)

    hasInitializedColumnsRef.current = true

    if (initialColumns === sheetConfig.columns) return

    setSheetConfig((current) => ({
      ...current,
      columns: initialColumns,
      ghostCopiesPerRow: Math.min(current.ghostCopiesPerRow, initialColumns),
    }))
  }, [sheetConfig.columns, sheetConfig.fontSize])

  useEffect(() => {
    if (!toastMessage) return

    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null)
      toastTimeoutRef.current = null
    }, 5000)

    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current)
        toastTimeoutRef.current = null
      }
    }
  }, [toastMessage])

  const dismissToast = () => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current)
      toastTimeoutRef.current = null
    }
    setToastMessage(null)
  }

  const handleSheetConfigChange = (nextConfig: SheetConfig) => {
    const normalizedConfig = normalizeSheetConfig(nextConfig)

    if (
      nextConfig.fontSize !== sheetConfig.fontSize &&
      normalizedConfig.columns !== sheetConfig.columns
    ) {
      setToastMessage(`Adjusted to ${normalizedConfig.columns} columns so it fits on the page.`)
    }

    setSheetConfig(normalizedConfig)
  }

  const updatePdfExportState = (phase: Exclude<PdfExportPhase, 'idle' | 'error'>, completed?: number, total?: number) => {
    if (phase === 'preparing') {
      setPdfExportState({
        phase,
        label: 'Preparing PDF...',
        statusMessage: 'Preparing your PDF...',
      })
      return
    }

    if (phase === 'generating') {
      const hasProgress = typeof completed === 'number' && typeof total === 'number' && total > 0
      setPdfExportState({
        phase,
        label: hasProgress ? `Building ${completed}/${total}` : 'Building PDF...',
        statusMessage: hasProgress
          ? `Building your PDF pages (${completed} of ${total})...`
          : 'Building your PDF pages...',
      })
      return
    }

    setPdfExportState({
      phase,
      label: 'Starting download...',
      statusMessage: 'Starting your PDF download...',
    })
  }

  const handleDownloadPdf = async () => {
    if (isPdfExportingRef.current) return

    isPdfExportingRef.current = true
    updatePdfExportState('preparing')

    try {
      await waitForNextPaint()

      await downloadPracticePdf({
        selectedConsonantIds: selection.selectedConsonantIds,
        selectedVowelIds: selection.selectedVowelIds,
        config: sheetConfig,
        onProgress: ({ phase, completed, total }) => {
          updatePdfExportState(phase, completed, total)
        },
      })
    } catch (error) {
      console.error('PDF export failed', error)
      setPdfExportState({
        phase: 'error',
        label: 'Download PDF',
        statusMessage: '',
      })
      setToastMessage('PDF export failed. Please try again.')
    } finally {
      isPdfExportingRef.current = false
      setPdfExportState(IDLE_PDF_EXPORT_STATE)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="text-center pt-12 pb-8 px-4">
        <p className="text-indigo-400 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
          ก บ ท &middot; Practice
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          <span className="sr-only">Thai Script Pro — </span>
          Thai Writing Practice
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Select consonants below and generate a printable practice sheet with
          traceable guides.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-4 pb-16 space-y-6">
        <SheetOptions config={sheetConfig} onChange={handleSheetConfigChange} />

        <ContentSelection
          selectedConsonantIds={selection.selectedConsonantIds}
          selectedVowelIds={selection.selectedVowelIds}
          fontFamily={selectedFontFamily}
          onToggleConsonant={selection.toggleConsonant}
          onToggleVowel={selection.toggleVowel}
          onApplyConsonantPreset={selection.applyConsonantPreset}
          onApplyVowelPreset={selection.applyVowelPreset}
          onSelectAllConsonants={selection.selectAllConsonants}
          onClearConsonants={selection.clearConsonants}
          onSelectAllVowels={selection.selectAllVowels}
          onClearVowels={selection.clearVowels}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <OutputActions
            onDownloadPdf={handleDownloadPdf}
            isDownloading={pdfExportState.phase !== 'idle'}
            downloadLabel={pdfExportState.label}
            statusMessage={pdfExportState.statusMessage}
          />
        </div>

        <div ref={previewRootRef} data-live-preview-root="true">
          <Preview
            selectedConsonantIds={selection.selectedConsonantIds}
            selectedVowelIds={selection.selectedVowelIds}
            config={sheetConfig}
          />
        </div>
      </main>

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-2 text-sm text-white shadow-lg"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={dismissToast}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
