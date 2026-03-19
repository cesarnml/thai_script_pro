import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContentSelection } from './ContentSelection'
import { THAI_CONSONANTS } from '../data/consonants'
import { THAI_VOWELS, formatVowelWithPlaceholder } from '../data/vowels'

describe('ContentSelection', () => {
  it('renders a Consonants section with heading', () => {
    render(<ContentSelection />)
    expect(screen.getByRole('heading', { name: /consonants/i })).toBeInTheDocument()
  })

  it('renders all 44 consonant items', () => {
    const { container } = render(<ContentSelection />)
    const consonantGrid = container.querySelector('[data-consonant-grid="true"]')
    if (!consonantGrid) throw new Error('Expected consonant grid to be rendered')
    const buttons = consonantGrid.querySelectorAll('button')
    expect(buttons).toHaveLength(44)
  })

  it('uses a 55px minimum width for consonant cells on smaller screens', () => {
    const { container } = render(<ContentSelection />)
    const consonantGrid = container.querySelector('[data-consonant-grid="true"]')

    if (!consonantGrid) throw new Error('Expected consonant grid to be rendered')
    expect(consonantGrid).toHaveClass(
      '[grid-template-columns:repeat(auto-fit,minmax(55px,1fr))]'
    )
  })

  it('clicking a consonant toggles selection and updates summary', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    const summary = screen.getByText(/0 consonants.*0 vowels selected/i)
    expect(summary).toBeInTheDocument()

    const firstConsonant = THAI_CONSONANTS[0]
    const buttons = screen.getAllByRole('button', { name: new RegExp(`^${firstConsonant.char}`) })
    await user.click(buttons[0])

    expect(screen.getByText(/1 consonants?/i)).toBeInTheDocument()
  })

  it('Select all consonants button selects all 44', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    const selectAllBtn = screen.getByRole('button', { name: /select all.*consonant/i })
    await user.click(selectAllBtn)
    expect(screen.getByText(/44 consonants?/i)).toBeInTheDocument()
  })

  it('Clear consonants button clears selection', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    await user.click(screen.getByRole('button', { name: /select all.*consonant/i }))
    await user.click(screen.getByRole('button', { name: /clear.*consonant/i }))
    expect(screen.getByText(/0 consonants?/i)).toBeInTheDocument()
  })

  it('renders Vowels section and summary shows vowels count', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    expect(screen.getByRole('heading', { name: /vowels/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /select all.*vowel/i }))
    expect(screen.getByText(new RegExp(`${THAI_VOWELS.length} vowels?`, 'i'))).toBeInTheDocument()
  })

  it('shows vowels with a placeholder dash', () => {
    render(<ContentSelection />)
    expect(screen.getByRole('button', { name: formatVowelWithPlaceholder('ะ') })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: formatVowelWithPlaceholder('เ') })).toBeInTheDocument()
  })

  it('applies the selected font family to consonant and vowel buttons', () => {
    render(<ContentSelection fontFamily='"Prompt", sans-serif' />)

    expect(screen.getAllByRole('button', { name: /^ก/ })[0]).toHaveStyle({
      fontFamily: '"Prompt", sans-serif',
    })
    expect(screen.getByRole('button', { name: formatVowelWithPlaceholder('ะ') })).toHaveStyle({
      fontFamily: '"Prompt", sans-serif',
    })
  })

  it('marks visible Thai consonant glyphs and names as non-translatable', () => {
    const { container } = render(<ContentSelection />)
    const firstConsonant = THAI_CONSONANTS[0]

    const glyph = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === firstConsonant.char
    )
    const name = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === firstConsonant.name
    )

    expect(glyph).toHaveAttribute('translate', 'no')
    expect(glyph).toHaveAttribute('lang', 'th')
    expect(name).toHaveAttribute('translate', 'no')
    expect(name).toHaveAttribute('lang', 'th')
  })
})
