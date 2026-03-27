export interface ThaiVowel {
  id: string
  char: string
}

export interface ThaiVowelPreset {
  id: 'SHORT' | 'LONG' | 'MONOPHTHONGS' | 'DIPHTHONGS' | 'FORM_CHANGING'
  shortLabel: string
  fullLabel: string
  vowelIds: string[]
}

const PREPOSED_VOWELS = new Set(['เ', 'แ', 'โ', 'ใ', 'ไ'])
const UPPER_VOWEL_MARKS = new Set(['ั', 'ิ', 'ี', 'ึ', 'ื'])
const LOWER_VOWEL_MARKS = new Set(['ุ', 'ู'])

export interface VowelDisplayParts {
  prefix: string
  upper: string
  lower: string
  suffix: string
}

export function splitVowelForDisplay(char: string): VowelDisplayParts {
  const parts = Array.from(char)
  let prefixLength = 0

  while (prefixLength < parts.length && PREPOSED_VOWELS.has(parts[prefixLength])) {
    prefixLength += 1
  }

  let upper = ''
  let lower = ''
  let suffix = ''

  for (const part of parts.slice(prefixLength)) {
    if (part === 'ำ') {
      upper += 'ํ'
      suffix += 'า'
      continue
    }

    if (UPPER_VOWEL_MARKS.has(part)) {
      upper += part
      continue
    }

    if (LOWER_VOWEL_MARKS.has(part)) {
      lower += part
      continue
    }

    suffix += part
  }

  return {
    prefix: parts.slice(0, prefixLength).join(''),
    upper,
    lower,
    suffix,
  }
}

export function formatVowelWithPlaceholder(char: string): string {
  const { prefix, upper, lower, suffix } = splitVowelForDisplay(char)
  return `${prefix}อ${upper}${lower}${suffix}`
}

/**
 * Thai vowel symbols (traditional set). PRD ~32; includes
 * core vowels and common compound forms for practice.
 */
export const THAI_VOWELS: ThaiVowel[] = [
  { id: 'ะ', char: 'ะ' },
  { id: 'ั', char: 'ั' },
  { id: 'า', char: 'า' },
  { id: 'ำ', char: 'ำ' },
  { id: 'ิ', char: 'ิ' },
  { id: 'ี', char: 'ี' },
  { id: 'ึ', char: 'ึ' },
  { id: 'ื', char: 'ื' },
  { id: 'ุ', char: 'ุ' },
  { id: 'ู', char: 'ู' },
  { id: 'เ', char: 'เ' },
  { id: 'แ', char: 'แ' },
  { id: 'โ', char: 'โ' },
  { id: 'ใ', char: 'ใ' },
  { id: 'ไ', char: 'ไ' },
  { id: 'ฤ', char: 'ฤ' },
  { id: 'ฤๅ', char: 'ฤๅ' },
  { id: 'ฦ', char: 'ฦ' },
  { id: 'ฦๅ', char: 'ฦๅ' },
  { id: 'เีย', char: 'เีย' },
  { id: 'ือ', char: 'ือ' },
  { id: 'ัว', char: 'ัว' },
  { id: 'ัวะ', char: 'ัวะ' },
  { id: 'เาะ', char: 'เาะ' },
  { id: 'ียว', char: 'ียว' },
  { id: 'ัะ', char: 'ัะ' },
  { id: 'เียะ', char: 'เียะ' },
  { id: 'ือะ', char: 'ือะ' },
]

export const THAI_VOWEL_PRESETS: ThaiVowelPreset[] = [
  {
    id: 'SHORT',
    shortLabel: 'Short Vowels',
    fullLabel: 'Short-duration vowel forms',
    vowelIds: ['ะ', 'ั', 'ิ', 'ึ', 'ุ', 'เาะ', 'ัวะ', 'ัะ', 'เียะ', 'ือะ'],
  },
  {
    id: 'LONG',
    shortLabel: 'Long Vowels',
    fullLabel: 'Long-duration vowel forms',
    vowelIds: ['า', 'ำ', 'ี', 'ื', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ', 'ฤๅ', 'ฦๅ', 'เีย', 'ือ', 'ัว', 'ียว'],
  },
  {
    id: 'MONOPHTHONGS',
    shortLabel: 'Monophthongs',
    fullLabel: 'Simple vowel sounds with one mouth position',
    vowelIds: ['ะ', 'ั', 'า', 'ำ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ', 'ฤ', 'ฤๅ', 'ฦ', 'ฦๅ'],
  },
  {
    id: 'DIPHTHONGS',
    shortLabel: 'Diphthongs',
    fullLabel: 'Compound vowel sounds',
    vowelIds: ['เีย', 'ือ', 'ัว', 'ัวะ', 'เียะ', 'ือะ', 'ียว'],
  },
  {
    id: 'FORM_CHANGING',
    shortLabel: 'Form-Changing',
    fullLabel: 'Vowels that commonly shift shape in closed syllables',
    vowelIds: ['ะ', 'ั', 'ำ', 'เาะ', 'ัวะ', 'ัะ', 'เียะ', 'ือะ'],
  },
]

export function getVowelPresetById(id: ThaiVowelPreset['id']) {
  return THAI_VOWEL_PRESETS.find((preset) => preset.id === id)
}

export function getVowelPresetTriggerLabel(selectedVowelIds: string[]): string {
  if (selectedVowelIds.length === 0) return 'Presets'

  const selectedSet = new Set(selectedVowelIds)
  const exactMatch = THAI_VOWEL_PRESETS.find(
    (preset) =>
      preset.vowelIds.length === selectedSet.size &&
      preset.vowelIds.every((id) => selectedSet.has(id))
  )

  return exactMatch?.shortLabel ?? 'Custom'
}
