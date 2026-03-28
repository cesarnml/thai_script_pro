import { describe, it, expect } from 'vitest'
import {
  CONSONANT_GROUP_COLOR_CLASSES,
  THAI_CONSONANTS,
  THAI_CONSONANT_PRESETS,
  getConsonantPresetByConsonantId,
} from '@/data/consonants'

describe('THAI_CONSONANTS', () => {
  it('has exactly 44 consonants', () => {
    expect(THAI_CONSONANTS).toHaveLength(44)
  })

  it('each item has id, char, and optional name', () => {
    for (const item of THAI_CONSONANTS) {
      expect(item).toHaveProperty('id')
      expect(typeof item.id).toBe('string')
      expect(item.id.length).toBeGreaterThan(0)
      expect(item).toHaveProperty('char')
      expect(typeof item.char).toBe('string')
      expect(item.char.length).toBeGreaterThan(0)
      if (item.name !== undefined) {
        expect(typeof item.name).toBe('string')
      }
    }
  })

  it('ids are unique', () => {
    const ids = THAI_CONSONANTS.map((c) => c.id)
    const set = new Set(ids)
    expect(set.size).toBe(ids.length)
  })

  it('defines the four consonant presets with valid memberships', () => {
    const consonantIds = new Set(
      THAI_CONSONANTS.map((consonant) => consonant.id),
    )

    expect(THAI_CONSONANT_PRESETS.map((preset) => preset.id)).toEqual([
      'LCG1',
      'LCG2',
      'MC',
      'HC',
    ])

    for (const preset of THAI_CONSONANT_PRESETS) {
      expect(preset.shortLabel.length).toBeGreaterThan(0)
      expect(preset.fullLabel.length).toBeGreaterThan(0)
      expect(preset.colorKey in CONSONANT_GROUP_COLOR_CLASSES).toBe(true)
      expect(preset.consonantIds.length).toBeGreaterThan(0)
      preset.consonantIds.forEach((id) =>
        expect(consonantIds.has(id)).toBe(true),
      )
    }
  })

  it('maps every consonant to exactly one color-backed preset', () => {
    for (const consonant of THAI_CONSONANTS) {
      const preset = getConsonantPresetByConsonantId(consonant.id)
      expect(preset).toBeDefined()
      if (!preset)
        throw new Error(`Expected preset for consonant ${consonant.id}`)
      expect(preset.colorKey in CONSONANT_GROUP_COLOR_CLASSES).toBe(true)
    }
  })
})
