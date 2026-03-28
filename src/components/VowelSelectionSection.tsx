import type { CSSProperties } from 'react'
import {
  THAI_VOWELS,
  THAI_VOWEL_PRESETS,
  formatVowelWithPlaceholder,
  type ThaiVowelPreset,
} from '@/data/vowels'
import { ContentSelectionSection } from './ContentSelectionSection'
import { PresetMenu } from './PresetMenu'
import { VowelDisplay } from './VowelDisplay'

interface VowelSelectionSectionProps {
  selectedVowelIds: string[]
  vowelPresetTriggerLabel: string
  fontStyle?: CSSProperties
  onToggleVowel: (id: string) => void
  onApplyVowelPreset: (id: ThaiVowelPreset['id']) => void
  onSelectAllVowels: () => void
  onClearVowels: () => void
}

export function VowelSelectionSection({
  selectedVowelIds,
  vowelPresetTriggerLabel,
  fontStyle,
  onToggleVowel,
  onApplyVowelPreset,
  onSelectAllVowels,
  onClearVowels,
}: VowelSelectionSectionProps) {
  const vowelSet = new Set(selectedVowelIds)

  return (
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
            onApplyVowelPreset(preset.id)
          }}
        />
      }
      selectAllAriaLabel="Select all vowels"
      clearAriaLabel="Clear vowels"
      onSelectAll={onSelectAllVowels}
      onClear={onClearVowels}
    >
      <div
        className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr))] md:[grid-template-columns:repeat(10,minmax(0,1fr))]"
        data-vowel-grid="true"
      >
        {THAI_VOWELS.map((vowel) => (
          <button
            key={vowel.id}
            type="button"
            onClick={() => onToggleVowel(vowel.id)}
            aria-label={formatVowelWithPlaceholder(vowel.char)}
            aria-pressed={vowelSet.has(vowel.id)}
            style={fontStyle}
            className={`flex flex-col items-center py-2.5 px-1 rounded-xl border transition-colors ${
              vowelSet.has(vowel.id)
                ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <VowelDisplay
              char={vowel.char}
              className="text-2xl leading-tight"
            />
          </button>
        ))}
      </div>
    </ContentSelectionSection>
  )
}
