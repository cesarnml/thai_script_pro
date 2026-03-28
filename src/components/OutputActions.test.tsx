import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OutputActions } from './OutputActions'

describe('OutputActions', () => {
  const mockOnDownloadPdf = vi.fn()

  beforeEach(() => {
    mockOnDownloadPdf.mockClear()
  })

  it('renders Download PDF button', () => {
    render(<OutputActions onDownloadPdf={mockOnDownloadPdf} />)
    expect(
      screen.getByRole('button', { name: /download pdf/i }),
    ).toBeInTheDocument()
  })

  it('calls onDownloadPdf when Download PDF is clicked', async () => {
    const user = userEvent.setup()
    render(<OutputActions onDownloadPdf={mockOnDownloadPdf} />)
    await user.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(mockOnDownloadPdf).toHaveBeenCalledTimes(1)
  })

  it('renders a busy download state with a status message', () => {
    render(
      <OutputActions
        onDownloadPdf={mockOnDownloadPdf}
        isDownloading
        downloadLabel="Preparing PDF..."
        statusMessage="Preparing your PDF..."
      />,
    )

    expect(
      screen.getByRole('button', { name: /preparing pdf/i }),
    ).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Preparing your PDF...',
    )
  })
})
