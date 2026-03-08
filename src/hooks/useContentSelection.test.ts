import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContentSelection } from './useContentSelection'
import { THAI_CONSONANTS } from '../data/consonants'
import { THAI_VOWELS } from '../data/vowels'

describe('useContentSelection', () => {
  it('starts with no consonants or vowels selected', () => {
    const { result } = renderHook(() => useContentSelection())
    expect(result.current.selectedConsonantIds).toHaveLength(0)
    expect(result.current.selectedVowelIds).toHaveLength(0)
  })

  it('toggleConsonant adds and removes a consonant', () => {
    const { result } = renderHook(() => useContentSelection())
    const id = THAI_CONSONANTS[0].id

    act(() => {
      result.current.toggleConsonant(id)
    })
    expect(result.current.selectedConsonantIds).toContain(id)

    act(() => {
      result.current.toggleConsonant(id)
    })
    expect(result.current.selectedConsonantIds).not.toContain(id)
  })

  it('selectAllConsonants selects all 44', () => {
    const { result } = renderHook(() => useContentSelection())
    act(() => {
      result.current.selectAllConsonants()
    })
    expect(result.current.selectedConsonantIds).toHaveLength(44)
  })

  it('clearConsonants clears all consonants', () => {
    const { result } = renderHook(() => useContentSelection())
    act(() => {
      result.current.selectAllConsonants()
    })
    act(() => {
      result.current.clearConsonants()
    })
    expect(result.current.selectedConsonantIds).toHaveLength(0)
  })

  it('toggleVowel adds and removes a vowel', () => {
    const { result } = renderHook(() => useContentSelection())
    const id = THAI_VOWELS[0].id

    act(() => {
      result.current.toggleVowel(id)
    })
    expect(result.current.selectedVowelIds).toContain(id)

    act(() => {
      result.current.toggleVowel(id)
    })
    expect(result.current.selectedVowelIds).not.toContain(id)
  })

  it('selectAllVowels and clearVowels work', () => {
    const { result } = renderHook(() => useContentSelection())
    act(() => {
      result.current.selectAllVowels()
    })
    expect(result.current.selectedVowelIds.length).toBe(THAI_VOWELS.length)

    act(() => {
      result.current.clearVowels()
    })
    expect(result.current.selectedVowelIds).toHaveLength(0)
  })
})
