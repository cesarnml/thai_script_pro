import type { SheetConfig } from '../data/sheetOptions'
import {
  GRID_GUIDE_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  PAPER_SIZE_OPTIONS,
  ROWS_PER_CHARACTER_OPTIONS,
  GHOST_COPIES_OPTIONS,
} from '../data/sheetOptions'

interface SheetOptionsProps {
  config: SheetConfig
  onChange: (config: SheetConfig) => void
}

const selectClasses =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300'

const labelClasses =
  'block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1.5'

export function SheetOptions({ config, onChange }: SheetOptionsProps) {
  const update = (partial: Partial<SheetConfig>) => {
    onChange({ ...config, ...partial })
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm" aria-label="Sheet options">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Sheet Options</h2>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[130px]">
          <label htmlFor="rows-per-char" className={labelClasses}>
            Rows per character
          </label>
          <select
            id="rows-per-char"
            value={config.rowsPerCharacter}
            onChange={(e) => update({ rowsPerCharacter: Number(e.target.value) || 1 })}
            className={selectClasses}
          >
            {ROWS_PER_CHARACTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[130px]">
          <label htmlFor="ghost-copies" className={labelClasses}>
            Ghost copies per row
          </label>
          <select
            id="ghost-copies"
            value={config.ghostCopiesPerRow}
            onChange={(e) => update({ ghostCopiesPerRow: Number(e.target.value) || 1 })}
            className={selectClasses}
          >
            {GHOST_COPIES_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[130px]">
          <label htmlFor="paper-size" className={labelClasses}>
            Paper size
          </label>
          <select
            id="paper-size"
            value={config.paperSize}
            onChange={(e) => update({ paperSize: e.target.value })}
            className={selectClasses}
          >
            {PAPER_SIZE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[130px]">
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

        <div className="flex-1 min-w-[130px]">
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
      </div>

      <div className="mt-3 max-w-[160px]">
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
    </section>
  )
}
