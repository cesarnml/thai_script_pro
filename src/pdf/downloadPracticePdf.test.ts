import { describe, it, expect, vi } from 'vitest'
import { THAI_CONSONANTS } from '../data/consonants'
import { DEFAULT_SHEET_CONFIG, type SheetConfig } from '../data/sheetOptions'
import type { DownloadPracticePdfArgs } from './downloadPracticePdf'
import {
  buildPracticePdf,
  downloadPracticePdf,
  getGhostTextColor,
  type PdfDocLike,
} from './downloadPracticePdf'

const { jsPDFConstructorMock } = vi.hoisted(() => ({
  jsPDFConstructorMock: vi.fn(),
}))

vi.mock('jspdf', () => ({
  jsPDF: jsPDFConstructorMock,
}))

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
    output: vi.fn(() => new Blob(['pdf'], { type: 'application/pdf' })),
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

  it('maps the selected font to embedded PDF font names', async () => {
    const { doc, textRecords } = createMockDoc()
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      font: 'modern',
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 1,
    }

    await buildPracticePdf(doc, {
      selectedConsonantIds: [firstConsonant.id],
      selectedVowelIds: [],
      config,
    })

    expect(textRecords.some((record) => record.fontName === 'Prompt-SemiBold')).toBe(true)
    expect(textRecords.some((record) => record.fontName === 'Prompt-Regular')).toBe(true)
  })

  it('draws model glyphs centered with a middle baseline at the cell midpoint', async () => {
    const { doc, textRecords } = createMockDoc()
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 1,
    }

    await buildPracticePdf(doc, {
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

  it('draws the correct guide line counts for each grid guide mode', async () => {
    const runGuideTest = async (gridGuide: SheetConfig['gridGuide']) => {
      const { doc, lineRecords } = createMockDoc()

      await buildPracticePdf(doc, {
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

    const thaiLines = await runGuideTest('thai')
    expect(thaiLines).toHaveLength(3)
    expect(thaiLines.every((line) => line.color.join(',') === '200,230,201')).toBe(true)

    const crossLines = await runGuideTest('cross')
    expect(crossLines).toHaveLength(2)
    expect(crossLines.every((line) => line.color.join(',') === '224,224,224')).toBe(true)

    const sandwichLines = await runGuideTest('sandwich')
    expect(sandwichLines).toHaveLength(2)
    expect(sandwichLines.every((line) => line.color.join(',') === '224,224,224')).toBe(true)
  })

  it('uses preblended ghost colors that follow the existing opacity progression', async () => {
    const { doc, textRecords } = createMockDoc()

    await buildPracticePdf(doc, {
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

  it('adds a new page before a block that does not fit in the remaining space', async () => {
    const { doc } = createMockDoc(360)

    await buildPracticePdf(doc, {
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

  it('uses the larger cell midpoint for large font glyph placement', async () => {
    const { doc, textRecords } = createMockDoc()
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'large',
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 1,
    }

    await buildPracticePdf(doc, {
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

  it('emits generation progress while building large exports', async () => {
    const { doc } = createMockDoc()
    const progressStates: Array<{ phase: string; completed?: number; total?: number }> = []

    const args: DownloadPracticePdfArgs = {
      selectedConsonantIds: THAI_CONSONANTS.slice(0, 6).map((consonant) => consonant.id),
      selectedVowelIds: [],
      config: {
        ...DEFAULT_SHEET_CONFIG,
        rowsPerCharacter: 1,
        columns: 5,
        ghostCopiesPerRow: 1,
      },
      onProgress: (state) => {
        progressStates.push(state)
      },
    }

    await buildPracticePdf(doc, args)

    expect(progressStates).toHaveLength(6)
    expect(progressStates[0]).toEqual({ phase: 'generating', completed: 1, total: 6 })
    expect(progressStates[progressStates.length - 1]).toEqual({
      phase: 'generating',
      completed: 6,
      total: 6,
    })
  })
})

describe('downloadPracticePdf', () => {
  it('reports progress phases in order and downloads via a blob URL', async () => {
    const { doc } = createMockDoc()
    const progressStates: string[] = []
    const createObjectURL = vi.fn(() => 'blob:pdf')
    const revokeObjectURL = vi.fn()
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('font').buffer,
    })
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL

    jsPDFConstructorMock.mockImplementation(
      class MockJsPDF {
        constructor() {
          return doc
        }
      } as unknown as (...args: any[]) => any
    )
    vi.stubGlobal('fetch', fetchMock)
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    })

    await downloadPracticePdf({
      selectedConsonantIds: [THAI_CONSONANTS[0].id, THAI_CONSONANTS[1].id],
      selectedVowelIds: [],
      config: DEFAULT_SHEET_CONFIG,
      onProgress: ({ phase }) => {
        progressStates.push(phase)
      },
    })

    expect(progressStates[0]).toBe('preparing')
    expect(progressStates).toContain('generating')
    expect(progressStates[progressStates.length - 1]).toBe('downloading')
    expect(doc.output).toHaveBeenCalledWith('blob')
    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(anchorClick).toHaveBeenCalledTimes(1)

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 0)
    })
    expect(revokeObjectURL).toHaveBeenCalledTimes(1)

    anchorClick.mockRestore()
    vi.unstubAllGlobals()
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: originalRevokeObjectURL,
    })
  })
})
