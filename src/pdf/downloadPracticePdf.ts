import { jsPDF } from 'jspdf'
import { THAI_CONSONANTS } from '../data/consonants'
import {
  DEFAULT_SHEET_CONFIG,
  FONT_SIZE_MAP,
  type SheetConfig,
} from '../data/sheetOptions'
import { THAI_VOWELS, formatVowelWithPlaceholder } from '../data/vowels'

export interface DownloadPracticePdfArgs {
  selectedConsonantIds: string[]
  selectedVowelIds: string[]
  config: SheetConfig
}

type RgbColor = [number, number, number]

interface FontVariant {
  fileName: string
  fontName: string
}

interface PdfFontFamily {
  regular: FontVariant
  semibold: FontVariant
}

interface PdfCharacterBlock {
  primaryLabel: string
  secondaryLabel?: string
  displayText: string
}

interface PdfLayout {
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
  save(filename: string): void
  setDrawColor(r: number, g: number, b: number): void
  setFont(fontName: string, fontStyle?: string): void
  setFontSize(size: number): void
  setLineDashPattern(dashArray: number[], dashPhase: number): void
  setLineWidth(width: number): void
  setTextColor(r: number, g: number, b: number): void
  text(text: string, x: number, y: number, options?: Record<string, unknown>): void
}

const PX_TO_PT = 0.75
const PAGE_MARGIN_X = 28
const FIRST_PAGE_TOP_Y = 48
const OTHER_PAGE_TOP_Y = 40
const PAGE_BOTTOM_MARGIN = 40
const BLOCK_GAP_Y = 24
const LABEL_ROW_HEIGHT = 24
const GRID_GAP_Y = 8
const GUIDE_LINE_WIDTH = 0.75
const BORDER_LINE_WIDTH = 0.75
const BORDER_COLOR: RgbColor = [209, 213, 219]
const THAI_GUIDE_COLOR: RgbColor = [200, 230, 201]
const NEUTRAL_GUIDE_COLOR: RgbColor = [224, 224, 224]
const PRIMARY_TEXT_COLOR: RgbColor = [17, 24, 39]
const SECONDARY_TEXT_COLOR: RgbColor = [99, 102, 107]
const SUBTITLE_COLOR: RgbColor = [156, 163, 175]
const GHOST_BASE_COLOR: RgbColor = [156, 163, 175]
const PDF_FILENAME = 'thai-script-practice.pdf'
const THAI_TITLE = 'แบบฝึกหัดเขียนอักษรไทย'

const PDF_FONT_FAMILIES: Record<string, PdfFontFamily> = {
  traditional: {
    regular: { fileName: 'Sarabun-Regular.ttf', fontName: 'Sarabun-Regular' },
    semibold: { fileName: 'Sarabun-SemiBold.ttf', fontName: 'Sarabun-SemiBold' },
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

const loadedFontFiles = new Map<string, Promise<string>>()

export function getPdfFontFamily(fontId: string): PdfFontFamily {
  return PDF_FONT_FAMILIES[fontId] || PDF_FONT_FAMILIES[DEFAULT_SHEET_CONFIG.font]
}

export function getGhostOpacity(index: number, total: number): number {
  return Math.max(0.08, 0.4 * (1 - index / total))
}

export function getGhostTextColor(index: number, total: number): RgbColor {
  const opacity = getGhostOpacity(index, total)

  return GHOST_BASE_COLOR.map((channel) =>
    Math.round(255 - (255 - channel) * opacity)
  ) as RgbColor
}

function getPdfBlocks(args: DownloadPracticePdfArgs): PdfCharacterBlock[] {
  const consonantBlocks = THAI_CONSONANTS.filter((c) =>
    args.selectedConsonantIds.includes(c.id)
  ).map((c) => ({
    primaryLabel: c.char,
    secondaryLabel: `${c.char}อ ${c.name}`,
    displayText: c.char,
  }))

  const vowelBlocks = THAI_VOWELS.filter((v) =>
    args.selectedVowelIds.includes(v.id)
  ).map((v) => {
    const displayText = formatVowelWithPlaceholder(v.char)
    return {
      primaryLabel: displayText,
      displayText,
    }
  })

  return [...consonantBlocks, ...vowelBlocks]
}

function getPdfLayout(doc: PdfDocLike, config: SheetConfig): PdfLayout {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const rawCellSize = (FONT_SIZE_MAP[config.fontSize] || FONT_SIZE_MAP.medium).cellPx * PX_TO_PT
  const maxGridWidth = pageWidth - PAGE_MARGIN_X * 2
  const gridScale = Math.min(1, maxGridWidth / (rawCellSize * config.columns))
  const cellSize = rawCellSize * gridScale
  const glyphFontSize =
    (FONT_SIZE_MAP[config.fontSize] || FONT_SIZE_MAP.medium).text * PX_TO_PT * gridScale

  return {
    pageWidth,
    pageHeight,
    marginX: PAGE_MARGIN_X,
    topY: FIRST_PAGE_TOP_Y,
    bottomMargin: PAGE_BOTTOM_MARGIN,
    gridX: PAGE_MARGIN_X,
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

function buildSubtitle(consonantCount: number, vowelCount: number, fontLabel: string): string {
  const totalChars = consonantCount + vowelCount
  const charType =
    consonantCount > 0 && vowelCount > 0
      ? 'Characters'
      : consonantCount > 0
        ? 'Consonants'
        : 'Vowels'

  return `Thai ${charType} Writing Practice · ${totalChars} ${charType.toLowerCase()} · ${fontLabel}`
}

function getGridHeight(config: SheetConfig, layout: PdfLayout): number {
  return layout.cellSize * config.rowsPerCharacter
}

function getBlockHeight(config: SheetConfig, layout: PdfLayout): number {
  return layout.labelRowHeight + layout.gridGapY + getGridHeight(config, layout) + layout.blockGapY
}

function drawDocumentHeader(
  doc: PdfDocLike,
  layout: PdfLayout,
  subtitle: string,
  fontFamily: PdfFontFamily
): number {
  doc.setTextColor(...PRIMARY_TEXT_COLOR)
  doc.setFont(fontFamily.semibold.fontName)
  doc.setFontSize(layout.titleFontSize)
  doc.text(THAI_TITLE, layout.pageWidth / 2, layout.topY, { align: 'center' })

  const subtitleY = layout.topY + 24
  doc.setFont(fontFamily.regular.fontName)
  doc.setFontSize(layout.subtitleFontSize)
  doc.setTextColor(...SUBTITLE_COLOR)
  doc.text(subtitle, layout.pageWidth / 2, subtitleY, { align: 'center' })

  return subtitleY + 24
}

function drawBlockLabel(
  doc: PdfDocLike,
  block: PdfCharacterBlock,
  x: number,
  y: number,
  layout: PdfLayout,
  fontFamily: PdfFontFamily
): void {
  doc.setTextColor(...PRIMARY_TEXT_COLOR)
  doc.setFont(fontFamily.semibold.fontName)
  doc.setFontSize(layout.headerPrimaryFontSize)
  doc.text(block.primaryLabel, x, y + layout.headerPrimaryFontSize, { baseline: 'bottom' })

  if (!block.secondaryLabel) return

  doc.setTextColor(...SECONDARY_TEXT_COLOR)
  doc.setFont(fontFamily.regular.fontName)
  doc.setFontSize(layout.headerSecondaryFontSize)
  doc.text(
    block.secondaryLabel,
    x + layout.headerPrimaryFontSize + 8,
    y + layout.headerPrimaryFontSize - 1
  )
}

function drawGuideLines(
  doc: PdfDocLike,
  x: number,
  y: number,
  size: number,
  guide: string,
  dash: number
): void {
  const guideColor = guide === 'thai' ? THAI_GUIDE_COLOR : NEUTRAL_GUIDE_COLOR
  const yQuarter = y + size * 0.25
  const yHalf = y + size * 0.5
  const yThreeQuarter = y + size * 0.75
  const xHalf = x + size * 0.5

  doc.setLineWidth(GUIDE_LINE_WIDTH)
  doc.setDrawColor(...guideColor)
  doc.setLineDashPattern([dash, dash], 0)

  if (guide === 'thai') {
    doc.line(x, yQuarter, x + size, yQuarter)
    doc.line(x, yHalf, x + size, yHalf)
    doc.line(x, yThreeQuarter, x + size, yThreeQuarter)
  }

  if (guide === 'cross') {
    doc.line(x, yHalf, x + size, yHalf)
    doc.line(xHalf, y, xHalf, y + size)
  }

  if (guide === 'sandwich') {
    doc.line(x, yQuarter, x + size, yQuarter)
    doc.line(x, yThreeQuarter, x + size, yThreeQuarter)
  }

  doc.setLineDashPattern([], 0)
}

function drawGridCell(
  doc: PdfDocLike,
  x: number,
  y: number,
  size: number,
  guide: string,
  dash: number
): void {
  doc.setLineWidth(BORDER_LINE_WIDTH)
  doc.setDrawColor(...BORDER_COLOR)
  doc.rect(x, y, size, size)
  drawGuideLines(doc, x, y, size, guide, dash)
}

function drawGridGlyph(
  doc: PdfDocLike,
  text: string,
  x: number,
  y: number,
  layout: PdfLayout,
  fontName: string,
  color: RgbColor
): void {
  doc.setFont(fontName)
  doc.setFontSize(layout.glyphFontSize)
  doc.setTextColor(...color)
  doc.text(text, x + layout.cellSize / 2, y + layout.cellSize, {
    align: 'center',
    baseline: 'bottom',
  })
}

function drawPracticeGrid(
  doc: PdfDocLike,
  block: PdfCharacterBlock,
  x: number,
  y: number,
  config: SheetConfig,
  layout: PdfLayout,
  fontFamily: PdfFontFamily
): void {
  const firstRowGhostCopies = Math.min(config.ghostCopiesPerRow, Math.max(config.columns - 1, 0))
  const laterRowGhostCopies = Math.min(firstRowGhostCopies + 1, config.columns)

  for (let row = 0; row < config.rowsPerCharacter; row += 1) {
    const isFirstRow = row === 0
    const ghostCopies = isFirstRow ? firstRowGhostCopies : laterRowGhostCopies

    for (let col = 0; col < config.columns; col += 1) {
      const cellX = x + col * layout.cellSize
      const cellY = y + row * layout.cellSize
      const isModel = isFirstRow && col === 0
      const ghostIdx = isFirstRow ? col - 1 : col
      const isGhost = isFirstRow ? col > 0 && col <= ghostCopies : col < ghostCopies

      drawGridCell(doc, cellX, cellY, layout.cellSize, config.gridGuide, layout.guideDash)

      if (isModel) {
        drawGridGlyph(
          doc,
          block.displayText,
          cellX,
          cellY,
          layout,
          fontFamily.semibold.fontName,
          PRIMARY_TEXT_COLOR
        )
      }

      if (isGhost) {
        drawGridGlyph(
          doc,
          block.displayText,
          cellX,
          cellY,
          layout,
          fontFamily.regular.fontName,
          getGhostTextColor(ghostIdx, ghostCopies)
        )
      }
    }
  }
}

export function buildPracticePdf(doc: PdfDocLike, args: DownloadPracticePdfArgs): void {
  const layout = getPdfLayout(doc, args.config)
  const fontFamily = getPdfFontFamily(args.config.font)
  const fontLabel = args.config.font.charAt(0).toUpperCase() + args.config.font.slice(1)
  const blocks = getPdfBlocks(args)
  const subtitle = buildSubtitle(
    args.selectedConsonantIds.length,
    args.selectedVowelIds.length,
    fontLabel
  )

  let currentY = drawDocumentHeader(doc, layout, subtitle, fontFamily)

  if (blocks.length === 0) {
    doc.setFont(fontFamily.regular.fontName)
    doc.setFontSize(12)
    doc.setTextColor(...SUBTITLE_COLOR)
    doc.text('Select consonants or vowels to see preview.', layout.pageWidth / 2, currentY + 24, {
      align: 'center',
    })
    return
  }

  for (const block of blocks) {
    const blockHeight = getBlockHeight(args.config, layout)

    if (currentY + blockHeight > layout.pageHeight - layout.bottomMargin) {
      doc.addPage()
      currentY = OTHER_PAGE_TOP_Y
    }

    drawBlockLabel(doc, block, layout.gridX, currentY, layout, fontFamily)
    drawPracticeGrid(
      doc,
      block,
      layout.gridX,
      currentY + layout.labelRowHeight + layout.gridGapY,
      args.config,
      layout,
      fontFamily
    )
    currentY += blockHeight
  }
}

function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return binary
}

function buildFontUrl(fileName: string): string {
  return new URL(`${import.meta.env.BASE_URL}fonts/${fileName}`, window.location.origin).toString()
}

async function loadFontBinary(fileName: string): Promise<string> {
  const cached = loadedFontFiles.get(fileName)
  if (cached) return cached

  const fontPromise = fetch(buildFontUrl(fileName))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load PDF font: ${fileName}`)
      }

      return arrayBufferToBinaryString(await response.arrayBuffer())
    })

  loadedFontFiles.set(fileName, fontPromise)
  return fontPromise
}

async function registerPdfFonts(doc: PdfDocLike): Promise<void> {
  const uniqueFonts = new Map<string, FontVariant>()

  for (const family of Object.values(PDF_FONT_FAMILIES)) {
    uniqueFonts.set(family.regular.fileName, family.regular)
    uniqueFonts.set(family.semibold.fileName, family.semibold)
  }

  for (const font of uniqueFonts.values()) {
    const fontBinary = await loadFontBinary(font.fileName)
    doc.addFileToVFS(font.fileName, fontBinary)
    doc.addFont(font.fileName, font.fontName, 'normal')
  }
}

export async function downloadPracticePdf(args: DownloadPracticePdfArgs): Promise<void> {
  const doc = new jsPDF({
    format: 'a4',
    orientation: 'portrait',
    unit: 'pt',
  })

  await registerPdfFonts(doc as unknown as PdfDocLike)
  buildPracticePdf(doc as unknown as PdfDocLike, args)
  doc.save(PDF_FILENAME)
}
