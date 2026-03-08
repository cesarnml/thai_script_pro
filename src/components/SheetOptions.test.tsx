import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { SheetOptions } from './SheetOptions'
import { DEFAULT_SHEET_CONFIG } from '../data/sheetOptions'
import type { SheetConfig } from '../data/sheetOptions'

describe('SheetOptions', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders rows per character control', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/rows per character/i)).toBeInTheDocument()
  })

  it('changing rows per character calls onChange with new value', () => {
    function Wrapper() {
      const [config, setConfig] = useState<SheetConfig>(DEFAULT_SHEET_CONFIG)
      return (
        <SheetOptions
          config={config}
          onChange={(next) => {
            setConfig(next)
            mockOnChange(next)
          }}
        />
      )
    }
    render(<Wrapper />)
    const input = screen.getByLabelText(/rows per character/i)
    fireEvent.change(input, { target: { value: '4' } })
    expect(mockOnChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rowsPerCharacter: 4 })
    )
  })

  it('renders ghost copies per row control', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/ghost copies per row/i)).toBeInTheDocument()
  })

  it('renders paper size dropdown with A4 and Letter', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/paper size/i)).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    expect(options.some((o) => o.textContent?.includes('A4'))).toBe(true)
    expect(options.some((o) => o.textContent?.includes('Letter'))).toBe(true)
  })

  it('renders grid guide dropdown with 3 options', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    const gridSelect = screen.getByLabelText(/grid guide/i)
    expect(gridSelect).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    const gridOptions = options.filter((o) => o.getAttribute('value')?.match(/cross|sandwich|thai/))
    expect(gridOptions.length).toBeGreaterThanOrEqual(3)
  })

  it('renders font dropdown with default selected', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    const fontSelect = screen.getByRole('combobox', { name: /^font$/i })
    expect(fontSelect).toBeInTheDocument()
    expect(fontSelect).toHaveValue('noto-serif-thai')
  })

  it('renders font size dropdown', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/font size/i)).toBeInTheDocument()
  })
})
