import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getConsonantPresetById } from './data/consonants'
import { formatVowelWithPlaceholder } from './data/vowels'
import { DEFAULT_SHEET_CONFIG } from './data/sheetOptions'

const { downloadPracticePdfMock } = vi.hoisted(() => {
  return {
    downloadPracticePdfMock: vi.fn().mockResolvedValue(undefined),
  }
})

vi.mock('./pdf/downloadPracticePdf', () => ({
  downloadPracticePdf: downloadPracticePdfMock,
}))

import App from './App'

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('App', () => {
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    downloadPracticePdfMock.mockClear()
    downloadPracticePdfMock.mockResolvedValue(undefined)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      callback(0)
      return 0
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    if (originalClientWidth) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
    }
  })

  it('renders app title Thai Script Pro', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /thai script pro/i })).toBeInTheDocument()
  })

  it('renders content selection, sheet options, preview, and output actions', () => {
    const { container } = render(<App />)
    const contentSelectionHeading = screen.getByRole('heading', { name: /consonants/i })
    const rowsSelect = screen.getByLabelText(/^rows$/i)

    expect(contentSelectionHeading).toBeInTheDocument()
    expect(rowsSelect).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()

    const sheetOptionsSection = rowsSelect.closest('section')
    const contentSelectionSection = contentSelectionHeading.closest('section')

    expect(sheetOptionsSection).not.toBeNull()
    expect(contentSelectionSection).not.toBeNull()
    expect(
      container.compareDocumentPosition(sheetOptionsSection!) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      container.compareDocumentPosition(contentSelectionSection!) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      sheetOptionsSection!.compareDocumentPosition(contentSelectionSection!) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('downloads PDF through the native generator helper', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /download pdf/i }))

    expect(downloadPracticePdfMock).toHaveBeenCalledTimes(1)
    expect(downloadPracticePdfMock).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedConsonantIds: [],
        selectedVowelIds: [],
        config: DEFAULT_SHEET_CONFIG,
        onProgress: expect.any(Function),
      })
    )
  })

  it('grows the initial columns from 3 to the largest viewport-safe value on first load', async () => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if ((this as HTMLElement).dataset.previewSurface === 'true') return 720
        return 0
      },
    })

    render(<App />)

    expect(await screen.findByLabelText(/^columns$/i)).toHaveValue('9')
    expect(screen.queryByText('Adjusted to 9 columns so it fits on the page.')).not.toBeInTheDocument()
  })

  it('applies the font dropdown selection to content selection buttons', async () => {
    const user = userEvent.setup()
    render(<App />)

    const fontSelect = screen.getByRole('combobox', { name: /^font$/i })
    await user.selectOptions(fontSelect, 'cursive')

    expect(screen.getAllByRole('button', { name: /^ก/ })[0]).toHaveStyle({
      fontFamily: '"Itim", cursive',
    })
    expect(
      screen.getByRole('button', { name: formatVowelWithPlaceholder('ะ') })
    ).toHaveStyle({
      fontFamily: '"Itim", cursive',
    })
  })

  it('applies consonant presets through the content selection section', async () => {
    const user = userEvent.setup()
    const mc = getConsonantPresetById('MC')
    if (!mc) throw new Error('Expected MC preset to exist')

    render(<App />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(screen.getByRole('option', { name: /^Middle Class/i }))

    expect(screen.getByRole('button', { name: /consonant presets/i })).toHaveTextContent(
      'Middle Class'
    )
    expect(screen.getByText(new RegExp(`${mc.consonantIds.length} of 44 selected`, 'i'))).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).not.toHaveTextContent(
      /select consonants or vowels to see preview/i
    )
  })

  it('lets the user deselect a checked consonant preset through the dropdown', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(screen.getByRole('option', { name: /^Middle Class/i }))
    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(screen.getByRole('option', { name: /^Middle Class/i }))

    expect(screen.getByRole('button', { name: /consonant presets/i })).toHaveTextContent('Presets')
    expect(screen.getByText(/0 of 44 selected/i)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).toHaveTextContent(
      /select consonants or vowels to see preview/i
    )
  })

  it('auto-clamps columns and ghost copies when switching to a larger font size', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText(/font size/i), 'small')
    await user.selectOptions(screen.getByLabelText(/^columns$/i), '12')
    await user.selectOptions(screen.getByLabelText(/^ghost copies$/i), '10')
    await user.selectOptions(screen.getByLabelText(/font size/i), 'large')

    expect(screen.getByLabelText(/^columns$/i)).toHaveValue('7')
    expect(screen.getByLabelText(/^ghost copies$/i)).toHaveValue('7')
    expect(screen.getByText('Adjusted to 7 columns so it fits on the page.')).toBeInTheDocument()
  })

  it('keeps the toast visible for 5 seconds before auto-dismissing', async () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.change(screen.getByLabelText(/font size/i), { target: { value: 'small' } })
    fireEvent.change(screen.getByLabelText(/^columns$/i), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText(/font size/i), { target: { value: 'large' } })

    expect(screen.getByText('Adjusted to 7 columns so it fits on the page.')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4900)
    })
    expect(screen.getByText('Adjusted to 7 columns so it fits on the page.')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.queryByText('Adjusted to 7 columns so it fits on the page.')).not.toBeInTheDocument()
  })

  it('allows the user to dismiss the clamp toast immediately', async () => {
    vi.useFakeTimers()
    render(<App />)

    fireEvent.change(screen.getByLabelText(/font size/i), { target: { value: 'small' } })
    fireEvent.change(screen.getByLabelText(/^columns$/i), { target: { value: '9' } })
    fireEvent.change(screen.getByLabelText(/font size/i), { target: { value: 'large' } })

    expect(screen.getByText('Adjusted to 7 columns so it fits on the page.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /dismiss notification/i }))

    expect(screen.queryByText('Adjusted to 7 columns so it fits on the page.')).not.toBeInTheDocument()
  })

  it('does not show a toast when the selected columns already fit the new font size', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText(/^columns$/i), '7')
    await user.selectOptions(screen.getByLabelText(/font size/i), 'large')

    expect(screen.queryByText('Adjusted to 7 columns so it fits on the page.')).not.toBeInTheDocument()
  })

  it('disables the download button and shows progress while the PDF is being prepared', async () => {
    const deferred = createDeferred()
    const user = userEvent.setup()

    downloadPracticePdfMock.mockImplementation(async ({ onProgress }) => {
      onProgress?.({ phase: 'generating', completed: 2, total: 5 })
      return deferred.promise
    })

    render(<App />)

    await user.click(screen.getByRole('button', { name: /download pdf/i }))

    expect(screen.getByRole('button', { name: /building 2\/5/i })).toBeDisabled()
    expect(screen.getByText('Building your PDF pages (2 of 5)...')).toBeInTheDocument()

    deferred.resolve(undefined)
    await act(async () => {
      await deferred.promise
    })

    expect(screen.getByRole('button', { name: /download pdf/i })).toBeEnabled()
    expect(screen.getAllByRole('status').some((node) => node.textContent === '')).toBe(true)
  })

  it('shows an error toast if the PDF export fails', async () => {
    const user = userEvent.setup()
    downloadPracticePdfMock.mockRejectedValueOnce(new Error('network failure'))

    render(<App />)

    await user.click(screen.getByRole('button', { name: /download pdf/i }))

    expect(await screen.findByText('PDF export failed. Please try again.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeEnabled()
  })

  it('does not start duplicate PDF exports while one is already in progress', async () => {
    const deferred = createDeferred()
    const user = userEvent.setup()

    downloadPracticePdfMock.mockImplementation(async () => deferred.promise)

    render(<App />)

    const button = screen.getByRole('button', { name: /download pdf/i })
    await user.click(button)
    expect(screen.getByRole('button', { name: /preparing pdf/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /preparing pdf/i }))

    expect(downloadPracticePdfMock).toHaveBeenCalledTimes(1)

    deferred.resolve(undefined)
    await act(async () => {
      await deferred.promise
    })
  })
})
