import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { THAI_CONSONANTS, getConsonantPresetById } from '@/data/consonants'
import {
  THAI_VOWELS,
  formatVowelWithPlaceholder,
  getVowelPresetById,
} from '@/data/vowels'
import { ContentSelection } from '@/components/ContentSelection'

describe('ContentSelection', () => {
  it('renders a Consonants section with heading', () => {
    render(<ContentSelection />)
    expect(
      screen.getByRole('heading', { name: /consonants/i }),
    ).toBeInTheDocument()
  })

  it('renders all 44 consonant items', () => {
    const { container } = render(<ContentSelection />)
    const consonantGrid = container.querySelector(
      '[data-consonant-grid="true"]',
    )
    if (!consonantGrid)
      throw new Error('Expected consonant grid to be rendered')
    const buttons = consonantGrid.querySelectorAll('button')
    expect(buttons).toHaveLength(44)
  })

  it('clicking a consonant toggles selection and updates summary', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    const summary = screen.getByText(/0 consonants.*0 vowels selected/i)
    expect(summary).toBeInTheDocument()

    const firstConsonant = THAI_CONSONANTS[0]
    const buttons = screen.getAllByRole('button', {
      name: new RegExp(`^${firstConsonant.char}`),
    })
    await user.click(buttons[0])

    expect(screen.getByText(/1 consonants?/i)).toBeInTheDocument()
  })

  it('Select all consonants button selects all 44', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    const selectAllBtn = screen.getByRole('button', {
      name: /select all.*consonant/i,
    })
    await user.click(selectAllBtn)
    expect(screen.getByText(/44 consonants?/i)).toBeInTheDocument()
  })

  it('Clear consonants button clears selection', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    await user.click(
      screen.getByRole('button', { name: /select all.*consonant/i }),
    )
    await user.click(screen.getByRole('button', { name: /clear.*consonant/i }))
    expect(screen.getByText(/0 consonants?/i)).toBeInTheDocument()
  })

  it('renders a presets dropdown for consonants', () => {
    render(<ContentSelection />)
    expect(
      screen.getByRole('button', { name: /consonant presets/i }),
    ).toHaveTextContent('Presets')
  })

  it('shows all preset options with their full labels when opened', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))

    expect(
      screen.getByRole('listbox', { name: /consonant preset options/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    ).toHaveAttribute('title', 'Low Class Consonants - Unpaired')
    expect(
      screen.getByRole('option', { name: /Low Class - Group 2/i }),
    ).toHaveAttribute('title', 'Low Class Consonants - Paired')
    expect(
      screen.getByRole('option', { name: /^Middle Class/i }),
    ).toHaveAttribute('title', 'Middle Class Consonants')
    expect(
      screen.getByRole('option', { name: /^High Class/i }),
    ).toHaveAttribute('title', 'High Class Consonants')
    expect(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    ).toHaveClass('border', 'border-transparent')
  })

  it('selecting LCG1 marks the expected consonants selected', async () => {
    const user = userEvent.setup()
    const lcg1 = getConsonantPresetById('LCG1')
    if (!lcg1) throw new Error('Expected LCG1 preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    )

    expect(
      screen.getByRole('button', { name: /consonant presets/i }),
    ).toHaveTextContent('Low Class - Group 1')
    expect(
      screen.getByText(
        new RegExp(
          `${lcg1.consonantIds.length} of ${THAI_CONSONANTS.length} selected`,
          'i',
        ),
      ),
    ).toBeInTheDocument()

    lcg1.consonantIds.forEach((id) => {
      expect(
        screen.getAllByRole('button', { name: new RegExp(`^${id}`) })[0],
      ).toHaveAttribute('aria-pressed', 'true')
    })
  })

  it('closes the consonant presets menu when clicking outside it', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)

    const trigger = screen.getByRole('button', { name: /consonant presets/i })
    await user.click(trigger)

    expect(
      screen.getByRole('listbox', { name: /consonant preset options/i }),
    ).toBeInTheDocument()

    await user.click(document.body)

    expect(
      screen.queryByRole('listbox', { name: /consonant preset options/i }),
    ).not.toBeInTheDocument()
  })

  it('clicking a checked preset row deselects that group', async () => {
    const user = userEvent.setup()
    const lcg1 = getConsonantPresetById('LCG1')
    if (!lcg1) throw new Error('Expected LCG1 preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    )
    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    )

    expect(
      screen.getByRole('button', { name: /consonant presets/i }),
    ).toHaveTextContent('Presets')
    expect(
      screen.getByText(
        new RegExp(`0 of ${THAI_CONSONANTS.length} selected`, 'i'),
      ),
    ).toBeInTheDocument()

    lcg1.consonantIds.forEach((id) => {
      expect(
        screen.getAllByRole('button', { name: new RegExp(`^${id}`) })[0],
      ).toHaveAttribute('aria-pressed', 'false')
    })
  })

  it('selecting LCG1 then MC merges both preset groups', async () => {
    const user = userEvent.setup()
    const lcg1 = getConsonantPresetById('LCG1')
    const mc = getConsonantPresetById('MC')
    if (!lcg1 || !mc) throw new Error('Expected presets to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    )
    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(screen.getByRole('option', { name: /^Middle Class/i }))

    expect(
      screen.getByRole('button', { name: /consonant presets/i }),
    ).toHaveTextContent('Custom')
    expect(
      screen.getByText(
        new RegExp(
          `${lcg1.consonantIds.length + mc.consonantIds.length} of ${THAI_CONSONANTS.length} selected`,
          'i',
        ),
      ),
    ).toBeInTheDocument()
  })

  it('falls back to Custom after manually editing a preset-applied selection', async () => {
    const user = userEvent.setup()
    const lcg1 = getConsonantPresetById('LCG1')
    if (!lcg1) throw new Error('Expected LCG1 preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    )
    await user.click(screen.getAllByRole('button', { name: /^ก/ })[0])

    expect(
      screen.getByRole('button', { name: /consonant presets/i }),
    ).toHaveTextContent('Custom')
    expect(
      screen.getByText(
        new RegExp(
          `${lcg1.consonantIds.length + 1} of ${THAI_CONSONANTS.length} selected`,
          'i',
        ),
      ),
    ).toBeInTheDocument()
  })

  it('keeps a preset row checked in Custom state and lets the user toggle it off', async () => {
    const user = userEvent.setup()
    const lcg1 = getConsonantPresetById('LCG1')
    if (!lcg1) throw new Error('Expected LCG1 preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    await user.click(
      screen.getByRole('option', { name: /Low Class - Group 1/i }),
    )
    await user.click(screen.getAllByRole('button', { name: /^ก/ })[0])

    await user.click(screen.getByRole('button', { name: /consonant presets/i }))
    const presetOption = screen.getByRole('option', {
      name: /Low Class - Group 1/i,
    })
    expect(presetOption).toHaveAttribute('aria-selected', 'true')

    await user.click(presetOption)

    expect(
      screen.getByRole('button', { name: /consonant presets/i }),
    ).toHaveTextContent('Custom')
    expect(
      screen.getByText(
        new RegExp(`1 of ${THAI_CONSONANTS.length} selected`, 'i'),
      ),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^ก/ })[0]).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('renders Vowels section and summary shows vowels count', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)
    expect(screen.getByRole('heading', { name: /vowels/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /select all.*vowel/i }))
    expect(
      screen.getByText(new RegExp(`${THAI_VOWELS.length} vowels?`, 'i')),
    ).toBeInTheDocument()
  })

  it('renders a presets dropdown for vowels', () => {
    render(<ContentSelection />)
    expect(
      screen.getByRole('button', { name: /vowel presets/i }),
    ).toHaveTextContent('Presets')
  })

  it('shows all vowel preset options with their full labels when opened', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))

    expect(
      screen.getByRole('listbox', { name: /vowel preset options/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', { name: /^Short Vowels/i }),
    ).toHaveAttribute('title', 'Short-duration vowel forms')
    expect(
      screen.getByRole('option', { name: /^Long Vowels/i }),
    ).toHaveAttribute('title', 'Long-duration vowel forms')
    expect(
      screen.queryByRole('option', { name: /^Monophthongs/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: /^Diphthongs/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: /^Form-Changing/i }),
    ).not.toBeInTheDocument()
  })

  it('closes the vowel presets menu when pressing Escape', async () => {
    const user = userEvent.setup()
    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    expect(
      screen.getByRole('listbox', { name: /vowel preset options/i }),
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(
      screen.queryByRole('listbox', { name: /vowel preset options/i }),
    ).not.toBeInTheDocument()
  })

  it('selecting a vowel preset marks the expected vowels selected', async () => {
    const user = userEvent.setup()
    const short = getVowelPresetById('SHORT')
    if (!short) throw new Error('Expected SHORT preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    await user.click(screen.getByRole('option', { name: /^Short Vowels/i }))

    expect(
      screen.getByRole('button', { name: /vowel presets/i }),
    ).toHaveTextContent('Short Vowels')
    expect(
      screen.getByText(
        new RegExp(
          `${short.vowelIds.length} of ${THAI_VOWELS.length} selected`,
          'i',
        ),
      ),
    ).toBeInTheDocument()

    short.vowelIds.forEach((id) => {
      expect(
        screen.getByRole('button', { name: formatVowelWithPlaceholder(id) }),
      ).toHaveAttribute('aria-pressed', 'true')
    })
  })

  it('selecting short then long vowel presets yields Custom', async () => {
    const user = userEvent.setup()
    const short = getVowelPresetById('SHORT')
    const long = getVowelPresetById('LONG')
    if (!short || !long) throw new Error('Expected vowel presets to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    await user.click(screen.getByRole('option', { name: /^Short Vowels/i }))
    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    await user.click(screen.getByRole('option', { name: /^Long Vowels/i }))

    expect(
      screen.getByRole('button', { name: /vowel presets/i }),
    ).toHaveTextContent('Custom')
    expect(
      screen.getByText(
        new RegExp(
          `${new Set([...short.vowelIds, ...long.vowelIds]).size} of ${THAI_VOWELS.length} selected`,
          'i',
        ),
      ),
    ).toBeInTheDocument()
  })

  it('clicking a checked vowel preset row deselects that group', async () => {
    const user = userEvent.setup()
    const short = getVowelPresetById('SHORT')
    if (!short) throw new Error('Expected SHORT preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    await user.click(screen.getByRole('option', { name: /^Short Vowels/i }))
    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    await user.click(screen.getByRole('option', { name: /^Short Vowels/i }))

    expect(
      screen.getByRole('button', { name: /vowel presets/i }),
    ).toHaveTextContent('Presets')
    expect(
      screen.getByText(new RegExp(`0 of ${THAI_VOWELS.length} selected`, 'i')),
    ).toBeInTheDocument()

    short.vowelIds.forEach((id) => {
      expect(
        screen.getByRole('button', { name: formatVowelWithPlaceholder(id) }),
      ).toHaveAttribute('aria-pressed', 'false')
    })
  })

  it('keeps a vowel preset row checked in Custom state and lets the user toggle it off', async () => {
    const user = userEvent.setup()
    const short = getVowelPresetById('SHORT')
    if (!short) throw new Error('Expected SHORT preset to exist')

    render(<ContentSelection />)

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    await user.click(screen.getByRole('option', { name: /^Short Vowels/i }))
    await user.click(
      screen.getByRole('button', {
        name: new RegExp(`^${formatVowelWithPlaceholder('า')}$`),
      }),
    )

    await user.click(screen.getByRole('button', { name: /vowel presets/i }))
    const presetOption = screen.getByRole('option', { name: /^Short Vowels/i })
    expect(presetOption).toHaveAttribute('aria-selected', 'true')

    await user.click(presetOption)

    expect(
      screen.getByRole('button', { name: /vowel presets/i }),
    ).toHaveTextContent('Custom')
    expect(
      screen.getByText(new RegExp(`1 of ${THAI_VOWELS.length} selected`, 'i')),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: new RegExp(`^${formatVowelWithPlaceholder('า')}$`),
      }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows vowels with a placeholder dash', () => {
    render(<ContentSelection />)
    expect(
      screen.getByRole('button', { name: formatVowelWithPlaceholder('ะ') }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: formatVowelWithPlaceholder('เ') }),
    ).toBeInTheDocument()
  })

  it('marks visible Thai consonant glyphs as non-translatable', () => {
    const { container } = render(<ContentSelection />)
    const firstConsonant = THAI_CONSONANTS[0]

    const glyph = Array.from(container.querySelectorAll('span')).find(
      (node) => node.textContent === firstConsonant.char,
    )

    expect(glyph).toHaveAttribute('translate', 'no')
    expect(glyph).toHaveAttribute('lang', 'th')
  })
})
