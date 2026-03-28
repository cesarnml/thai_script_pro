import { describe, expect, it, vi, beforeEach } from 'vitest'
import { registerPdfFonts } from '@/pdf/pdfFonts'
import type { PdfDocLike } from '@/pdf/pdfShared'

function createMockDoc(): PdfDocLike {
  return {
    internal: {
      pageSize: {
        getWidth: () => 595.28,
        getHeight: () => 841.89,
      },
    },
    addFileToVFS: vi.fn(),
    addFont: vi.fn(),
    addPage: vi.fn(),
    line: vi.fn(),
    rect: vi.fn(),
    output: vi.fn(() => new Blob()),
    setDrawColor: vi.fn(),
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    setLineDashPattern: vi.fn(),
    setLineWidth: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
  }
}

describe('registerPdfFonts', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('registers each unique PDF font on the document', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new TextEncoder().encode('font').buffer,
    })
    const doc = createMockDoc()

    vi.stubGlobal('fetch', fetchMock)

    await registerPdfFonts(doc)

    expect(fetchMock).toHaveBeenCalledTimes(5)
    expect(doc.addFileToVFS).toHaveBeenCalledTimes(5)
    expect(doc.addFont).toHaveBeenCalledTimes(5)
  })
})
