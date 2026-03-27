import { describe, it, expect } from 'vitest'
import {
  THAI_VOWELS,
  THAI_VOWEL_PRESETS,
  formatVowelWithPlaceholder,
  splitVowelForDisplay,
} from './vowels'

describe('THAI_VOWELS', () => {
  it('has at least 28 vowels (PRD: ~32; exact TBD)', () => {
    expect(THAI_VOWELS.length).toBeGreaterThanOrEqual(28)
    expect(THAI_VOWELS.length).toBeLessThanOrEqual(40)
  })

  it('each item has id and char', () => {
    for (const item of THAI_VOWELS) {
      expect(item).toHaveProperty('id')
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(item).toHaveProperty('char')
      expect(typeof item.char).toBe('string')
      expect(item.char.length).toBeGreaterThan(0)
    }
  })

  it('ids are unique', () => {
    const ids = THAI_VOWELS.map((v) => v.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('defines vowel presets with valid memberships', () => {
    const vowelIds = new Set(THAI_VOWELS.map((vowel) => vowel.id))

    expect(THAI_VOWEL_PRESETS.map((preset) => preset.id)).toEqual([
      'SHORT',
      'LONG',
      'MONOPHTHONGS',
      'DIPHTHONGS',
      'FORM_CHANGING',
    ])

    for (const preset of THAI_VOWEL_PRESETS) {
      expect(preset.shortLabel.length).toBeGreaterThan(0)
      expect(preset.fullLabel.length).toBeGreaterThan(0)
      expect(preset.vowelIds.length).toBeGreaterThan(0)
      preset.vowelIds.forEach((id) => expect(vowelIds.has(id)).toBe(true))
    }
  })

  it('formats vowels with a placeholder อ', () => {
    expect(formatVowelWithPlaceholder('า')).toBe('อา')
    expect(formatVowelWithPlaceholder('เ')).toBe('เอ')
    expect(formatVowelWithPlaceholder('ำ')).toBe('อํา')
    expect(formatVowelWithPlaceholder('เีย')).toBe('เอีย')
  })

  it('splits vowels into display parts around the placeholder', () => {
    expect(splitVowelForDisplay('เีย')).toEqual({
      prefix: 'เ',
      upper: 'ี',
      lower: '',
      suffix: 'ย',
    })
    expect(splitVowelForDisplay('ุ')).toEqual({
      prefix: '',
      upper: '',
      lower: 'ุ',
      suffix: '',
    })
    expect(splitVowelForDisplay('ำ')).toEqual({
      prefix: '',
      upper: 'ํ',
      lower: '',
      suffix: 'า',
    })
  })
})
