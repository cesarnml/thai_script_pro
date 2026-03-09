import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  const originalPrint = window.print

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    window.print = originalPrint
    document.body.classList.remove('print-preview-active')
  })

  it('renders app title Thai Script Pro', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /thai script pro/i })).toBeInTheDocument()
  })

  it('renders content selection, sheet options, preview, and output actions', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /consonants/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^rows$/i)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
  })

  it('prints only the preview using print mode', async () => {
    const user = userEvent.setup()
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    window.print = vi.fn()

    render(<App />)
    await user.click(screen.getByRole('button', { name: /print/i }))

    expect(document.body.classList.contains('print-preview-active')).toBe(true)
    expect(addEventListenerSpy).toHaveBeenCalledWith('afterprint', expect.any(Function), {
      once: true,
    })
    expect(window.print).toHaveBeenCalledTimes(1)
  })
})
