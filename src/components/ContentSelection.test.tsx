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
    const consonantGrid = container.querySelectorAll('.grid.grid-cols-10')[0]
    const buttons = consonantGrid.querySelectorAll('button')
    expect(buttons).toHaveLength(44)
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
})
