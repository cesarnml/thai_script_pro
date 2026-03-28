import type { ReactNode } from 'react'

interface ContentSelectionSectionProps {
  title: string
  countSummary: string
  presetMenu: ReactNode
  selectAllAriaLabel: string
  clearAriaLabel: string
  onSelectAll: () => void
  onClear: () => void
  children: ReactNode
}

export function ContentSelectionSection({
  title,
  countSummary,
  presetMenu,
  selectAllAriaLabel,
  clearAriaLabel,
  onSelectAll,
  onClear,
  children,
}: ContentSelectionSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mt-1">
            {countSummary}
          </p>
        </div>
        <div className="flex justify-center">{presetMenu}</div>
        <div className="flex justify-center gap-2 md:justify-end">
          <button
            type="button"
            onClick={onSelectAll}
            aria-label={selectAllAriaLabel}
            className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={onClear}
            aria-label={clearAriaLabel}
            className="px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}
