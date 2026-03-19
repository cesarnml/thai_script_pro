import { describe, it, expect, vi } from 'vitest'
import { THAI_CONSONANTS } from '../data/consonants'
import { DEFAULT_SHEET_CONFIG, type SheetConfig } from '../data/sheetOptions'
import {
  buildPracticePdf,
  getGhostTextColor,
  type PdfDocLike,
} from './downloadPracticePdf'

type TextRecord = {
  text: string
  x: number
  y: number
  options?: Record<string, unknown>
  fontName: string
  fontSize: number
  color: [number, number, number]
}

type LineRecord = {
  x1: number
  y1: number
  x2: number
  y2: number
  color: [number, number, number]
  dash: number[]
}

function createMockDoc(pageHeight = 841.89) {
  let currentFontName = 'unset'
  let currentFontSize = 0
  let currentTextColor: [number, number, number] = [0, 0, 0]
  let currentDrawColor: [number, number, number] = [0, 0, 0]
  let currentDash: number[] = []

  const textRecords: TextRecord[] = []
  const lineRecords: LineRecord[] = []

  const doc: PdfDocLike = {
    internal: {
      pageSize: {
        getWidth: () => 595.28,
        getHeight: () => pageHeight,
      },
    },
    addFileToVFS: vi.fn(),
    addFont: vi.fn(),
    addPage: vi.fn(),
    line: vi.fn((x1, y1, x2, y2) => {
      lineRecords.push({
        x1,
        y1,
        x2,
        y2,
        color: currentDrawColor,
        dash: [...currentDash],
      })
    }),
    rect: vi.fn(),
    save: vi.fn(),
    setDrawColor: vi.fn((r, g, b) => {
      currentDrawColor = [r, g, b]
    }),
    setFont: vi.fn((fontName) => {
      currentFontName = fontName
    }),
    setFontSize: vi.fn((size) => {
      currentFontSize = size
    }),
    setLineDashPattern: vi.fn((dashArray) => {
      currentDash = [...dashArray]
    }),
    setLineWidth: vi.fn(),
    setTextColor: vi.fn((r, g, b) => {
      currentTextColor = [r, g, b]
    }),
    text: vi.fn((text, x, y, options) => {
      textRecords.push({
        text,
        x,
        y,
        options,
        fontName: currentFontName,
        fontSize: currentFontSize,
        color: currentTextColor,
      })
    }),
  }

  return { doc, textRecords, lineRecords }
}

describe('buildPracticePdf', () => {
  const firstConsonant = THAI_CONSONANTS[0]

  it('maps the selected font to embedded PDF font names', () => {
    const { doc, textRecords } = createMockDoc()
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      font: 'modern',
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 1,
    }

    buildPracticePdf(doc, {
      selectedConsonantIds: [firstConsonant.id],
      selectedVowelIds: [],
      config,
    })

    expect(textRecords.some((record) => record.fontName === 'Prompt-SemiBold')).toBe(true)
    expect(textRecords.some((record) => record.fontName === 'Prompt-Regular')).toBe(true)
  })

  it('draws model glyphs centered with a middle baseline at the cell midpoint', () => {
    const { doc, textRecords } = createMockDoc()
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 1,
    }

    buildPracticePdf(doc, {
      selectedConsonantIds: [firstConsonant.id],
      selectedVowelIds: [],
      config,
    })

    const glyphFontSize =
      (DEFAULT_SHEET_CONFIG.fontSize === 'medium' ? 36 : 36) * 0.75
    const cellSize = 76 * 0.75
    const expectedGlyphY = 96 + 24 + 8 + cellSize / 2
    const modelGlyph = textRecords.find(
      (record) =>
        record.text === firstConsonant.char &&
        record.fontName === 'Sarabun-SemiBold' &&
        record.options?.align === 'center' &&
        record.options?.baseline === 'middle'
    )

    expect(modelGlyph).toBeDefined()
    expect(modelGlyph?.fontSize).toBe(glyphFontSize)
    expect(modelGlyph?.y).toBe(expectedGlyphY)
  })

  it('draws the correct guide line counts for each grid guide mode', () => {
    const runGuideTest = (gridGuide: SheetConfig['gridGuide']) => {
      const { doc, lineRecords } = createMockDoc()

      buildPracticePdf(doc, {
        selectedConsonantIds: [firstConsonant.id],
        selectedVowelIds: [],
        config: {
          ...DEFAULT_SHEET_CONFIG,
          rowsPerCharacter: 1,
          columns: 1,
          ghostCopiesPerRow: 0,
          gridGuide,
        },
      })

      return lineRecords
    }

    const thaiLines = runGuideTest('thai')
    expect(thaiLines).toHaveLength(3)
    expect(thaiLines.every((line) => line.color.join(',') === '200,230,201')).toBe(true)

    const crossLines = runGuideTest('cross')
    expect(crossLines).toHaveLength(2)
    expect(crossLines.every((line) => line.color.join(',') === '224,224,224')).toBe(true)

    const sandwichLines = runGuideTest('sandwich')
    expect(sandwichLines).toHaveLength(2)
    expect(sandwichLines.every((line) => line.color.join(',') === '224,224,224')).toBe(true)
  })

  it('uses preblended ghost colors that follow the existing opacity progression', () => {
    const { doc, textRecords } = createMockDoc()

    buildPracticePdf(doc, {
      selectedConsonantIds: [firstConsonant.id],
      selectedVowelIds: [],
      config: {
        ...DEFAULT_SHEET_CONFIG,
        rowsPerCharacter: 1,
        columns: 5,
        ghostCopiesPerRow: 3,
      },
    })

    const ghostGlyphs = textRecords.filter(
      (record) =>
        record.text === firstConsonant.char &&
        record.fontName === 'Sarabun-Regular' &&
        record.options?.align === 'center' &&
        record.options?.baseline === 'middle'
    )

    expect(ghostGlyphs).toHaveLength(3)
    expect(ghostGlyphs.map((record) => record.color)).toEqual([
      getGhostTextColor(0, 3),
      getGhostTextColor(1, 3),
      getGhostTextColor(2, 3),
    ])
  })

  it('adds a new page before a block that does not fit in the remaining space', () => {
    const { doc } = createMockDoc(360)

    buildPracticePdf(doc, {
      selectedConsonantIds: [THAI_CONSONANTS[0].id, THAI_CONSONANTS[1].id],
      selectedVowelIds: [],
      config: {
        ...DEFAULT_SHEET_CONFIG,
        rowsPerCharacter: 3,
        columns: 8,
        ghostCopiesPerRow: 2,
      },
    })

    expect(doc.addPage).toHaveBeenCalledTimes(2)
  })

  it('uses the larger cell midpoint for large font glyph placement', () => {
    const { doc, textRecords } = createMockDoc()
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'large',
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 1,
    }

    buildPracticePdf(doc, {
      selectedConsonantIds: [firstConsonant.id],
      selectedVowelIds: [],
      config,
    })

    const largeCellSize = 100 * 0.75
    const expectedGlyphY = 96 + 24 + 8 + largeCellSize / 2
    const modelGlyph = textRecords.find(
      (record) =>
        record.text === firstConsonant.char &&
        record.fontName === 'Sarabun-SemiBold' &&
        record.options?.align === 'center' &&
        record.options?.baseline === 'middle'
    )

    expect(modelGlyph).toBeDefined()
    expect(modelGlyph?.y).toBe(expectedGlyphY)
  })
})
