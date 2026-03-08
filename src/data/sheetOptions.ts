export interface GridGuideOption {
  id: string
  label: string
}

export interface FontOption {
  id: string
  label: string
  isDefault?: boolean
}

export interface FontSizeOption {
  id: string
  label: string
}

export interface PaperSizeOption {
  id: string
  label: string
}

export interface SheetConfig {
  rowsPerCharacter: number
  ghostCopiesPerRow: number
  paperSize: string
  gridGuide: string
  font: string
  fontSize: string
}

export const GRID_GUIDE_OPTIONS: GridGuideOption[] = [
  { id: 'cross', label: 'Cross (horizontal + vertical)' },
  { id: 'sandwich', label: 'Sandwich (top & bottom)' },
  { id: 'thai', label: 'Thai (3 lines)' },
]

export const FONT_OPTIONS: FontOption[] = [
  { id: 'noto-sans-thai', label: 'Noto Sans Thai' },
  { id: 'noto-sans-thai-looped', label: 'Noto Sans Thai Looped' },
  { id: 'noto-serif-thai', label: 'Noto Serif Thai', isDefault: true },
  { id: 'mali', label: 'Mali' },
  { id: 'playpen-sans-thai', label: 'Playpen Sans Thai' },
]

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: 'small', label: 'Small (18pt)' },
  { id: 'medium', label: 'Medium (24pt)' },
  { id: 'large', label: 'Large (32pt)' },
]

export const PAPER_SIZE_OPTIONS: PaperSizeOption[] = [
  { id: 'a4', label: 'A4' },
  { id: 'letter', label: 'Letter' },
]

const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)!

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  rowsPerCharacter: 2,
  ghostCopiesPerRow: 3,
  paperSize: 'a4',
  gridGuide: 'cross',
  font: defaultFont.id,
  fontSize: 'medium',
}
