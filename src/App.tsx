import { useRef, useState } from 'react'
import { ContentSelection } from './components/ContentSelection'
import { SheetOptions } from './components/SheetOptions'
import { Preview } from './components/Preview'
import { OutputActions } from './components/OutputActions'
import { useContentSelection } from './hooks/useContentSelection'
import { DEFAULT_SHEET_CONFIG, FONT_FAMILY_MAP } from './data/sheetOptions'
import type { SheetConfig } from './data/sheetOptions'
import { downloadPracticePdf } from './pdf/downloadPracticePdf'

function App() {
  const selection = useContentSelection()
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(DEFAULT_SHEET_CONFIG)
  const previewRef = useRef<HTMLDivElement>(null)
  const selectedFontFamily = FONT_FAMILY_MAP[sheetConfig.font] || '"Sarabun", sans-serif'

  const handlePrint = () => {
    const el = previewRef.current
    if (!el) return

    document.body.classList.add('print-preview-active')

    const cleanup = () => {
      document.body.classList.remove('print-preview-active')
    }

    window.addEventListener('afterprint', cleanup, { once: true })
    window.print()
  }

  const handleDownloadPdf = async () => {
    await downloadPracticePdf({
      selectedConsonantIds: selection.selectedConsonantIds,
      selectedVowelIds: selection.selectedVowelIds,
      config: sheetConfig,
    })
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
        <SheetOptions config={sheetConfig} onChange={setSheetConfig} />

        <ContentSelection
          selectedConsonantIds={selection.selectedConsonantIds}
          selectedVowelIds={selection.selectedVowelIds}
          fontFamily={selectedFontFamily}
          onToggleConsonant={selection.toggleConsonant}
          onToggleVowel={selection.toggleVowel}
          onSelectAllConsonants={selection.selectAllConsonants}
          onClearConsonants={selection.clearConsonants}
          onSelectAllVowels={selection.selectAllVowels}
          onClearVowels={selection.clearVowels}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <OutputActions onPrint={handlePrint} onDownloadPdf={handleDownloadPdf} />
        </div>

        <div ref={previewRef} className="print-preview-root" data-live-preview-root="true">
          <Preview
            selectedConsonantIds={selection.selectedConsonantIds}
            selectedVowelIds={selection.selectedVowelIds}
            config={sheetConfig}
          />
        </div>
      </main>
    </div>
  )
}

export default App
