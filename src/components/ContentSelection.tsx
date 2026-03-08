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
      <p className="sr-only" role="status">
        {selectedConsonantIds.length} consonants, {selectedVowelIds.length} vowels selected
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Select Consonants</h2>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mt-1">
              {consonantSet.size} of {THAI_CONSONANTS.length} selected
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllConsonants}
              aria-label="Select all consonants"
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearConsonants}
              aria-label="Clear consonants"
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {THAI_CONSONANTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleConsonant(c.id)}
              aria-pressed={consonantSet.has(c.id)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-colors ${
                consonantSet.has(c.id)
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl leading-tight">{c.char}</span>
              {c.name && (
                <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-full">
                  {c.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Select Vowels</h2>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mt-1">
              {vowelSet.size} of {THAI_VOWELS.length} selected
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllVowels}
              aria-label="Select all vowels"
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearVowels}
              aria-label="Clear vowels"
              className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {THAI_VOWELS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => toggleVowel(v.id)}
              aria-pressed={vowelSet.has(v.id)}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-colors ${
                vowelSet.has(v.id)
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl leading-tight">{v.char}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
