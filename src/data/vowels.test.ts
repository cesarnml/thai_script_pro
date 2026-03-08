import { describe, it, expect } from 'vitest'
import { THAI_VOWELS } from './vowels'

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
})
