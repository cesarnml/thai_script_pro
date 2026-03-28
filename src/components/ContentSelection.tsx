import { useContentSelection } from '@/hooks/useContentSelection'
import {
  getConsonantExactMatchPreset,
  getConsonantPresetTriggerLabel,
  type ThaiConsonantPreset,
} from '@/data/consonants'
import {
  getVowelPresetTriggerLabel,
  type ThaiVowelPreset,
} from '@/data/vowels'
import { ConsonantSelectionSection } from './ConsonantSelectionSection'
import { VowelSelectionSection } from './VowelSelectionSection'

export interface ContentSelectionProps {
  selectedConsonantIds?: string[]
  selectedVowelIds?: string[]
  fontFamily?: string
  onToggleConsonant?: (id: string) => void
  onToggleVowel?: (id: string) => void
  onApplyConsonantPreset?: (id: ThaiConsonantPreset['id']) => void
  onApplyVowelPreset?: (id: ThaiVowelPreset['id']) => void
  onSelectAllConsonants?: () => void
  onClearConsonants?: () => void
  onSelectAllVowels?: () => void
  onClearVowels?: () => void
}

export function ContentSelection(props: ContentSelectionProps = {}) {
  const hook = useContentSelection()
  const selectedConsonantIds =
    props.selectedConsonantIds ?? hook.selectedConsonantIds
  const selectedVowelIds = props.selectedVowelIds ?? hook.selectedVowelIds
  const toggleConsonant = props.onToggleConsonant ?? hook.toggleConsonant
  const toggleVowel = props.onToggleVowel ?? hook.toggleVowel
  const applyConsonantPreset =
    props.onApplyConsonantPreset ?? hook.applyConsonantPreset
  const applyVowelPreset = props.onApplyVowelPreset ?? hook.applyVowelPreset
  const selectAllConsonants =
    props.onSelectAllConsonants ?? hook.selectAllConsonants
  const clearConsonants = props.onClearConsonants ?? hook.clearConsonants
  const selectAllVowels = props.onSelectAllVowels ?? hook.selectAllVowels
  const clearVowels = props.onClearVowels ?? hook.clearVowels
  const fontStyle = props.fontFamily
    ? { fontFamily: props.fontFamily }
    : undefined

  const consonantPresetTriggerLabel =
    getConsonantPresetTriggerLabel(selectedConsonantIds)
  const exactConsonantPreset =
    getConsonantExactMatchPreset(selectedConsonantIds)
  const vowelPresetTriggerLabel = getVowelPresetTriggerLabel(selectedVowelIds)

  return (
    <section className="space-y-6" aria-label="Content selection">
      <p className="sr-only" role="status">
        {selectedConsonantIds.length} consonants, {selectedVowelIds.length}{' '}
        vowels selected
      </p>

      <ConsonantSelectionSection
        selectedConsonantIds={selectedConsonantIds}
        consonantPresetTriggerLabel={consonantPresetTriggerLabel}
        exactConsonantPreset={exactConsonantPreset}
        fontStyle={fontStyle}
        onToggleConsonant={toggleConsonant}
        onApplyConsonantPreset={applyConsonantPreset}
        onSelectAllConsonants={selectAllConsonants}
        onClearConsonants={clearConsonants}
      />

      <VowelSelectionSection
        selectedVowelIds={selectedVowelIds}
        vowelPresetTriggerLabel={vowelPresetTriggerLabel}
        fontStyle={fontStyle}
        onToggleVowel={toggleVowel}
        onApplyVowelPreset={applyVowelPreset}
        onSelectAllVowels={selectAllVowels}
        onClearVowels={clearVowels}
      />
    </section>
  )
}
