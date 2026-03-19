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

export interface SheetConfig {
  rowsPerCharacter: number
  columns: number
  ghostCopiesPerRow: number
  gridGuide: string
  font: string
  fontSize: string
}

export const GRID_GUIDE_OPTIONS: GridGuideOption[] = [
  { id: 'cross', label: 'Cross' },
  { id: 'sandwich', label: 'Sandwich' },
  { id: 'thai', label: 'Thai (3 lines)' },
]

export const FONT_OPTIONS: FontOption[] = [
  { id: 'traditional', label: 'Traditional', isDefault: true },
  { id: 'modern', label: 'Modern' },
  { id: 'cursive', label: 'Cursive' },
]

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: 'small', label: 'Small (24pt)' },
  { id: 'medium', label: 'Medium (36pt)' },
  { id: 'large', label: 'Large (48pt)' },
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

export const COLUMNS_OPTIONS = [
  { value: 5, label: '5 columns' },
  { value: 6, label: '6 columns' },
  { value: 7, label: '7 columns' },
  { value: 8, label: '8 columns' },
  { value: 9, label: '9 columns' },
  { value: 10, label: '10 columns' },
]

export const GHOST_COPIES_OPTIONS = [
  { value: 1, label: '1 copy' },
  { value: 2, label: '2 copies' },
  { value: 3, label: '3 copies' },
  { value: 4, label: '4 copies' },
  { value: 5, label: '5 copies' },
  { value: 6, label: '6 copies' },
  { value: 7, label: '7 copies' },
  { value: 8, label: '8 copies' },
  { value: 9, label: '9 copies' },
  { value: 10, label: '10 copies' },
]

export const FONT_SIZE_MAP: Record<string, { text: number; cellPx: number }> = {
  small: { text: 24, cellPx: 48 },
  medium: { text: 36, cellPx: 64 },
  large: { text: 48, cellPx: 80 },
}

export const FONT_FAMILY_MAP: Record<string, string> = {
  traditional: '"Sarabun", sans-serif',
  modern: '"Prompt", sans-serif',
  cursive: '"Itim", cursive',
}

const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)!

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  rowsPerCharacter: 3,
  columns: 8,
  ghostCopiesPerRow: 2,
  gridGuide: 'thai',
  font: defaultFont.id,
  fontSize: 'medium',
}
