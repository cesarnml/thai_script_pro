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
    expect(rowGrids[0]).toHaveStyle({ gridTemplateColumns: 'repeat(7, 64px)' })
    expect(rowGrids[1]).toHaveStyle({ gridTemplateColumns: 'repeat(7, 64px)' })
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
})
