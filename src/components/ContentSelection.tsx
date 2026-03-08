import { useContentSelection } from '../hooks/useContentSelection'
import { THAI_CONSONANTS } from '../data/consonants'
import { THAI_VOWELS } from '../data/vowels'

export interface ContentSelectionProps {
  selectedConsonantIds?: string[]
  selectedVowelIds?: string[]
  onToggleConsonant?: (id: string) => void
  onToggleVowel?: (id: string) => void
  onSelectAllConsonants?: () => void
  onClearConsonants?: () => void
  onSelectAllVowels?: () => void
  onClearVowels?: () => void
}

export function ContentSelection(props: ContentSelectionProps = {}) {
  const hook = useContentSelection()
  const selectedConsonantIds = props.selectedConsonantIds ?? hook.selectedConsonantIds
  const selectedVowelIds = props.selectedVowelIds ?? hook.selectedVowelIds
  const toggleConsonant = props.onToggleConsonant ?? hook.toggleConsonant
  const toggleVowel = props.onToggleVowel ?? hook.toggleVowel
  const selectAllConsonants = props.onSelectAllConsonants ?? hook.selectAllConsonants
  const clearConsonants = props.onClearConsonants ?? hook.clearConsonants
  const selectAllVowels = props.onSelectAllVowels ?? hook.selectAllVowels
  const clearVowels = props.onClearVowels ?? hook.clearVowels

  const consonantSet = new Set(selectedConsonantIds)
  const vowelSet = new Set(selectedVowelIds)

  return (
    <section className="space-y-6" aria-label="Content selection">
      <p className="text-sm text-gray-600" role="status">
        {selectedConsonantIds.length} consonants, {selectedVowelIds.length} vowels selected
      </p>

      <div>
        <h2 className="text-lg font-semibold mb-2">Consonants</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={selectAllConsonants}
            className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
          >
            Select all consonants
          </button>
          <button
            type="button"
            onClick={clearConsonants}
            className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
          >
            Clear consonants
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {THAI_CONSONANTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleConsonant(c.id)}
              aria-pressed={consonantSet.has(c.id)}
              className={`min-w-[2.5rem] py-2 rounded border text-lg ${
                consonantSet.has(c.id)
                  ? 'bg-amber-200 border-amber-400'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {c.char}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Vowels</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={selectAllVowels}
            className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
          >
            Select all vowels
          </button>
          <button
            type="button"
            onClick={clearVowels}
            className="px-3 py-1 text-sm border rounded bg-gray-100 hover:bg-gray-200"
          >
            Clear vowels
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {THAI_VOWELS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => toggleVowel(v.id)}
              aria-pressed={vowelSet.has(v.id)}
              className={`min-w-[2.5rem] py-2 rounded border text-lg ${
                vowelSet.has(v.id)
                  ? 'bg-amber-200 border-amber-400'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              {v.char}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
