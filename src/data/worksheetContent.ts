export const WORKSHEET_TITLE = 'Thai Script Pro'
export const EMPTY_WORKSHEET_MESSAGE =
  'Select consonants or vowels to see preview.'

export interface WorksheetSummaryArgs {
  consonantCount: number
  vowelCount: number
  fontLabel: string
}

export function getWorksheetCharacterLabel(
  consonantCount: number,
  vowelCount: number,
): string {
  if (consonantCount > 0 && vowelCount > 0) return 'Characters'
  if (consonantCount > 0) return 'Consonants'
  return 'Vowels'
}

export function buildWorksheetSubtitle({
  consonantCount,
  vowelCount,
  fontLabel,
}: WorksheetSummaryArgs): string {
  const characterLabel = getWorksheetCharacterLabel(consonantCount, vowelCount)
  const totalChars = consonantCount + vowelCount

  return `Thai ${characterLabel} Writing Practice · ${totalChars} ${characterLabel.toLowerCase()} · ${fontLabel}`
}
