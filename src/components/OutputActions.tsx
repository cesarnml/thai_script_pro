interface OutputActionsProps {
  onDownloadPdf: () => void
}

export function OutputActions({ onDownloadPdf }: OutputActionsProps) {
  return (
    <section className="flex gap-3" aria-label="Output actions">
      <button
        type="button"
        onClick={onDownloadPdf}
        className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download PDF
      </button>
    </section>
  )
}
