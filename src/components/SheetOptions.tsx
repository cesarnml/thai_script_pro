import type { SheetConfig } from '../data/sheetOptions'
import {
  GRID_GUIDE_OPTIONS,
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  PAPER_SIZE_OPTIONS,
} from '../data/sheetOptions'

interface SheetOptionsProps {
  config: SheetConfig
  onChange: (config: SheetConfig) => void
}

export function SheetOptions({ config, onChange }: SheetOptionsProps) {
  const update = (partial: Partial<SheetConfig>) => {
    onChange({ ...config, ...partial })
  }

  return (
    <section className="space-y-4" aria-label="Sheet options">
      <div>
        <label htmlFor="rows-per-char" className="block text-sm font-medium mb-1">
          Rows per character
        </label>
        <input
          id="rows-per-char"
          type="number"
          min={1}
          max={10}
          value={config.rowsPerCharacter}
          onChange={(e) => update({ rowsPerCharacter: Number(e.target.value) || 1 })}
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      <div>
        <label htmlFor="ghost-copies" className="block text-sm font-medium mb-1">
          Ghost copies per row
        </label>
        <input
          id="ghost-copies"
          type="number"
          min={1}
          max={10}
          value={config.ghostCopiesPerRow}
          onChange={(e) => update({ ghostCopiesPerRow: Number(e.target.value) || 1 })}
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      <div>
        <label htmlFor="paper-size" className="block text-sm font-medium mb-1">
          Paper size
        </label>
        <select
          id="paper-size"
          value={config.paperSize}
          onChange={(e) => update({ paperSize: e.target.value })}
          className="border rounded px-2 py-1"
        >
          {PAPER_SIZE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="grid-guide" className="block text-sm font-medium mb-1">
          Grid guide
        </label>
        <select
          id="grid-guide"
          value={config.gridGuide}
          onChange={(e) => update({ gridGuide: e.target.value })}
          className="border rounded px-2 py-1"
        >
          {GRID_GUIDE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="font" className="block text-sm font-medium mb-1">
          Font
        </label>
        <select
          id="font"
          value={config.font}
          onChange={(e) => update({ font: e.target.value })}
          className="border rounded px-2 py-1"
        >
          {FONT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="font-size" className="block text-sm font-medium mb-1">
          Font size
        </label>
        <select
          id="font-size"
          value={config.fontSize}
          onChange={(e) => update({ fontSize: e.target.value })}
          className="border rounded px-2 py-1"
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
