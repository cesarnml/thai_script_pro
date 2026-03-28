import { useState, useCallback } from 'react'
import {
  THAI_CONSONANTS,
  getConsonantPresetById,
  getConsonantPresetTriggerLabel,
  type ThaiConsonantPreset,
} from '../data/consonants'
import {
  THAI_VOWELS,
  getVowelPresetById,
  getVowelPresetTriggerLabel,
  type ThaiVowelPreset,
} from '../data/vowels'

export function useContentSelection() {
  const [selectedConsonantIds, setSelectedConsonantIds] = useState<Set<string>>(
    new Set(),
  )
  const [selectedVowelIds, setSelectedVowelIds] = useState<Set<string>>(
    new Set(),
  )

  const toggleConsonant = useCallback((id: string) => {
    setSelectedConsonantIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleVowel = useCallback((id: string) => {
    setSelectedVowelIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAllConsonants = useCallback(() => {
    setSelectedConsonantIds(new Set(THAI_CONSONANTS.map((c) => c.id)))
  }, [])

  const clearConsonants = useCallback(() => {
    setSelectedConsonantIds(new Set())
  }, [])

  const applyConsonantPreset = useCallback(
    (presetId: ThaiConsonantPreset['id']) => {
      const preset = getConsonantPresetById(presetId)
      if (!preset) return

      setSelectedConsonantIds((prev) => {
        const next = new Set(prev)

        const isApplied = preset.consonantIds.every((id) => next.has(id))

        preset.consonantIds.forEach((id) => {
          if (isApplied) next.delete(id)
          else next.add(id)
        })

        return next
      })
    },
    [],
  )

  const selectAllVowels = useCallback(() => {
    setSelectedVowelIds(new Set(THAI_VOWELS.map((v) => v.id)))
  }, [])

  const applyVowelPreset = useCallback((presetId: ThaiVowelPreset['id']) => {
    const preset = getVowelPresetById(presetId)
    if (!preset) return

    setSelectedVowelIds((prev) => {
      const next = new Set(prev)
      const isApplied = preset.vowelIds.every((id) => next.has(id))

      preset.vowelIds.forEach((id) => {
        if (isApplied) next.delete(id)
        else next.add(id)
      })

      return next
    })
  }, [])

  const clearVowels = useCallback(() => {
    setSelectedVowelIds(new Set())
  }, [])

  return {
    selectedConsonantIds: Array.from(selectedConsonantIds),
    selectedVowelIds: Array.from(selectedVowelIds),
    activeConsonantPresetLabel: getConsonantPresetTriggerLabel(
      Array.from(selectedConsonantIds),
    ),
    activeVowelPresetLabel: getVowelPresetTriggerLabel(
      Array.from(selectedVowelIds),
    ),
    toggleConsonant,
    toggleVowel,
    applyConsonantPreset,
    applyVowelPreset,
    selectAllConsonants,
    clearConsonants,
    selectAllVowels,
    clearVowels,
  }
}
