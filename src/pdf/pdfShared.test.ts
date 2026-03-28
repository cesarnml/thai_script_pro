import { describe, expect, it } from 'vitest'
import { DEFAULT_SHEET_CONFIG } from '@/data/sheetOptions'
import {
  getAllPdfFonts,
  getBlockHeight,
  getGhostTextColor,
  getPdfFontFamily,
  getPdfLayout,
  type PdfDocLike,
} from './pdfShared'

function createMockDoc(width = 595.28, height = 841.89): PdfDocLike {
  return {
    internal: {
      pageSize: {
        getWidth: () => width,
        getHeight: () => height,
      },
    },
    addFileToVFS: () => {},
    addFont: () => {},
    addPage: () => {},
    line: () => {},
    rect: () => {},
    output: () => new Blob(),
    setDrawColor: () => {},
    setFont: () => {},
    setFontSize: () => {},
    setLineDashPattern: () => {},
    setLineWidth: () => {},
    setTextColor: () => {},
    text: () => {},
  }
}

describe('pdfShared', () => {
  it('returns the default embedded family when the font id is unknown', () => {
    expect(getPdfFontFamily('unknown')).toEqual(
      getPdfFontFamily(DEFAULT_SHEET_CONFIG.font),
    )
  })

  it('returns each unique embedded font file once', () => {
    expect(getAllPdfFonts()).toEqual([
      { fileName: 'Sarabun-Regular.ttf', fontName: 'Sarabun-Regular' },
      { fileName: 'Sarabun-SemiBold.ttf', fontName: 'Sarabun-SemiBold' },
      { fileName: 'Prompt-Regular.ttf', fontName: 'Prompt-Regular' },
      { fileName: 'Prompt-SemiBold.ttf', fontName: 'Prompt-SemiBold' },
      { fileName: 'Itim-Regular.ttf', fontName: 'Itim-Regular' },
    ])
  })

  it('scales the grid layout to fit within the printable width', () => {
    const layout = getPdfLayout(createMockDoc(), {
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'large',
      columns: 12,
    })

    expect(layout.cellSize).toBeLessThan(75)
    expect(layout.gridX + layout.cellSize * 12).toBeLessThanOrEqual(
      layout.pageWidth - layout.marginX,
    )
  })

  it('lightens later ghost copies relative to earlier ones', () => {
    const firstGhost = getGhostTextColor(0, 3)
    const lastGhost = getGhostTextColor(2, 3)

    expect(firstGhost.every((channel) => channel >= 0 && channel <= 255)).toBe(
      true,
    )
    expect(lastGhost.every((channel) => channel >= 0 && channel <= 255)).toBe(
      true,
    )
    expect(lastGhost[0]).toBeGreaterThan(firstGhost[0])
    expect(lastGhost[1]).toBeGreaterThan(firstGhost[1])
    expect(lastGhost[2]).toBeGreaterThan(firstGhost[2])
  })

  it('derives block height from the layout geometry', () => {
    const layout = getPdfLayout(createMockDoc(), DEFAULT_SHEET_CONFIG)

    expect(getBlockHeight(DEFAULT_SHEET_CONFIG, layout)).toBe(227)
  })
})
