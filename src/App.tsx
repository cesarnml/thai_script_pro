import { useState } from 'react'
import { ContentSelection } from './components/ContentSelection'
import { SheetOptions } from './components/SheetOptions'
import { Preview } from './components/Preview'
import { OutputActions } from './components/OutputActions'
import { useContentSelection } from './hooks/useContentSelection'
import { DEFAULT_SHEET_CONFIG } from './data/sheetOptions'
import type { SheetConfig } from './data/sheetOptions'

function App() {
  const selection = useContentSelection()
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>(DEFAULT_SHEET_CONFIG)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = () => {
    const blob = new Blob(['PDF placeholder'], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'thai-script-practice.pdf'
    a.click()
    URL.revokeObjectURL(url)
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

      <main className="max-w-[900px] mx-auto px-4 pb-16 space-y-6">
        <ContentSelection
          selectedConsonantIds={selection.selectedConsonantIds}
          selectedVowelIds={selection.selectedVowelIds}
          onToggleConsonant={selection.toggleConsonant}
          onToggleVowel={selection.toggleVowel}
          onSelectAllConsonants={selection.selectAllConsonants}
          onClearConsonants={selection.clearConsonants}
          onSelectAllVowels={selection.selectAllVowels}
          onClearVowels={selection.clearVowels}
        />

        <SheetOptions config={sheetConfig} onChange={setSheetConfig} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
          <OutputActions onPrint={handlePrint} onDownloadPdf={handleDownloadPdf} />
        </div>

        <Preview
          selectedConsonantIds={selection.selectedConsonantIds}
          selectedVowelIds={selection.selectedVowelIds}
          config={sheetConfig}
        />
      </main>
    </div>
  )
}

export default App
