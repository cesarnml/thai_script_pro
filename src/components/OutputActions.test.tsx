import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OutputActions } from './OutputActions'

describe('OutputActions', () => {
  const mockOnPrint = vi.fn()
  const mockOnDownloadPdf = vi.fn()

  beforeEach(() => {
    mockOnPrint.mockClear()
    mockOnDownloadPdf.mockClear()
  })

  it('renders Print button', () => {
    render(<OutputActions onPrint={mockOnPrint} onDownloadPdf={mockOnDownloadPdf} />)
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument()
  })

  it('renders Download PDF button', () => {
    render(<OutputActions onPrint={mockOnPrint} onDownloadPdf={mockOnDownloadPdf} />)
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
  })

  it('calls onPrint when Print is clicked', async () => {
    const user = userEvent.setup()
    render(<OutputActions onPrint={mockOnPrint} onDownloadPdf={mockOnDownloadPdf} />)
    await user.click(screen.getByRole('button', { name: /print/i }))
    expect(mockOnPrint).toHaveBeenCalledTimes(1)
  })

  it('calls onDownloadPdf when Download PDF is clicked', async () => {
    const user = userEvent.setup()
    render(<OutputActions onPrint={mockOnPrint} onDownloadPdf={mockOnDownloadPdf} />)
    await user.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(mockOnDownloadPdf).toHaveBeenCalledTimes(1)
  })
})
