import { useCallback, useEffect, useRef, useState } from 'react'
import { ContentSelection } from './components/ContentSelection'
import { SheetOptions } from './components/SheetOptions'
import { Preview } from './components/Preview'
import { OutputActions } from './components/OutputActions'
import { useContentSelection } from './hooks/useContentSelection'
import { useInitialPreviewColumns } from './hooks/useInitialPreviewColumns'
import { usePdfExport } from './hooks/usePdfExport'
import {
  DEFAULT_SHEET_CONFIG,
  FONT_FAMILY_MAP,
  getSheetConfigClampNotice,
  normalizeSheetConfig,
} from './data/sheetOptions'
import type { SheetConfig } from './data/sheetOptions'

function App() {
  const selection = useContentSelection()
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(DEFAULT_SHEET_CONFIG)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<number | null>(null)
  const selectedFontFamily = FONT_FAMILY_MAP[sheetConfig.font] || '"Sarabun", sans-serif'
  const handleInitialPreviewColumns = useCallback(
    ({ columns, ghostCopiesPerRow }: { columns: number; ghostCopiesPerRow: number }) => {
      setSheetConfig((current) => ({
        ...current,
        columns,
        ghostCopiesPerRow,
      }))
    },
    []
  )
  const { previewRootRef } = useInitialPreviewColumns({
    fontSize: sheetConfig.fontSize,
    columns: sheetConfig.columns,
    ghostCopiesPerRow: sheetConfig.ghostCopiesPerRow,
    onInitialize: handleInitialPreviewColumns,
  })
  const { handleDownloadPdf, pdfExportState } = usePdfExport({
    selectedConsonantIds: selection.selectedConsonantIds,
    selectedVowelIds: selection.selectedVowelIds,
    config: sheetConfig,
    onError: () => {
      setToastMessage('PDF export failed. Please try again.')
    },
  })

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
    const clampNotice = getSheetConfigClampNotice(sheetConfig, normalizedConfig)
    if (clampNotice) setToastMessage(clampNotice)

    setSheetConfig(normalizedConfig)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="text-center pt-12 pb-8 px-4">
        <p className="text-indigo-400 text-xs font-semibold tracking-[0.3em] uppercase mb-3">
          Thai Script Pro
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          <span className="sr-only">Thai Script Pro — </span>
          Thai Worksheet Generator
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Create polished printable Thai writing sheets in seconds.
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
