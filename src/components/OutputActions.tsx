interface OutputActionsProps {
  onPrint: () => void
  onDownloadPdf: () => void
}

export function OutputActions({ onPrint, onDownloadPdf }: OutputActionsProps) {
  return (
    <section className="flex gap-3" aria-label="Output actions">
      <button
        type="button"
        onClick={onPrint}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Print
      </button>
      <button
        type="button"
        onClick={onDownloadPdf}
        className="px-4 py-2 border border-gray-800 text-gray-800 rounded hover:bg-gray-100"
      >
        Download PDF
      </button>
    </section>
  )
}
