import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Preview } from './Preview'
import { THAI_CONSONANTS } from '../data/consonants'
import { DEFAULT_SHEET_CONFIG } from '../data/sheetOptions'
import type { SheetConfig } from '../data/sheetOptions'
import { THAI_VOWELS, formatVowelWithPlaceholder } from '../data/vowels'

describe('Preview', () => {
  it('renders a preview region', () => {
    render(
      <Preview
        selectedConsonantIds={[]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )
    const region = screen.getByRole('region', { name: /preview/i })
    expect(region).toBeInTheDocument()
  })

  it('shows content when consonants are selected', () => {
    const ids = [THAI_CONSONANTS[0].id, THAI_CONSONANTS[1].id]
    render(
      <Preview
        selectedConsonantIds={ids}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )
    const region = screen.getByRole('region', { name: /preview/i })
    expect(region).toHaveTextContent(THAI_CONSONANTS[0].char)
    expect(region).toHaveTextContent(THAI_CONSONANTS[1].char)
  })

  it('shows vowels with a placeholder dash', () => {
    render(
      <Preview
        selectedConsonantIds={[]}
        selectedVowelIds={[THAI_VOWELS[0].id, THAI_VOWELS[10].id]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )
    const region = screen.getByRole('region', { name: /preview/i })
    expect(region).toHaveTextContent(formatVowelWithPlaceholder(THAI_VOWELS[0].char))
    expect(region).toHaveTextContent(formatVowelWithPlaceholder(THAI_VOWELS[10].char))
  })

  it('updates when selectedConsonantIds changes', () => {
    const { rerender } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )
    let region = screen.getByRole('region', { name: /preview/i })
    expect(region).toHaveTextContent(THAI_CONSONANTS[0].char)

    rerender(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[1].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )
    region = screen.getByRole('region', { name: /preview/i })
    expect(region).not.toHaveTextContent(`${THAI_CONSONANTS[0].char}อ ${THAI_CONSONANTS[0].name}`)
    expect(region).toHaveTextContent(`${THAI_CONSONANTS[1].char}อ ${THAI_CONSONANTS[1].name}`)
  })

  it('reflects rows per character in structure', () => {
    const config: SheetConfig = { ...DEFAULT_SHEET_CONFIG, rowsPerCharacter: 3 }
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />
    )
    const region = screen.getByRole('region', { name: /preview/i })
    expect(region).toBeInTheDocument()
    expect(region.textContent).toContain(THAI_CONSONANTS[0].char)
  })

  it('does not show paper size metadata', () => {
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )
    expect(screen.getByRole('region', { name: /preview/i })).not.toHaveTextContent('A4')
  })

  it('uses the selected columns value to size each row', () => {
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      rowsPerCharacter: 2,
      columns: 7,
      ghostCopiesPerRow: 3,
    }
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />
    )

    const rowGrids = Array.from(container.querySelectorAll('div[style*="grid-template-columns"]'))
    expect(rowGrids).toHaveLength(2)
    expect(rowGrids[0]).toHaveStyle({ gridTemplateColumns: 'repeat(7, 76px)' })
    expect(rowGrids[1]).toHaveStyle({ gridTemplateColumns: 'repeat(7, 76px)' })
  })

  it('keeps rendering the full configured column count inside the scrollable preview', () => {
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      fontSize: 'small',
      columns: 12,
      ghostCopiesPerRow: 3,
    }
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />
    )

    const rowGrid = container.querySelector('div[style*="grid-template-columns"]')
    expect(rowGrid).not.toBeNull()
    expect(rowGrid).toHaveStyle({ gridTemplateColumns: 'repeat(12, 56px)' })
    expect(container.querySelector('[data-preview-scroll="true"]')).not.toBeNull()
  })

  it('uses 100px cells for the large font size', () => {
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      rowsPerCharacter: 1,
      columns: 5,
      ghostCopiesPerRow: 2,
      fontSize: 'large',
    }
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />
    )

    const rowGrid = container.querySelector('div[style*="grid-template-columns"]')
    expect(rowGrid).not.toBeNull()
    expect(rowGrid).toHaveStyle({ gridTemplateColumns: 'repeat(5, 100px)' })
  })

  it('adds one extra ghost character after the first row', () => {
    const config: SheetConfig = {
      ...DEFAULT_SHEET_CONFIG,
      rowsPerCharacter: 2,
      columns: 10,
      ghostCopiesPerRow: 3,
    }
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />
    )

    const rowGrids = Array.from(container.querySelectorAll('div[style*="grid-template-columns"]'))
    expect(rowGrids).toHaveLength(2)
    expect(rowGrids[0].querySelectorAll('[data-char-overlay="true"]')).toHaveLength(4)
    expect(rowGrids[1].querySelectorAll('[data-char-overlay="true"]')).toHaveLength(4)
  })

  it('shows the semantic font label in preview metadata', () => {
    const config: SheetConfig = { ...DEFAULT_SHEET_CONFIG, font: 'modern' }
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />
    )

    expect(screen.getByRole('region', { name: /preview/i })).toHaveTextContent('Modern')
  })

  it('centers character overlays both vertically and horizontally', () => {
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )

    const overlay = container.querySelector('[data-char-overlay="true"]')
    expect(overlay).not.toBeNull()
    expect(overlay).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })

    const inner = overlay?.querySelector('span')
    expect(inner).not.toBeNull()
    expect(inner).toHaveStyle({ textAlign: 'center' })
  })

  it('keeps vowels inside the same centered overlay container', () => {
    const { container } = render(
      <Preview
        selectedConsonantIds={[]}
        selectedVowelIds={[THAI_VOWELS[0].id]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )

    const overlay = container.querySelector('[data-char-overlay="true"]')
    expect(overlay).not.toBeNull()
    expect(overlay).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })
    expect(overlay?.textContent).toContain(formatVowelWithPlaceholder(THAI_VOWELS[0].char))
  })

  it('marks Thai preview text as non-translatable', () => {
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[THAI_VOWELS[0].id]}
        config={DEFAULT_SHEET_CONFIG}
      />
    )

    const worksheetTitle = Array.from(container.querySelectorAll('h3')).find(
      (node) => node.textContent === 'แบบฝึกหัดเขียนอักษรไทย'
    )
    const consonantGlyph = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === THAI_CONSONANTS[0].char
    )
    const consonantName = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === `${THAI_CONSONANTS[0].char}อ ${THAI_CONSONANTS[0].name}`
    )
    const vowelGlyphWrapper = container.querySelector(
      '[aria-hidden="true"][translate="no"][lang="th"]'
    )

    expect(worksheetTitle).toHaveAttribute('translate', 'no')
    expect(worksheetTitle).toHaveAttribute('lang', 'th')
    expect(consonantGlyph).toHaveAttribute('translate', 'no')
    expect(consonantGlyph).toHaveAttribute('lang', 'th')
    expect(consonantName).toHaveAttribute('translate', 'no')
    expect(consonantName).toHaveAttribute('lang', 'th')
    expect(vowelGlyphWrapper).not.toBeNull()
  })

  it('renders the preview inside a horizontal scroll container', () => {
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={{ ...DEFAULT_SHEET_CONFIG, fontSize: 'small', columns: 12 }}
      />
    )

    const scrollContainer = container.querySelector('[data-preview-scroll="true"]')
    expect(scrollContainer).not.toBeNull()
    expect(scrollContainer).toHaveClass('overflow-x-auto')
  })

  it('does not render a horizontal-scroll warning message', () => {
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={{ ...DEFAULT_SHEET_CONFIG, fontSize: 'small', columns: 12 }}
      />
    )

    expect(screen.queryByText(/scroll sideways to view all columns/i)).not.toBeInTheDocument()
  })
})
