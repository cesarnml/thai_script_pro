import { THAI_CONSONANTS } from '../data/consonants'
import type { SheetConfig } from '../data/sheetOptions'
import { THAI_VOWELS, formatVowelWithPlaceholder } from '../data/vowels'
import {
  buildWorksheetSubtitle,
  EMPTY_WORKSHEET_MESSAGE,
  WORKSHEET_TITLE,
} from '../data/worksheetContent'
import type { DownloadPracticePdfArgs, PdfExportProgress } from './downloadPracticePdf'
import {
  BLOCK_YIELD_INTERVAL,
  BORDER_COLOR,
  BORDER_LINE_WIDTH,
  getBlockHeight,
  getGhostTextColor,
  getPdfFontFamily,
  getPdfLayout,
  GRID_GAP_Y,
  GUIDE_LINE_WIDTH,
  type PdfCharacterBlock,
  type PdfDocLike,
  type PdfFontFamily,
  type PdfLayout,
  type RgbColor,
  LABEL_ROW_HEIGHT,
  NEUTRAL_GUIDE_COLOR,
  OTHER_PAGE_TOP_Y,
  PRIMARY_TEXT_COLOR,
  SECONDARY_TEXT_COLOR,
  SUBTITLE_COLOR,
  THAI_GUIDE_COLOR,
} from './pdfShared'

function emitProgress(args: DownloadPracticePdfArgs, state: PdfExportProgress): void {
  args.onProgress?.(state)
}

async function yieldToBrowser(): Promise<void> {
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
    return
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
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

function drawDocumentHeader(
  doc: PdfDocLike,
  layout: PdfLayout,
  subtitle: string,
  fontFamily: PdfFontFamily
): number {
  doc.setTextColor(...PRIMARY_TEXT_COLOR)
  doc.setFont(fontFamily.semibold.fontName)
  doc.setFontSize(layout.titleFontSize)
  doc.text(WORKSHEET_TITLE, layout.pageWidth / 2, layout.topY, { align: 'center' })

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
  doc.text(text, x + layout.cellSize / 2, y + layout.cellSize / 2, {
    align: 'center',
    baseline: 'middle',
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

export async function buildPracticePdf(doc: PdfDocLike, args: DownloadPracticePdfArgs): Promise<void> {
  const layout = getPdfLayout(doc, args.config)
  const fontFamily = getPdfFontFamily(args.config.font)
  const fontLabel = args.config.font.charAt(0).toUpperCase() + args.config.font.slice(1)
  const blocks = getPdfBlocks(args)
  const subtitle = buildWorksheetSubtitle({
    consonantCount: args.selectedConsonantIds.length,
    vowelCount: args.selectedVowelIds.length,
    fontLabel,
  })

  let currentY = drawDocumentHeader(doc, layout, subtitle, fontFamily)

  if (blocks.length === 0) {
    doc.setFont(fontFamily.regular.fontName)
    doc.setFontSize(12)
    doc.setTextColor(...SUBTITLE_COLOR)
    doc.text(EMPTY_WORKSHEET_MESSAGE, layout.pageWidth / 2, currentY + 24, {
      align: 'center',
    })
    return
  }

  for (const [index, block] of blocks.entries()) {
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
      currentY + LABEL_ROW_HEIGHT + GRID_GAP_Y,
      args.config,
      layout,
      fontFamily
    )
    currentY += blockHeight

    emitProgress(args, {
      phase: 'generating',
      completed: index + 1,
      total: blocks.length,
    })

    if ((index + 1) % BLOCK_YIELD_INTERVAL === 0 && index < blocks.length - 1) {
      await yieldToBrowser()
    }
  }
}
