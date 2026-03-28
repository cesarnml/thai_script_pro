import { describe, it, expect } from 'vitest'
import {
  COLUMNS_OPTIONS,
  GRID_GUIDE_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_MAP,
  FONT_SIZE_OPTIONS,
  GHOST_COPIES_OPTIONS,
  DEFAULT_SHEET_CONFIG,
  getSheetConfigClampNotice,
  getAllowedColumnOptions,
  getInitialColumnsForWidth,
  getMaxColumnsForFontSize,
  normalizeSheetConfig,
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

  it('derives initial columns from available width without exceeding the printable cap', () => {
    expect(getInitialColumnsForWidth('medium', 120)).toBe(3)
    expect(getInitialColumnsForWidth('medium', 500)).toBe(6)
    expect(getInitialColumnsForWidth('medium', 1200)).toBe(9)
  })

  it('normalizes columns and ghost copies to the font-size limit', () => {
    expect(
      normalizeSheetConfig({
        ...DEFAULT_SHEET_CONFIG,
        fontSize: 'large',
        columns: 12,
        ghostCopiesPerRow: 10,
      })
    ).toEqual({
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'large',
      columns: 7,
      ghostCopiesPerRow: 7,
    })
  })

  it('describes a forced column clamp after a font-size change', () => {
    const previousConfig: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'small',
      columns: 12,
      ghostCopiesPerRow: 8,
    }
    const nextConfig = normalizeSheetConfig({
      ...previousConfig,
      fontSize: 'large',
    })

    expect(getSheetConfigClampNotice(previousConfig, nextConfig)).toBe(
      'Adjusted to 7 columns so it fits on the page.'
    )
  })

  it('does not show a clamp notice when font size does not change', () => {
    const previousConfig: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'medium',
      columns: 9,
    }
    const nextConfig = normalizeSheetConfig({
      ...previousConfig,
      ghostCopiesPerRow: 12,
    })

    expect(getSheetConfigClampNotice(previousConfig, nextConfig)).toBeNull()
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

  it('has sensible defaults (3 rows, 3 columns, 3 ghost copies)', () => {
    expect(DEFAULT_SHEET_CONFIG.rowsPerCharacter).toBe(3)
    expect(DEFAULT_SHEET_CONFIG.columns).toBe(3)
    expect(DEFAULT_SHEET_CONFIG.ghostCopiesPerRow).toBeGreaterThanOrEqual(1)
  })

  it('uses default font (Traditional)', () => {
    const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)
    expect(defaultFont).toBeDefined()
    expect(DEFAULT_SHEET_CONFIG.font).toBe(defaultFont!.id)
  })
})
