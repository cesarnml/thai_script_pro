import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { VowelDisplay } from '@/components/VowelDisplay'

const COMBINING_MARKS = new Set(['ั', 'ิ', 'ี', 'ึ', 'ื', '็', 'ํ', 'ุ', 'ู'])

function getLeafSpans(container: HTMLElement) {
  const ariaHidden = container.querySelector('[aria-hidden="true"]')!
  return Array.from(ariaHidden.querySelectorAll('span')).filter(
    (s) => s.children.length === 0,
  )
}

describe('VowelDisplay', () => {
  const GLYPH = 'glyph-cls'
  const PLACEHOLDER = 'placeholder-cls'

  it('renders placeholder อ with placeholderClassName for a simple suffix vowel (ะ)', () => {
    const { container } = render(
      <VowelDisplay
        char="ะ"
        glyphClassName={GLYPH}
        placeholderClassName={PLACEHOLDER}
      />,
    )
    const spans = getLeafSpans(container)
    const placeholder = spans.find((s) => s.textContent === 'อ')
    expect(placeholder).toBeDefined()
    expect(placeholder!.className).toContain(PLACEHOLDER)
    expect(placeholder!.className).not.toContain(GLYPH)
  })

  it('renders composite glyph with upper mark in glyphClassName (ิ)', () => {
    const { container } = render(
      <VowelDisplay
        char="ิ"
        glyphClassName={GLYPH}
        placeholderClassName={PLACEHOLDER}
      />,
    )
    const spans = getLeafSpans(container)
    const glyph = spans.find((s) => s.textContent === 'อิ')
    expect(glyph).toBeDefined()
    expect(glyph!.className).toContain(GLYPH)
  })

  it('renders composite glyph with lower mark in glyphClassName (ุ)', () => {
    const { container } = render(
      <VowelDisplay
        char="ุ"
        glyphClassName={GLYPH}
        placeholderClassName={PLACEHOLDER}
      />,
    )
    const spans = getLeafSpans(container)
    const glyph = spans.find((s) => s.textContent === 'อุ')
    expect(glyph).toBeDefined()
    expect(glyph!.className).toContain(GLYPH)
  })

  it('renders prefix with glyphClassName (เ)', () => {
    const { container } = render(
      <VowelDisplay
        char="เ"
        glyphClassName={GLYPH}
        placeholderClassName={PLACEHOLDER}
      />,
    )
    const spans = getLeafSpans(container)
    const prefix = spans.find((s) => s.textContent === 'เ')
    expect(prefix).toBeDefined()
    expect(prefix!.className).toContain(GLYPH)
  })

  it('renders suffix with glyphClassName (า in ำ)', () => {
    const { container } = render(
      <VowelDisplay
        char="ำ"
        glyphClassName={GLYPH}
        placeholderClassName={PLACEHOLDER}
      />,
    )
    const spans = getLeafSpans(container)
    const suffix = spans.find((s) => s.textContent === 'า')
    expect(suffix).toBeDefined()
    expect(suffix!.className).toContain(GLYPH)
  })

  it('placeholder overlay uses placeholderClassName for all vowels with marks', () => {
    const vowelsWithMarks = ['ั', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู']
    for (const char of vowelsWithMarks) {
      const { container } = render(
        <VowelDisplay
          char={char}
          glyphClassName={GLYPH}
          placeholderClassName={PLACEHOLDER}
        />,
      )
      const spans = getLeafSpans(container)
      const placeholder = spans.find(
        (s) => s.textContent === 'อ' && s.className.includes(PLACEHOLDER),
      )
      expect(
        placeholder,
        `placeholder อ overlay missing for vowel ${char}`,
      ).toBeDefined()
      expect(placeholder!.className).not.toContain(GLYPH)
    }
  })

  it('combining marks are never in a standalone span (no dotted circle)', () => {
    const vowelsWithMarks = ['ั', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'ำ']
    for (const char of vowelsWithMarks) {
      const { container } = render(
        <VowelDisplay
          char={char}
          glyphClassName={GLYPH}
          placeholderClassName={PLACEHOLDER}
        />,
      )
      for (const span of getLeafSpans(container)) {
        const text = span.textContent || ''
        const firstChar = Array.from(text)[0]
        expect(
          COMBINING_MARKS.has(firstChar),
          `Span text "${text}" for vowel ${char} starts with a combining mark — would render a dotted circle`,
        ).toBe(false)
      }
    }
  })

  it('marks the visible Thai glyph wrapper as non-translatable', () => {
    const { container } = render(<VowelDisplay char="ะ" />)
    const visibleGlyphWrapper = container.querySelector('[aria-hidden="true"]')

    expect(visibleGlyphWrapper).toHaveAttribute('translate', 'no')
    expect(visibleGlyphWrapper).toHaveAttribute('lang', 'th')
  })
})
