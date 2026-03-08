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
    // TODO: generate PDF from current selection + config (Phase 5.3–5.4)
    const blob = new Blob(['PDF placeholder'], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'thai-script-practice.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-semibold">Thai Script Pro</h1>
      </header>
      <main className="p-4 max-w-6xl mx-auto space-y-8">
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
        <Preview
          selectedConsonantIds={selection.selectedConsonantIds}
          selectedVowelIds={selection.selectedVowelIds}
          config={sheetConfig}
        />
        <OutputActions onPrint={handlePrint} onDownloadPdf={handleDownloadPdf} />
      </main>
    </div>
  )
}

export default App
