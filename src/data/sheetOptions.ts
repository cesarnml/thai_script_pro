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

export const ROWS_PER_CHARACTER_OPTIONS = [
  { value: 1, label: '1 row' },
  { value: 2, label: '2 rows' },
  { value: 3, label: '3 rows' },
  { value: 4, label: '4 rows' },
  { value: 5, label: '5 rows' },
  { value: 6, label: '6 rows' },
  { value: 7, label: '7 rows' },
  { value: 8, label: '8 rows' },
]

export const GHOST_COPIES_OPTIONS = [
  { value: 1, label: '1 copy' },
  { value: 2, label: '2 copies' },
  { value: 3, label: '3 copies' },
  { value: 4, label: '4 copies' },
  { value: 5, label: '5 copies' },
  { value: 6, label: '6 copies' },
]

export const FONT_FAMILY_MAP: Record<string, string> = {
  'noto-sans-thai': '"Noto Sans Thai", sans-serif',
  'noto-sans-thai-looped': '"Noto Sans Thai Looped", sans-serif',
  'noto-serif-thai': '"Noto Serif Thai", serif',
  'mali': '"Mali", cursive',
  'playpen-sans-thai': '"Playpen Sans", cursive',
}

const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)!

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  rowsPerCharacter: 2,
  ghostCopiesPerRow: 3,
  paperSize: 'a4',
  gridGuide: 'cross',
  font: defaultFont.id,
  fontSize: 'medium',
}
