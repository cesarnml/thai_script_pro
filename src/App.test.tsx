import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders app title Thai Script Pro', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /thai script pro/i })).toBeInTheDocument()
  })

  it('renders content selection, sheet options, preview, and output actions', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /consonants/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/rows per character/i)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /preview/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
  })
})
