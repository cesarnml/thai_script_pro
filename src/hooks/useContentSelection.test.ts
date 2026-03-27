import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContentSelection } from './useContentSelection'
import { THAI_CONSONANTS, getConsonantPresetById } from '../data/consonants'
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

  it('applyConsonantPreset adds a preset to an empty selection', () => {
    const { result } = renderHook(() => useContentSelection())
    const preset = getConsonantPresetById('LCG1')
    if (!preset) throw new Error('Expected LCG1 preset to exist')

    act(() => {
      result.current.applyConsonantPreset('LCG1')
    })

    expect(result.current.selectedConsonantIds.sort()).toEqual([...preset.consonantIds].sort())
    expect(result.current.activeConsonantPresetLabel).toBe('Low Class - Group 1')
  })

  it('applyConsonantPreset removes a preset when clicked again', () => {
    const { result } = renderHook(() => useContentSelection())

    act(() => {
      result.current.applyConsonantPreset('LCG1')
    })
    act(() => {
      result.current.applyConsonantPreset('LCG1')
    })

    expect(result.current.selectedConsonantIds).toHaveLength(0)
    expect(result.current.activeConsonantPresetLabel).toBe('Presets')
  })

  it('applyConsonantPreset merges with existing consonant selection and removes only the toggled group', () => {
    const { result } = renderHook(() => useContentSelection())
    const lcg1 = getConsonantPresetById('LCG1')
    const mc = getConsonantPresetById('MC')
    if (!lcg1 || !mc) throw new Error('Expected presets to exist')

    act(() => {
      result.current.applyConsonantPreset('LCG1')
      result.current.applyConsonantPreset('MC')
    })

    expect(new Set(result.current.selectedConsonantIds)).toEqual(
      new Set([...lcg1.consonantIds, ...mc.consonantIds])
    )
    expect(result.current.activeConsonantPresetLabel).toBe('Custom')

    act(() => {
      result.current.applyConsonantPreset('MC')
    })

    expect(new Set(result.current.selectedConsonantIds)).toEqual(new Set(lcg1.consonantIds))
    expect(result.current.activeConsonantPresetLabel).toBe('Low Class - Group 1')
  })

  it('applyConsonantPreset removes a fully selected preset from a custom selection', () => {
    const { result } = renderHook(() => useContentSelection())
    const lcg1 = getConsonantPresetById('LCG1')
    const extraId = THAI_CONSONANTS[0].id
    if (!lcg1) throw new Error('Expected LCG1 preset to exist')

    act(() => {
      result.current.applyConsonantPreset('LCG1')
      result.current.toggleConsonant(extraId)
    })

    expect(result.current.activeConsonantPresetLabel).toBe('Custom')

    act(() => {
      result.current.applyConsonantPreset('LCG1')
    })

    expect(result.current.selectedConsonantIds).toEqual([extraId])
    expect(result.current.activeConsonantPresetLabel).toBe('Custom')
  })

  it('clearConsonants clears consonants added by presets', () => {
    const { result } = renderHook(() => useContentSelection())

    act(() => {
      result.current.applyConsonantPreset('HC')
    })
    act(() => {
      result.current.clearConsonants()
    })

    expect(result.current.selectedConsonantIds).toHaveLength(0)
    expect(result.current.activeConsonantPresetLabel).toBe('Presets')
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
