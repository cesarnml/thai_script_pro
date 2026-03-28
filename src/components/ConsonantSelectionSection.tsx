import type { CSSProperties } from 'react'
import {
  CONSONANT_GROUP_COLOR_CLASSES,
  THAI_CONSONANTS,
  THAI_CONSONANT_PRESETS,
  getConsonantPresetByConsonantId,
  type ThaiConsonantPreset,
} from '@/data/consonants'
import { ContentSelectionSection } from './ContentSelectionSection'
import { PresetMenu } from './PresetMenu'

interface ConsonantSelectionSectionProps {
  selectedConsonantIds: string[]
  consonantPresetTriggerLabel: string
  exactConsonantPreset?: ThaiConsonantPreset
  fontStyle?: CSSProperties
  onToggleConsonant: (id: string) => void
  onApplyConsonantPreset: (id: ThaiConsonantPreset['id']) => void
  onSelectAllConsonants: () => void
  onClearConsonants: () => void
}

export function ConsonantSelectionSection({
  selectedConsonantIds,
  consonantPresetTriggerLabel,
  exactConsonantPreset,
  fontStyle,
  onToggleConsonant,
  onApplyConsonantPreset,
  onSelectAllConsonants,
  onClearConsonants,
}: ConsonantSelectionSectionProps) {
  const consonantSet = new Set(selectedConsonantIds)
  const consonantTriggerClasses = exactConsonantPreset
    ? CONSONANT_GROUP_COLOR_CLASSES[exactConsonantPreset.colorKey].trigger
    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'

  return (
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
            const colorClasses = CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]
            return `flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition-colors ${
              isSelected ? colorClasses.rowActive : colorClasses.rowIdle
            }`
          }}
          renderOptionContent={(preset, isSelected) => {
            const colorClasses = CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]

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
            onApplyConsonantPreset(preset.id)
          }}
        />
      }
      selectAllAriaLabel="Select all consonants"
      clearAriaLabel="Clear consonants"
      onSelectAll={onSelectAllConsonants}
      onClear={onClearConsonants}
    >
      <div
        className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(55px,1fr))] md:[grid-template-columns:repeat(10,minmax(0,1fr))]"
        data-consonant-grid="true"
      >
        {THAI_CONSONANTS.map((consonant) => {
          const preset = getConsonantPresetByConsonantId(consonant.id)
          const colorClasses = preset
            ? CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]
            : undefined

          return (
            <button
              key={consonant.id}
              type="button"
              onClick={() => onToggleConsonant(consonant.id)}
              aria-pressed={consonantSet.has(consonant.id)}
              style={fontStyle}
              className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-colors ${
                colorClasses
                  ? consonantSet.has(consonant.id)
                    ? colorClasses.tileActive
                    : colorClasses.tileIdle
                  : consonantSet.has(consonant.id)
                    ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span
                className="text-2xl leading-tight"
                translate="no"
                lang="th"
              >
                {consonant.char}
              </span>
              {consonant.name && (
                <span
                  className={`text-[10px] mt-0.5 truncate max-w-full ${
                    colorClasses ? colorClasses.tileMeta : 'text-gray-400'
                  }`}
                  translate="no"
                  lang="th"
                >
                  {consonant.name}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </ContentSelectionSection>
  )
}
