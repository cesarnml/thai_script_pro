import { describe, expect, it } from 'vitest'
import {
  buildWorksheetSubtitle,
  EMPTY_WORKSHEET_MESSAGE,
  getWorksheetCharacterLabel,
  WORKSHEET_TITLE,
} from '@/data/worksheetContent'

describe('worksheetContent', () => {
  it('exposes non-empty shared worksheet copy', () => {
    expect(WORKSHEET_TITLE.trim().length).toBeGreaterThan(0)
    expect(EMPTY_WORKSHEET_MESSAGE.trim().length).toBeGreaterThan(0)
  })

  it('derives the correct character label for mixed and single-type selections', () => {
    expect(getWorksheetCharacterLabel(2, 1)).toBe('Characters')
    expect(getWorksheetCharacterLabel(2, 0)).toBe('Consonants')
    expect(getWorksheetCharacterLabel(0, 3)).toBe('Vowels')
  })

  it('builds a subtitle that reflects the selection summary and font', () => {
    const subtitle = buildWorksheetSubtitle({
      consonantCount: 2,
      vowelCount: 1,
      fontLabel: 'Modern',
    })

    expect(subtitle).toContain('Characters')
    expect(subtitle).toContain('3')
    expect(subtitle).toContain('characters')
    expect(subtitle).toContain('Modern')
  })
})
