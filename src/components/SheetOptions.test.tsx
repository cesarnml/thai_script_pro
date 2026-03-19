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

  it('renders rows control', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/^rows$/i)).toBeInTheDocument()
  })

  it('changing rows calls onChange with new value', () => {
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
    const input = screen.getByLabelText(/^rows$/i)
    fireEvent.change(input, { target: { value: '4' } })
    expect(mockOnChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rowsPerCharacter: 4 })
    )
  })

  it('renders columns control with default selected', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    const columnsSelect = screen.getByLabelText(/^columns$/i)
    expect(columnsSelect).toBeInTheDocument()
    expect(columnsSelect).toHaveValue('8')
  })

  it('renders ghost copies control', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/^ghost copies$/i)).toBeInTheDocument()
  })

  it('orders the first three controls as rows, columns, and ghost copies', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    const selects = screen.getAllByRole('combobox')
    expect(selects.slice(0, 3).map((select) => select.getAttribute('id'))).toEqual([
      'rows-per-char',
      'columns',
      'ghost-copies',
    ])
  })

  it('does not render a paper size control', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.queryByLabelText(/paper size/i)).not.toBeInTheDocument()
  })

  it('disables ghost copy options above the selected columns', () => {
    render(
      <SheetOptions
        config={{ ...DEFAULT_SHEET_CONFIG, columns: 5, ghostCopiesPerRow: 3 }}
        onChange={mockOnChange}
      />
    )
    expect(screen.getByRole('option', { name: '5 copies' })).not.toBeDisabled()
    expect(screen.getByRole('option', { name: '6 copies' })).toBeDisabled()
  })

  it('clamps ghost copies when columns are lowered', () => {
    function Wrapper() {
      const [config, setConfig] = useState<SheetConfig>({
        ...DEFAULT_SHEET_CONFIG,
        columns: 10,
        ghostCopiesPerRow: 8,
      })

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
    fireEvent.change(screen.getByLabelText(/^columns$/i), { target: { value: '5' } })
    expect(mockOnChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ columns: 5, ghostCopiesPerRow: 5 })
    )
  })

  it('omits 10 columns for the medium font size', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)

    expect(screen.getByRole('option', { name: '3 columns' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '9 columns' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: '10 columns' })).not.toBeInTheDocument()
  })

  it('limits large font size to 3 through 7 columns', () => {
    render(
      <SheetOptions
        config={{ ...DEFAULT_SHEET_CONFIG, fontSize: 'large', columns: 7 }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByRole('option', { name: '3 columns' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '4 columns' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '5 columns' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '6 columns' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '7 columns' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: '8 columns' })).not.toBeInTheDocument()
  })

  it('exposes columns up to 12 for the small font size', () => {
    render(
      <SheetOptions
        config={{ ...DEFAULT_SHEET_CONFIG, fontSize: 'small', columns: 12 }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByRole('option', { name: '12 columns' })).toBeInTheDocument()
  })

  it('falls back to the largest allowed column value if the current config is out of range', () => {
    render(
      <SheetOptions
        config={{ ...DEFAULT_SHEET_CONFIG, fontSize: 'large', columns: 8 }}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByLabelText(/^columns$/i)).toHaveValue('7')
  })

  it('renders grid guide dropdown with 3 options', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    const gridSelect = screen.getByLabelText(/grid guide/i)
    expect(gridSelect).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    const gridOptions = options.filter((o) => o.getAttribute('value')?.match(/cross|sandwich|thai/))
    expect(gridOptions.length).toBeGreaterThanOrEqual(3)
    expect(screen.getByRole('option', { name: 'Thai' })).toBeInTheDocument()
  })

  it('renders font dropdown with default selected', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    const fontSelect = screen.getByRole('combobox', { name: /^font$/i })
    expect(fontSelect).toBeInTheDocument()
    expect(fontSelect).toHaveValue('traditional')
  })

  it('renders font size dropdown', () => {
    render(<SheetOptions config={DEFAULT_SHEET_CONFIG} onChange={mockOnChange} />)
    expect(screen.getByLabelText(/font size/i)).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Small' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Large' })).toBeInTheDocument()
  })
})
