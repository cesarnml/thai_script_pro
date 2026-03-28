import {
  DEFAULT_SHEET_CONFIG,
  FONT_SIZE_MAP,
  PDF_PAGE_MARGIN_X_PT,
  PX_TO_PT,
  type SheetConfig,
} from '@/data/sheetOptions'

export type RgbColor = [number, number, number]

export interface FontVariant {
  fileName: string
  fontName: string
}

export interface PdfFontFamily {
  regular: FontVariant
  semibold: FontVariant
}

export interface PdfCharacterBlock {
  primaryLabel: string
  secondaryLabel?: string
  displayText: string
}

export interface PdfLayout {
  pageWidth: number
  pageHeight: number
  marginX: number
  topY: number
  bottomMargin: number
  gridX: number
  cellSize: number
  glyphFontSize: number
  headerPrimaryFontSize: number
  headerSecondaryFontSize: number
  titleFontSize: number
  subtitleFontSize: number
  guideDash: number
  labelRowHeight: number
  gridGapY: number
  blockGapY: number
}

interface PdfPageSize {
  getWidth(): number
  getHeight(): number
}

export interface PdfDocLike {
  internal: { pageSize: PdfPageSize }
  addFileToVFS(fileName: string, fileContent: string): void
  addFont(fileName: string, fontName: string, fontStyle: string): void
  addPage(): void
  line(x1: number, y1: number, x2: number, y2: number): void
  rect(x: number, y: number, width: number, height: number): void
  output(type: 'blob'): Blob
  setDrawColor(r: number, g: number, b: number): void
  setFont(fontName: string, fontStyle?: string): void
  setFontSize(size: number): void
  setLineDashPattern(dashArray: number[], dashPhase: number): void
  setLineWidth(width: number): void
  setTextColor(r: number, g: number, b: number): void
  text(
    text: string,
    x: number,
    y: number,
    options?: Record<string, unknown>,
  ): void
}

export const FIRST_PAGE_TOP_Y = 48
export const OTHER_PAGE_TOP_Y = 40
export const PAGE_BOTTOM_MARGIN = 40
export const BLOCK_GAP_Y = 24
export const LABEL_ROW_HEIGHT = 24
export const GRID_GAP_Y = 8
export const GUIDE_LINE_WIDTH = 0.75
export const BORDER_LINE_WIDTH = 0.75
export const BORDER_COLOR: RgbColor = [209, 213, 219]
export const THAI_GUIDE_COLOR: RgbColor = [200, 230, 201]
export const NEUTRAL_GUIDE_COLOR: RgbColor = [224, 224, 224]
export const PRIMARY_TEXT_COLOR: RgbColor = [17, 24, 39]
export const SECONDARY_TEXT_COLOR: RgbColor = [99, 102, 107]
export const SUBTITLE_COLOR: RgbColor = [156, 163, 175]
export const GHOST_BASE_COLOR: RgbColor = [156, 163, 175]
export const PDF_FILENAME = 'thai-script-practice.pdf'
export const BLOCK_YIELD_INTERVAL = 4

const PDF_FONT_FAMILIES: Record<string, PdfFontFamily> = {
  traditional: {
    regular: { fileName: 'Sarabun-Regular.ttf', fontName: 'Sarabun-Regular' },
    semibold: {
      fileName: 'Sarabun-SemiBold.ttf',
      fontName: 'Sarabun-SemiBold',
    },
  },
  modern: {
    regular: { fileName: 'Prompt-Regular.ttf', fontName: 'Prompt-Regular' },
    semibold: { fileName: 'Prompt-SemiBold.ttf', fontName: 'Prompt-SemiBold' },
  },
  cursive: {
    regular: { fileName: 'Itim-Regular.ttf', fontName: 'Itim-Regular' },
    semibold: { fileName: 'Itim-Regular.ttf', fontName: 'Itim-Regular' },
  },
}

export function getPdfFontFamily(fontId: string): PdfFontFamily {
  return (
    PDF_FONT_FAMILIES[fontId] || PDF_FONT_FAMILIES[DEFAULT_SHEET_CONFIG.font]
  )
}

export function getAllPdfFonts(): FontVariant[] {
  const uniqueFonts = new Map<string, FontVariant>()

  for (const family of Object.values(PDF_FONT_FAMILIES)) {
    uniqueFonts.set(family.regular.fileName, family.regular)
    uniqueFonts.set(family.semibold.fileName, family.semibold)
  }

  return [...uniqueFonts.values()]
}

export function getGhostOpacity(index: number, total: number): number {
  return Math.max(0.08, 0.4 * (1 - index / total))
}

export function getGhostTextColor(index: number, total: number): RgbColor {
  const opacity = getGhostOpacity(index, total)

  return GHOST_BASE_COLOR.map((channel) =>
    Math.round(255 - (255 - channel) * opacity),
  ) as RgbColor
}

export function getPdfLayout(doc: PdfDocLike, config: SheetConfig): PdfLayout {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const rawCellSize =
    (FONT_SIZE_MAP[config.fontSize] || FONT_SIZE_MAP.medium).cellPx * PX_TO_PT
  const maxGridWidth = pageWidth - PDF_PAGE_MARGIN_X_PT * 2
  const gridScale = Math.min(1, maxGridWidth / (rawCellSize * config.columns))
  const cellSize = rawCellSize * gridScale
  const glyphFontSize =
    (FONT_SIZE_MAP[config.fontSize] || FONT_SIZE_MAP.medium).text *
    PX_TO_PT *
    gridScale

  return {
    pageWidth,
    pageHeight,
    marginX: PDF_PAGE_MARGIN_X_PT,
    topY: FIRST_PAGE_TOP_Y,
    bottomMargin: PAGE_BOTTOM_MARGIN,
    gridX: PDF_PAGE_MARGIN_X_PT,
    cellSize,
    glyphFontSize,
    headerPrimaryFontSize: Math.max(14, Math.min(18, glyphFontSize * 0.6)),
    headerSecondaryFontSize: 11,
    titleFontSize: 20,
    subtitleFontSize: 11,
    guideDash: 6 * PX_TO_PT,
    labelRowHeight: LABEL_ROW_HEIGHT,
    gridGapY: GRID_GAP_Y,
    blockGapY: BLOCK_GAP_Y,
  }
}

export function getGridHeight(config: SheetConfig, layout: PdfLayout): number {
  return layout.cellSize * config.rowsPerCharacter
}

export function getBlockHeight(config: SheetConfig, layout: PdfLayout): number {
  return (
    layout.labelRowHeight +
    layout.gridGapY +
    getGridHeight(config, layout) +
    layout.blockGapY
  )
}
