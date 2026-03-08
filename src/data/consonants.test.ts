import { describe, it, expect } from 'vitest'
import { THAI_CONSONANTS } from './consonants'

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
})
