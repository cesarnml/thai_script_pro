import type { PdfDocLike } from './pdfShared'
import { getAllPdfFonts } from './pdfShared'

const loadedFontFiles = new Map<string, Promise<string>>()

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

export async function registerPdfFonts(doc: PdfDocLike): Promise<void> {
  for (const font of getAllPdfFonts()) {
    const fontBinary = await loadFontBinary(font.fileName)
    doc.addFileToVFS(font.fileName, fontBinary)
    doc.addFont(font.fileName, font.fontName, 'normal')
  }
}
