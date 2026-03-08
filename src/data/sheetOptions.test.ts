import { describe, it, expect } from 'vitest'
import {
  GRID_GUIDE_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  PAPER_SIZE_OPTIONS,
  DEFAULT_SHEET_CONFIG,
  type SheetConfig,
} from './sheetOptions'

describe('GRID_GUIDE_OPTIONS', () => {
  it('has exactly 3 options (Cross, Sandwich, Thai)', () => {
    expect(GRID_GUIDE_OPTIONS).toHaveLength(3)
    const labels = GRID_GUIDE_OPTIONS.map((o) => o.label)
    expect(labels).toContain('Cross (horizontal + vertical)')
    expect(labels).toContain('Sandwich (top & bottom)')
    expect(labels).toContain('Thai (3 lines)')
  })

  it('each option has id and label', () => {
    for (const opt of GRID_GUIDE_OPTIONS) {
      expect(opt).toHaveProperty('id')
      expect(opt).toHaveProperty('label')
    }
  })
})

describe('FONT_OPTIONS', () => {
  it('has 5 font options', () => {
    expect(FONT_OPTIONS).toHaveLength(5)
  })

  it('includes Noto Serif Thai as default', () => {
    const notoSerif = FONT_OPTIONS.find((f) => f.label.includes('Noto Serif Thai'))
    expect(notoSerif).toBeDefined()
    expect(notoSerif?.isDefault).toBe(true)
  })

  it('includes Noto Sans Thai, Noto Sans Thai Looped, Mali, Playpen Sans Thai', () => {
    const labels = FONT_OPTIONS.map((f) => f.label)
    expect(labels.some((l) => l.includes('Noto Sans Thai'))).toBe(true)
    expect(labels.some((l) => l.includes('Mali'))).toBe(true)
    expect(labels.some((l) => l.includes('Playpen'))).toBe(true)
  })
})

describe('FONT_SIZE_OPTIONS', () => {
  it('has at least 3 options (e.g. Small, Medium, Large)', () => {
    expect(FONT_SIZE_OPTIONS.length).toBeGreaterThanOrEqual(3)
  })

  it('each has id and label', () => {
    for (const opt of FONT_SIZE_OPTIONS) {
      expect(opt).toHaveProperty('id')
      expect(opt).toHaveProperty('label')
    }
  })
})

describe('PAPER_SIZE_OPTIONS', () => {
  it('includes A4 and Letter', () => {
    const ids = PAPER_SIZE_OPTIONS.map((o) => o.id)
    expect(ids).toContain('a4')
    expect(ids).toContain('letter')
  })

  it('each has id and label', () => {
    for (const opt of PAPER_SIZE_OPTIONS) {
      expect(opt).toHaveProperty('id')
      expect(opt).toHaveProperty('label')
    }
  })
})

describe('DEFAULT_SHEET_CONFIG', () => {
  it('matches SheetConfig shape', () => {
    const c = DEFAULT_SHEET_CONFIG as SheetConfig
    expect(c).toHaveProperty('rowsPerCharacter')
    expect(c).toHaveProperty('ghostCopiesPerRow')
    expect(c).toHaveProperty('paperSize')
    expect(c).toHaveProperty('gridGuide')
    expect(c).toHaveProperty('font')
    expect(c).toHaveProperty('fontSize')
  })

  it('has sensible defaults (e.g. 2 rows, 3 ghost copies)', () => {
    expect(DEFAULT_SHEET_CONFIG.rowsPerCharacter).toBeGreaterThanOrEqual(1)
    expect(DEFAULT_SHEET_CONFIG.ghostCopiesPerRow).toBeGreaterThanOrEqual(1)
  })

  it('uses default font (Noto Serif Thai)', () => {
    const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)
    expect(defaultFont).toBeDefined()
    expect(DEFAULT_SHEET_CONFIG.font).toBe(defaultFont!.id)
  })
})
