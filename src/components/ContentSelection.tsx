import { useEffect, useId, useRef, useState } from 'react'
import { useContentSelection } from '../hooks/useContentSelection'
import {
  CONSONANT_GROUP_COLOR_CLASSES,
  THAI_CONSONANTS,
  THAI_CONSONANT_PRESETS,
  getConsonantExactMatchPreset,
  getConsonantPresetByConsonantId,
  getConsonantPresetTriggerLabel,
  type ThaiConsonantPreset,
} from '../data/consonants'
import {
  THAI_VOWELS,
  THAI_VOWEL_PRESETS,
  formatVowelWithPlaceholder,
  getVowelPresetTriggerLabel,
  type ThaiVowelPreset,
} from '../data/vowels'
import { VowelDisplay } from './VowelDisplay'

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
  const [isConsonantPresetMenuOpen, setIsConsonantPresetMenuOpen] = useState(false)
  const [isVowelPresetMenuOpen, setIsVowelPresetMenuOpen] = useState(false)
  const consonantPresetMenuRef = useRef<HTMLDivElement>(null)
  const vowelPresetMenuRef = useRef<HTMLDivElement>(null)
  const consonantPresetListboxId = useId()
  const vowelPresetListboxId = useId()
  const selectedConsonantIds = props.selectedConsonantIds ?? hook.selectedConsonantIds
  const selectedVowelIds = props.selectedVowelIds ?? hook.selectedVowelIds
  const toggleConsonant = props.onToggleConsonant ?? hook.toggleConsonant
  const toggleVowel = props.onToggleVowel ?? hook.toggleVowel
  const applyConsonantPreset = props.onApplyConsonantPreset ?? hook.applyConsonantPreset
  const applyVowelPreset = props.onApplyVowelPreset ?? hook.applyVowelPreset
  const selectAllConsonants = props.onSelectAllConsonants ?? hook.selectAllConsonants
  const clearConsonants = props.onClearConsonants ?? hook.clearConsonants
  const selectAllVowels = props.onSelectAllVowels ?? hook.selectAllVowels
  const clearVowels = props.onClearVowels ?? hook.clearVowels
  const fontStyle = props.fontFamily ? { fontFamily: props.fontFamily } : undefined

  const consonantSet = new Set(selectedConsonantIds)
  const vowelSet = new Set(selectedVowelIds)
  const consonantPresetTriggerLabel = getConsonantPresetTriggerLabel(selectedConsonantIds)
  const exactConsonantPreset = getConsonantExactMatchPreset(selectedConsonantIds)
  const vowelPresetTriggerLabel = getVowelPresetTriggerLabel(selectedVowelIds)

  useEffect(() => {
    if (!isConsonantPresetMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!consonantPresetMenuRef.current?.contains(event.target as Node)) {
        setIsConsonantPresetMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsConsonantPresetMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isConsonantPresetMenuOpen])

  useEffect(() => {
    if (!isVowelPresetMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!vowelPresetMenuRef.current?.contains(event.target as Node)) {
        setIsVowelPresetMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsVowelPresetMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isVowelPresetMenuOpen])

  const consonantTriggerClasses = exactConsonantPreset
    ? CONSONANT_GROUP_COLOR_CLASSES[exactConsonantPreset.colorKey].trigger
    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'

  return (
    <section className="space-y-6" aria-label="Content selection">
      <p className="sr-only" role="status">
        {selectedConsonantIds.length} consonants, {selectedVowelIds.length} vowels selected
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-gray-900">Select Consonants</h2>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mt-1">
              {consonantSet.size} of {THAI_CONSONANTS.length} selected
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative" ref={consonantPresetMenuRef}>
              <button
                type="button"
                aria-label="Consonant presets"
                aria-haspopup="listbox"
                aria-expanded={isConsonantPresetMenuOpen}
                aria-controls={consonantPresetListboxId}
                onClick={() => setIsConsonantPresetMenuOpen((open) => !open)}
                className={`inline-flex min-w-32 items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${consonantTriggerClasses}`}
              >
                <span title={consonantPresetTriggerLabel === 'Custom' ? 'Custom selection' : consonantPresetTriggerLabel}>
                  {consonantPresetTriggerLabel}
                </span>
                <span aria-hidden="true" className="text-xs text-gray-400">
                  ▾
                </span>
              </button>

              {isConsonantPresetMenuOpen ? (
                <div
                  id={consonantPresetListboxId}
                  role="listbox"
                  aria-label="Consonant preset options"
                  aria-multiselectable="true"
                  className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                >
                  {THAI_CONSONANT_PRESETS.map((preset) => {
                    const isApplied = preset.consonantIds.every((id) => consonantSet.has(id))
                    const colorClasses = CONSONANT_GROUP_COLOR_CLASSES[preset.colorKey]

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        role="option"
                        aria-selected={isApplied}
                        title={preset.fullLabel}
                        onClick={() => {
                          applyConsonantPreset(preset.id)
                          setIsConsonantPresetMenuOpen(false)
                        }}
                        className={`flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                          isApplied ? colorClasses.rowActive : colorClasses.rowIdle
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">{preset.shortLabel}</span>
                          <span className={`block text-xs ${colorClasses.rowMeta}`}>{preset.fullLabel}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 text-xs ${isApplied ? colorClasses.check : 'text-gray-300'}`}
                        >
                          {isApplied ? '✓' : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex justify-center gap-2 md:justify-end">
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
                <span className="text-2xl leading-tight" translate="no" lang="th">
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
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold text-gray-900">Select Vowels</h2>
            <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mt-1">
              {vowelSet.size} of {THAI_VOWELS.length} selected
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative" ref={vowelPresetMenuRef}>
              <button
                type="button"
                aria-label="Vowel presets"
                aria-haspopup="listbox"
                aria-expanded={isVowelPresetMenuOpen}
                aria-controls={vowelPresetListboxId}
                onClick={() => setIsVowelPresetMenuOpen((open) => !open)}
                className="inline-flex min-w-32 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <span title={vowelPresetTriggerLabel === 'Custom' ? 'Custom selection' : vowelPresetTriggerLabel}>
                  {vowelPresetTriggerLabel}
                </span>
                <span aria-hidden="true" className="text-xs text-gray-400">
                  ▾
                </span>
              </button>

              {isVowelPresetMenuOpen ? (
                <div
                  id={vowelPresetListboxId}
                  role="listbox"
                  aria-label="Vowel preset options"
                  aria-multiselectable="true"
                  className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                >
                  {THAI_VOWEL_PRESETS.map((preset) => {
                    const isApplied = preset.vowelIds.every((id) => vowelSet.has(id))

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        role="option"
                        aria-selected={isApplied}
                        title={preset.fullLabel}
                        onClick={() => {
                          applyVowelPreset(preset.id)
                          setIsVowelPresetMenuOpen(false)
                        }}
                        className={`flex w-full items-start justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                          isApplied ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">{preset.shortLabel}</span>
                          <span className="block text-xs text-gray-400">{preset.fullLabel}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 text-xs ${isApplied ? 'text-indigo-500' : 'text-gray-300'}`}
                        >
                          {isApplied ? '✓' : ''}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex justify-center gap-2 md:justify-end">
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
      </div>
    </section>
  )
}
