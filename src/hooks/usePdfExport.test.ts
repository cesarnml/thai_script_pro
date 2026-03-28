import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_SHEET_CONFIG } from '../data/sheetOptions'
import { usePdfExport } from './usePdfExport'

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('usePdfExport', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (callback: FrameRequestCallback) => {
        callback(0)
        return 0
      },
    )
  })

  it('passes the selected content and config to the PDF downloader', async () => {
    const downloadPdf = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() =>
      usePdfExport({
        selectedConsonantIds: ['ko-kai'],
        selectedVowelIds: ['sara-a'],
        config: DEFAULT_SHEET_CONFIG,
        downloadPdf,
      }),
    )

    await act(async () => {
      await result.current.handleDownloadPdf()
    })

    expect(downloadPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedConsonantIds: ['ko-kai'],
        selectedVowelIds: ['sara-a'],
        config: DEFAULT_SHEET_CONFIG,
        onProgress: expect.any(Function),
      }),
    )
  })

  it('exposes progress labels while the export is running', async () => {
    const deferred = createDeferred<void>()
    const downloadPdf = vi.fn().mockImplementation(async ({ onProgress }) => {
      onProgress({ phase: 'generating', completed: 2, total: 5 })
      await deferred.promise
    })
    const { result } = renderHook(() =>
      usePdfExport({
        selectedConsonantIds: [],
        selectedVowelIds: [],
        config: DEFAULT_SHEET_CONFIG,
        downloadPdf,
      }),
    )

    let exportPromise!: Promise<void>
    await act(async () => {
      exportPromise = result.current.handleDownloadPdf()
    })

    expect(result.current.pdfExportState.phase).toBe('generating')
    expect(result.current.pdfExportState.label).toBe('Building 2/5')
    expect(result.current.pdfExportState.statusMessage).toBe(
      'Building your PDF pages (2 of 5)...',
    )

    await act(async () => {
      deferred.resolve()
      await exportPromise
    })

    expect(result.current.pdfExportState.phase).toBe('idle')
  })

  it('guards against duplicate exports while one is in progress', async () => {
    const deferred = createDeferred<void>()
    const downloadPdf = vi.fn().mockImplementation(() => deferred.promise)
    const { result } = renderHook(() =>
      usePdfExport({
        selectedConsonantIds: [],
        selectedVowelIds: [],
        config: DEFAULT_SHEET_CONFIG,
        downloadPdf,
      }),
    )

    let firstExport!: Promise<void>
    await act(async () => {
      firstExport = result.current.handleDownloadPdf()
    })

    await act(async () => {
      await result.current.handleDownloadPdf()
    })

    expect(downloadPdf).toHaveBeenCalledTimes(1)

    await act(async () => {
      deferred.resolve()
      await firstExport
    })
  })

  it('calls onError when export fails', async () => {
    const onError = vi.fn()
    const downloadPdf = vi.fn().mockRejectedValue(new Error('boom'))
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const { result } = renderHook(() =>
      usePdfExport({
        selectedConsonantIds: [],
        selectedVowelIds: [],
        config: DEFAULT_SHEET_CONFIG,
        downloadPdf,
        onError,
      }),
    )

    await act(async () => {
      await result.current.handleDownloadPdf()
    })

    expect(onError).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(result.current.pdfExportState.phase).toBe('idle')
  })
})
