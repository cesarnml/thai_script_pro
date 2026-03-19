import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  const originalPrint = window.print

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    window.print = originalPrint
    document.body.classList.remove('print-preview-active')
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
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument()
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

  it('prints only the preview using print mode', async () => {
    const user = userEvent.setup()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    window.print = vi.fn()

    render(<App />)
    await user.click(screen.getByRole('button', { name: /print/i }))

    expect(document.body.classList.contains('print-preview-active')).toBe(true)
    expect(addEventListenerSpy).toHaveBeenCalledWith('afterprint', expect.any(Function), {
      once: true,
    })
    expect(window.print).toHaveBeenCalledTimes(1)
  })
})
