import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

interface PresetMenuProps<TItem> {
  triggerAriaLabel: string
  listboxAriaLabel: string
  triggerLabel: string
  triggerTitle?: string
  triggerClassName: string
  items: TItem[]
  getItemKey: (item: TItem) => string
  isItemSelected: (item: TItem) => boolean
  getItemTitle: (item: TItem) => string
  getOptionClassName: (item: TItem, isSelected: boolean) => string
  renderOptionContent: (item: TItem, isSelected: boolean) => ReactNode
  onSelect: (item: TItem) => void
}

export function PresetMenu<TItem>({
  triggerAriaLabel,
  listboxAriaLabel,
  triggerLabel,
  triggerTitle,
  triggerClassName,
  items,
  getItemKey,
  isItemSelected,
  getItemTitle,
  getOptionClassName,
  renderOptionContent,
  onSelect,
}: PresetMenuProps<TItem>) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label={triggerAriaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
        className={triggerClassName}
      >
        <span title={triggerTitle}>{triggerLabel}</span>
        <span aria-hidden="true" className="text-xs text-gray-400">
          ▾
        </span>
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={listboxAriaLabel}
          aria-multiselectable="true"
          className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
        >
          {items.map((item) => {
            const isSelected = isItemSelected(item)

            return (
              <button
                key={getItemKey(item)}
                type="button"
                role="option"
                aria-selected={isSelected}
                title={getItemTitle(item)}
                onClick={() => {
                  onSelect(item)
                  setIsOpen(false)
                }}
                className={getOptionClassName(item, isSelected)}
              >
                {renderOptionContent(item, isSelected)}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
