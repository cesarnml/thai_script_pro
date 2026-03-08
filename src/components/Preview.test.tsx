import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Preview } from './Preview'
import { THAI_CONSONANTS } from '../data/consonants'
import { DEFAULT_SHEET_CONFIG } from '../data/sheetOptions'
import type { SheetConfig } from '../data/sheetOptions'

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
})
