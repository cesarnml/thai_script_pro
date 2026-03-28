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
  { id: 'thai', label: 'Thai' },
]

export const FONT_OPTIONS: FontOption[] = [
  { id: 'traditional', label: 'Traditional', isDefault: true },
  { id: 'modern', label: 'Modern' },
  { id: 'cursive', label: 'Cursive' },
]

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
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
  { value: 3, label: '3 columns' },
  { value: 4, label: '4 columns' },
  { value: 5, label: '5 columns' },
  { value: 6, label: '6 columns' },
  { value: 7, label: '7 columns' },
  { value: 8, label: '8 columns' },
  { value: 9, label: '9 columns' },
  { value: 10, label: '10 columns' },
  { value: 11, label: '11 columns' },
  { value: 12, label: '12 columns' },
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
  small: { text: 24, cellPx: 56 },
  medium: { text: 36, cellPx: 76 },
  large: { text: 48, cellPx: 100 },
}

export const PDF_A4_WIDTH_PT = 595.28
export const PDF_LETTER_WIDTH_PT = 612
export const PDF_PAGE_MARGIN_X_PT = 28
export const PX_TO_PT = 0.75

export const FONT_FAMILY_MAP: Record<string, string> = {
  traditional: '"Sarabun", sans-serif',
  modern: '"Prompt", sans-serif',
  cursive: '"Itim", cursive',
}

export function getMaxColumnsForFontSize(fontSize: string): number {
  const cellPx = (FONT_SIZE_MAP[fontSize] || FONT_SIZE_MAP.medium).cellPx
  const narrowestPageWidthPt = Math.min(PDF_A4_WIDTH_PT, PDF_LETTER_WIDTH_PT)
  const printableWidthPx =
    (narrowestPageWidthPt - PDF_PAGE_MARGIN_X_PT * 2) / PX_TO_PT
  const computedMax = Math.floor(printableWidthPx / cellPx)
  const maxConfigured = COLUMNS_OPTIONS[COLUMNS_OPTIONS.length - 1].value
  const minConfigured = COLUMNS_OPTIONS[0].value

  return Math.max(minConfigured, Math.min(computedMax, maxConfigured))
}

export function getAllowedColumnOptions(fontSize: string) {
  const maxColumns = getMaxColumnsForFontSize(fontSize)
  return COLUMNS_OPTIONS.filter((option) => option.value <= maxColumns)
}

export function getInitialColumnsForWidth(
  fontSize: string,
  availableWidthPx: number,
): number {
  const cellPx = (FONT_SIZE_MAP[fontSize] || FONT_SIZE_MAP.medium).cellPx
  const printableMax = getMaxColumnsForFontSize(fontSize)
  const viewportFitMax = Math.floor(availableWidthPx / cellPx)
  const maxConfigured = COLUMNS_OPTIONS[COLUMNS_OPTIONS.length - 1].value
  const minConfigured = COLUMNS_OPTIONS[0].value
  const computedMax = Math.min(viewportFitMax, printableMax, maxConfigured)

  return Math.max(minConfigured, computedMax)
}

export function normalizeSheetConfig(config: SheetConfig): SheetConfig {
  const maxColumns = getMaxColumnsForFontSize(config.fontSize)
  const columns = Math.min(config.columns, maxColumns)

  return {
    ...config,
    columns,
    ghostCopiesPerRow: Math.min(config.ghostCopiesPerRow, columns),
  }
}

export function getSheetConfigClampNotice(
  previousConfig: SheetConfig,
  nextConfig: SheetConfig,
): string | null {
  if (nextConfig.fontSize === previousConfig.fontSize) return null
  if (nextConfig.columns === previousConfig.columns) return null

  return `Adjusted to ${nextConfig.columns} columns so it fits on the page.`
}

const defaultFont = FONT_OPTIONS.find((f) => f.isDefault)!

export const DEFAULT_SHEET_CONFIG: SheetConfig = {
  rowsPerCharacter: 3,
  columns: 3,
  ghostCopiesPerRow: 2,
  gridGuide: 'thai',
  font: defaultFont.id,
  fontSize: 'medium',
}
