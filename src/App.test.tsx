import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    downloadPracticePdfMock.mockClear()
    downloadPracticePdfMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
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
    expect(downloadPracticePdfMock).toHaveBeenCalledWith({
      selectedConsonantIds: [],
      selectedVowelIds: [],
      config: DEFAULT_SHEET_CONFIG,
    })
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
})
