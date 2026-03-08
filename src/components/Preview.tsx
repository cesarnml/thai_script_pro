import type { SheetConfig } from '../data/sheetOptions'
import { THAI_CONSONANTS } from '../data/consonants'
import { THAI_VOWELS } from '../data/vowels'

interface PreviewProps {
  selectedConsonantIds: string[]
  selectedVowelIds: string[]
  config: SheetConfig
}

export function Preview({ selectedConsonantIds, selectedVowelIds, config }: PreviewProps) {
  const consonants = THAI_CONSONANTS.filter((c) => selectedConsonantIds.includes(c.id))
  const vowels = THAI_VOWELS.filter((v) => selectedVowelIds.includes(v.id))

  return (
    <section
      role="region"
      aria-label="Preview"
      className="border rounded-lg p-4 bg-gray-50 min-h-[200px]"
      data-grid-guide={config.gridGuide}
      data-font={config.font}
      data-rows-per-character={config.rowsPerCharacter}
      data-ghost-copies={config.ghostCopiesPerRow}
    >
      <h2 className="text-sm font-semibold text-gray-600 mb-2">Preview</h2>
      <div className="flex flex-wrap gap-4">
        {consonants.map((c) => (
          <div key={c.id} className="flex flex-col items-center">
            {Array.from({ length: config.rowsPerCharacter }).map((_, row) => (
              <div key={row} className="flex gap-1 mb-1">
                {Array.from({ length: config.ghostCopiesPerRow }).map((_, i) => (
                  <span
                    key={i}
                    className="text-2xl text-gray-400 opacity-60"
                    aria-hidden
                  >
                    {c.char}
                  </span>
                ))}
              </div>
            ))}
            <span className="text-2xl font-medium" style={{ fontFamily: 'var(--preview-font)' }}>
              {c.char}
            </span>
          </div>
        ))}
        {vowels.map((v) => (
          <span key={v.id} className="text-2xl">
            {v.char}
          </span>
        ))}
      </div>
      {consonants.length === 0 && vowels.length === 0 && (
        <p className="text-gray-500 text-sm">Select consonants or vowels to see preview.</p>
      )}
    </section>
  )
}
