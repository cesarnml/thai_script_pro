import { useState, useCallback } from 'react'
import { THAI_CONSONANTS } from '../data/consonants'
import { THAI_VOWELS } from '../data/vowels'

export function useContentSelection() {
  const [selectedConsonantIds, setSelectedConsonantIds] = useState<Set<string>>(new Set())
  const [selectedVowelIds, setSelectedVowelIds] = useState<Set<string>>(new Set())

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

  const selectAllVowels = useCallback(() => {
    setSelectedVowelIds(new Set(THAI_VOWELS.map((v) => v.id)))
  }, [])

  const clearVowels = useCallback(() => {
    setSelectedVowelIds(new Set())
  }, [])

  return {
    selectedConsonantIds: Array.from(selectedConsonantIds),
    selectedVowelIds: Array.from(selectedVowelIds),
    toggleConsonant,
    toggleVowel,
    selectAllConsonants,
    clearConsonants,
    selectAllVowels,
    clearVowels,
  }
}
