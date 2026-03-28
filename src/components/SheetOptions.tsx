import {
  GRID_GUIDE_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  ROWS_PER_CHARACTER_OPTIONS,
  GHOST_COPIES_OPTIONS,
  getAllowedColumnOptions,
  type SheetConfig,
} from '@/data/sheetOptions'

interface SheetOptionsProps {
  config: SheetConfig
  onChange: (config: SheetConfig) => void
}

const selectClasses =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300'

const labelClasses =
  'block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1.5'

export function SheetOptions({ config, onChange }: SheetOptionsProps) {
  const allowedColumnOptions = getAllowedColumnOptions(config.fontSize)
  const fallbackColumns =
    allowedColumnOptions[allowedColumnOptions.length - 1]?.value ??
    config.columns
  const selectedColumns = allowedColumnOptions.some(
    (option) => option.value === config.columns,
  )
    ? config.columns
    : fallbackColumns

  const update = (partial: Partial<SheetConfig>) => {
    onChange({ ...config, ...partial })
  }

  const handleColumnsChange = (value: string) => {
    const columns = Number(value) || fallbackColumns
    update({
      columns,
      ghostCopiesPerRow: Math.min(config.ghostCopiesPerRow, columns),
    })
  }

  return (
    <section
      className="bg-white rounded-2xl p-6 shadow-sm"
      aria-label="Sheet options"
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4">Sheet Options</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="min-w-0">
          <label htmlFor="rows-per-char" className={labelClasses}>
            Rows
          </label>
          <select
            id="rows-per-char"
            value={config.rowsPerCharacter}
            onChange={(e) =>
              update({ rowsPerCharacter: Number(e.target.value) || 1 })
            }
            className={selectClasses}
          >
            {ROWS_PER_CHARACTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="columns" className={labelClasses}>
            Columns
          </label>
          <select
            id="columns"
            value={selectedColumns}
            onChange={(e) => handleColumnsChange(e.target.value)}
            className={selectClasses}
          >
            {allowedColumnOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="ghost-copies" className={labelClasses}>
            Ghost Copies
          </label>
          <select
            id="ghost-copies"
            value={config.ghostCopiesPerRow}
            onChange={(e) =>
              update({ ghostCopiesPerRow: Number(e.target.value) || 1 })
            }
            className={selectClasses}
          >
            {GHOST_COPIES_OPTIONS.map((o) => (
              <option
                key={o.value}
                value={o.value}
                disabled={o.value > config.columns}
              >
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="grid-guide" className={labelClasses}>
            Grid guide
          </label>
          <select
            id="grid-guide"
            value={config.gridGuide}
            onChange={(e) => update({ gridGuide: e.target.value })}
            className={selectClasses}
          >
            {GRID_GUIDE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="font" className={labelClasses}>
            Font
          </label>
          <select
            id="font"
            value={config.font}
            onChange={(e) => update({ font: e.target.value })}
            className={selectClasses}
          >
            {FONT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="font-size" className={labelClasses}>
            Font size
          </label>
          <select
            id="font-size"
            value={config.fontSize}
            onChange={(e) => update({ fontSize: e.target.value })}
            className={selectClasses}
          >
            {FONT_SIZE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
