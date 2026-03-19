import { describe, it, expect } from 'vitest'
import {
  COLUMNS_OPTIONS,
  GRID_GUIDE_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_MAP,
  FONT_SIZE_OPTIONS,
  GHOST_COPIES_OPTIONS,
  DEFAULT_SHEET_CONFIG,
  getAllowedColumnOptions,
  getMaxColumnsForFontSize,
  type SheetConfig,
} from './sheetOptions'

describe('GRID_GUIDE_OPTIONS', () => {
  it('has exactly 3 options (Cross, Sandwich, Thai)', () => {
    expect(GRID_GUIDE_OPTIONS).toHaveLength(3)
    const labels = GRID_GUIDE_OPTIONS.map((o) => o.label)
    expect(labels).toContain('Cross')
    expect(labels).toContain('Sandwich')
    expect(labels).toContain('Thai')
  })

  it('each option has id and label', () => {
    for (const opt of GRID_GUIDE_OPTIONS) {
      expect(opt).toHaveProperty('id')
      expect(opt).toHaveProperty('label')
    }
  })
})

describe('FONT_OPTIONS', () => {
  it('has 3 font options', () => {
    expect(FONT_OPTIONS).toHaveLength(3)
  })

  it('includes Traditional as default', () => {
    const traditional = FONT_OPTIONS.find((f) => f.label === 'Traditional')
    expect(traditional).toBeDefined()
    expect(traditional?.isDefault).toBe(true)
  })

  it('includes Traditional, Modern, and Cursive', () => {
    const labels = FONT_OPTIONS.map((f) => f.label)
    expect(labels).toEqual(['Traditional', 'Modern', 'Cursive'])
  })
})

describe('FONT_SIZE_OPTIONS', () => {
  it('has exactly 3 simplified labels', () => {
    expect(FONT_SIZE_OPTIONS).toHaveLength(3)
    expect(FONT_SIZE_OPTIONS.map((option) => option.label)).toEqual([
      'Small',
      'Medium',
      'Large',
    ])
  })

  it('each has id and label', () => {
    for (const opt of FONT_SIZE_OPTIONS) {
      expect(opt).toHaveProperty('id')
      expect(opt).toHaveProperty('label')
    }
  })
})

describe('FONT_SIZE_MAP', () => {
  it('gives each size enough cell room for the current glyph widths', () => {
    expect(FONT_SIZE_MAP.small).toEqual({ text: 24, cellPx: 56 })
    expect(FONT_SIZE_MAP.medium).toEqual({ text: 36, cellPx: 76 })
    expect(FONT_SIZE_MAP.large).toEqual({ text: 48, cellPx: 100 })
  })
})

describe('COLUMNS_OPTIONS', () => {
  it('includes columns 3 through 12', () => {
    const values = COLUMNS_OPTIONS.map((o) => o.value)
    expect(values).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })

  it('each has value and label', () => {
    for (const opt of COLUMNS_OPTIONS) {
      expect(opt).toHaveProperty('value')
      expect(opt).toHaveProperty('label')
    }
  })

  it('derives the max allowed columns from printable width for each font size', () => {
    expect(getMaxColumnsForFontSize('small')).toBe(12)
    expect(getMaxColumnsForFontSize('medium')).toBe(9)
    expect(getMaxColumnsForFontSize('large')).toBe(7)
  })

  it('filters the rendered column options to the allowed max', () => {
    expect(getAllowedColumnOptions('small').map((option) => option.value)).toEqual([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
    expect(getAllowedColumnOptions('medium').map((option) => option.value)).toEqual([
      3, 4, 5, 6, 7, 8, 9,
    ])
    expect(getAllowedColumnOptions('large').map((option) => option.value)).toEqual([
      3, 4, 5, 6, 7,
    ])
  })
})

describe('GHOST_COPIES_OPTIONS', () => {
  it('supports up to 10 copies', () => {
    const last = GHOST_COPIES_OPTIONS[GHOST_COPIES_OPTIONS.length - 1]
    expect(last?.value).toBe(10)
  })
})

describe('DEFAULT_SHEET_CONFIG', () => {
  it('matches SheetConfig shape', () => {
    const c = DEFAULT_SHEET_CONFIG as SheetConfig
    expect(c).toHaveProperty('rowsPerCharacter')
    expect(c).toHaveProperty('columns')
    expect(c).toHaveProperty('ghostCopiesPerRow')
    expect(c).toHaveProperty('gridGuide')
    expect(c).toHaveProperty('font')
    expect(c).toHaveProperty('fontSize')
  })

  it('has sensible defaults (3 rows, 8 columns, 3 ghost copies)', () => {
    expect(DEFAULT_SHEET_CONFIG.rowsPerCharacter).toBe(3)
    expect(DEFAULT_SHEET_CONFIG.columns).toBe(8)
    expect(DEFAULT_SHEET_CONFIG.ghostCopiesPerRow).toBeGreaterThanOrEqual(1)
  })

  it('uses default font (Traditional)', () => {
    const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)
    expect(defaultFont).toBeDefined()
    expect(DEFAULT_SHEET_CONFIG.font).toBe(defaultFont!.id)
  })
})
