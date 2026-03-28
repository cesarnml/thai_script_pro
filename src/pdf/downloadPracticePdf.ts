import { jsPDF } from 'jspdf'
import type { SheetConfig } from '../data/sheetOptions'
import { registerPdfFonts } from './pdfFonts'
import { buildPracticePdf } from './pdfDocument'
import {
  PDF_FILENAME,
  type PdfDocLike,
  getGhostTextColor,
  getPdfFontFamily,
} from './pdfShared'

export interface DownloadPracticePdfArgs {
  selectedConsonantIds: string[]
  selectedVowelIds: string[]
  config: SheetConfig
  onProgress?: (state: PdfExportProgress) => void
}

export interface PdfExportProgress {
  phase: 'preparing' | 'generating' | 'downloading'
  completed?: number
  total?: number
}

function emitProgress(
  args: DownloadPracticePdfArgs,
  state: PdfExportProgress,
): void {
  args.onProgress?.(state)
}

async function yieldToBrowser(): Promise<void> {
  if (
    typeof window !== 'undefined' &&
    typeof window.requestAnimationFrame === 'function'
  ) {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })
    return
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0)
  })
}

function triggerPdfDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 0)
}

export async function downloadPracticePdf(
  args: DownloadPracticePdfArgs,
): Promise<void> {
  const doc = new jsPDF({
    format: 'a4',
    orientation: 'portrait',
    unit: 'pt',
  })

  emitProgress(args, { phase: 'preparing' })
  await registerPdfFonts(doc as unknown as PdfDocLike)
  await yieldToBrowser()
  await buildPracticePdf(doc as unknown as PdfDocLike, args)

  emitProgress(args, { phase: 'downloading' })
  await yieldToBrowser()
  const blob = (doc as unknown as PdfDocLike).output('blob')
  triggerPdfDownload(blob, PDF_FILENAME)
}

export { buildPracticePdf, getGhostTextColor, getPdfFontFamily }
export type { PdfDocLike }
