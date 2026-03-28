import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Preview } from './Preview'
import { THAI_CONSONANTS } from '../data/consonants'
import { DEFAULT_SHEET_CONFIG } from '../data/sheetOptions'
import { THAI_VOWELS, formatVowelWithPlaceholder } from '../data/vowels'

describe('Preview', () => {
  it('shows an empty-state prompt when no characters are selected', () => {
    render(
      <Preview
        selectedConsonantIds={[]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />,
    )

    expect(
      screen.getByText(/select consonants or vowels to see preview/i),
    ).toBeInTheDocument()
  })

  it('renders a preview region', () => {
    render(
      <Preview
        selectedConsonantIds={[]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />,
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
      />,
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
      />,
    )
    const region = screen.getByRole('region', { name: /preview/i })
    expect(region).toHaveTextContent(
      formatVowelWithPlaceholder(THAI_VOWELS[0].char),
    )
    expect(region).toHaveTextContent(
      formatVowelWithPlaceholder(THAI_VOWELS[10].char),
    )
  })

  it('updates when selectedConsonantIds changes', () => {
    const { rerender } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />,
    )
    let region = screen.getByRole('region', { name: /preview/i })
    expect(region).toHaveTextContent(THAI_CONSONANTS[0].char)

    rerender(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[1].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />,
    )
    region = screen.getByRole('region', { name: /preview/i })
    expect(region).not.toHaveTextContent(
      `${THAI_CONSONANTS[0].char}อ ${THAI_CONSONANTS[0].name}`,
    )
    expect(region).toHaveTextContent(
      `${THAI_CONSONANTS[1].char}อ ${THAI_CONSONANTS[1].name}`,
    )
  })

  it('does not show paper size metadata', () => {
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={DEFAULT_SHEET_CONFIG}
      />,
    )
    expect(
      screen.getByRole('region', { name: /preview/i }),
    ).not.toHaveTextContent('A4')
  })

  it('shows the semantic font label in preview metadata', () => {
    const config = { ...DEFAULT_SHEET_CONFIG, font: 'modern' }
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={config}
      />,
    )

    expect(screen.getByRole('region', { name: /preview/i })).toHaveTextContent(
      'Modern',
    )
  })

  it('marks Thai preview text as non-translatable', () => {
    const { container } = render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[THAI_VOWELS[0].id]}
        config={DEFAULT_SHEET_CONFIG}
      />,
    )

    const worksheetTitle = Array.from(container.querySelectorAll('h3')).find(
      (node) => node.textContent === 'Thai Script Pro',
    )
    const consonantGlyph = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === THAI_CONSONANTS[0].char,
    )
    const consonantName = Array.from(container.querySelectorAll('span')).find(
      (node) =>
        node.textContent ===
        `${THAI_CONSONANTS[0].char}อ ${THAI_CONSONANTS[0].name}`,
    )
    const vowelGlyphWrapper = container.querySelector(
      '[aria-hidden="true"][translate="no"][lang="th"]',
    )

    expect(worksheetTitle).toHaveAttribute('translate', 'no')
    expect(consonantGlyph).toHaveAttribute('translate', 'no')
    expect(consonantGlyph).toHaveAttribute('lang', 'th')
    expect(consonantName).toHaveAttribute('translate', 'no')
    expect(consonantName).toHaveAttribute('lang', 'th')
    expect(vowelGlyphWrapper).not.toBeNull()
  })

  it('does not render a horizontal-scroll warning message', () => {
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[]}
        config={{ ...DEFAULT_SHEET_CONFIG, fontSize: 'small', columns: 12 }}
      />,
    )

    expect(
      screen.queryByText(/scroll sideways to view all columns/i),
    ).not.toBeInTheDocument()
  })

  it('summarizes mixed selections in the preview metadata', () => {
    render(
      <Preview
        selectedConsonantIds={[THAI_CONSONANTS[0].id]}
        selectedVowelIds={[THAI_VOWELS[0].id]}
        config={DEFAULT_SHEET_CONFIG}
      />,
    )

    const region = screen.getByRole('region', { name: /preview/i })
    expect(region).toHaveTextContent(/2 characters/i)
    expect(region).toHaveTextContent(/thai characters writing practice/i)
  })
})
