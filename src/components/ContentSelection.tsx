import { useContentSelection } from '@/hooks/useContentSelection'
import {
  CONSONANT_GROUP_COLOR_CLASSES,
  THAI_CONSONANTS,
  THAI_CONSONANT_PRESETS,
  getConsonantExactMatchPreset,
  getConsonantPresetByConsonantId,
  getConsonantPresetTriggerLabel,
  type ThaiConsonantPreset,
} from '@/data/consonants'
import {
  THAI_VOWELS,
  THAI_VOWEL_PRESETS,
  formatVowelWithPlaceholder,
  getVowelPresetTriggerLabel,
  type ThaiVowelPreset,
} from '@/data/vowels'
import { VowelDisplay } from './VowelDisplay'
import { PresetMenu } from './PresetMenu'
import { ContentSelectionSection } from './ContentSelectionSection'

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

  const consonantSet = new Set(selectedConsonantIds)
  const vowelSet = new Set(selectedVowelIds)
  const consonantPresetTriggerLabel =
    getConsonantPresetTriggerLabel(selectedConsonantIds)
  const exactConsonantPreset =
    getConsonantExactMatchPreset(selectedConsonantIds)
  const vowelPresetTriggerLabel = getVowelPresetTriggerLabel(selectedVowelIds)

  const consonantTriggerClasses = exactConsonantPreset
    ? CONSONANT_GROUP_COLOR_CLASSES[exactConsonantPreset.colorKey].trigger
    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'

  return (
    <section className="space-y-6" aria-label="Content selection">
      <p className="sr-only" role="status">
        {selectedConsonantIds.length} consonants, {selectedVowelIds.length}{' '}
        vowels selected
      </p>

      <ContentSelectionSection
        title="Select Consonants"
        countSummary={`${consonantSet.size} of ${THAI_CONSONANTS.length} selected`}
        presetMenu={
          <PresetMenu
            triggerAriaLabel="Consonant presets"
            listboxAriaLabel="Consonant preset options"
            triggerLabel={consonantPresetTriggerLabel}
            triggerTitle={
              consonantPresetTriggerLabel === 'Custom'
                ? 'Custom selection'
                : consonantPresetTriggerLabel
            }
            triggerClassName={`inline-flex min-w-32 items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${consonantTriggerClasses}`}
            items={THAI_CONSONANT_PRESETS}
            getItemKey={(preset) => preset.id}
            isItemSelected={(preset) =>
              preset.consonantIds.every((id) => consonantSet.has(id))
            }
            getItemTitle={(preset) => preset.fullLabel}
            getOptionClassName={(preset, isSelected) => {
              const colorClasses =
                CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]
              return `flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                isSelected ? colorClasses.rowActive : colorClasses.rowIdle
              }`
            }}
            renderOptionContent={(preset, isSelected) => {
              const colorClasses =
                CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]

              return (
                <>
                  <span>
                    <span className="block text-sm font-semibold">
                      {preset.shortLabel}
                    </span>
                    <span className={`block text-xs ${colorClasses.rowMeta}`}>
                      {preset.fullLabel}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 text-xs ${isSelected ? colorClasses.check : 'text-gray-300'}`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </>
              )
            }}
            onSelect={(preset) => {
              applyConsonantPreset(preset.id)
            }}
          />
        }
        selectAllAriaLabel="Select all consonants"
        clearAriaLabel="Clear consonants"
        onSelectAll={selectAllConsonants}
        onClear={clearConsonants}
      >
        <div
          className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(55px,1fr))] md:[grid-template-columns:repeat(10,minmax(0,1fr))]"
          data-consonant-grid="true"
        >
          {THAI_CONSONANTS.map((c) => {
            const preset = getConsonantPresetByConsonantId(c.id)
            const colorClasses = preset
              ? CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]
              : undefined

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleConsonant(c.id)}
                aria-pressed={consonantSet.has(c.id)}
                style={fontStyle}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-colors ${
                  colorClasses
                    ? consonantSet.has(c.id)
                      ? colorClasses.tileActive
                      : colorClasses.tileIdle
                    : consonantSet.has(c.id)
                      ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span
                  className="text-2xl leading-tight"
                  translate="no"
                  lang="th"
                >
                  {c.char}
                </span>
                {c.name && (
                  <span
                    className={`text-[10px] mt-0.5 truncate max-w-full ${
                      colorClasses ? colorClasses.tileMeta : 'text-gray-400'
                    }`}
                    translate="no"
                    lang="th"
                  >
                    {c.name}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </ContentSelectionSection>

      <ContentSelectionSection
        title="Select Vowels"
        countSummary={`${vowelSet.size} of ${THAI_VOWELS.length} selected`}
        presetMenu={
          <PresetMenu
            triggerAriaLabel="Vowel presets"
            listboxAriaLabel="Vowel preset options"
            triggerLabel={vowelPresetTriggerLabel}
            triggerTitle={
              vowelPresetTriggerLabel === 'Custom'
                ? 'Custom selection'
                : vowelPresetTriggerLabel
            }
            triggerClassName="inline-flex min-w-32 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            items={THAI_VOWEL_PRESETS}
            getItemKey={(preset) => preset.id}
            isItemSelected={(preset) =>
              preset.vowelIds.every((id) => vowelSet.has(id))
            }
            getItemTitle={(preset) => preset.fullLabel}
            getOptionClassName={(_, isSelected) =>
              `flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                isSelected
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
            renderOptionContent={(preset, isSelected) => (
              <>
                <span>
                  <span className="block text-sm font-semibold">
                    {preset.shortLabel}
                  </span>
                  <span className="block text-xs text-gray-400">
                    {preset.fullLabel}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 text-xs ${isSelected ? 'text-indigo-500' : 'text-gray-300'}`}
                >
                  {isSelected ? '✓' : ''}
                </span>
              </>
            )}
            onSelect={(preset) => {
              applyVowelPreset(preset.id)
            }}
          />
        }
        selectAllAriaLabel="Select all vowels"
        clearAriaLabel="Clear vowels"
        onSelectAll={selectAllVowels}
        onClear={clearVowels}
      >
        <div
          className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr))] md:[grid-template-columns:repeat(10,minmax(0,1fr))]"
          data-vowel-grid="true"
        >
          {THAI_VOWELS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => toggleVowel(v.id)}
              aria-label={formatVowelWithPlaceholder(v.char)}
              aria-pressed={vowelSet.has(v.id)}
              style={fontStyle}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-colors ${
                vowelSet.has(v.id)
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <VowelDisplay char={v.char} className="text-2xl leading-tight" />
            </button>
          ))}
        </div>
      </ContentSelectionSection>
    </section>
  )
}
