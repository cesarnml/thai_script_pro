interface OutputActionsProps {
  onDownloadPdf: () => void
  isDownloading?: boolean
  downloadLabel?: string
  statusMessage?: string
}

export function OutputActions({
  onDownloadPdf,
  isDownloading = false,
  downloadLabel = 'Download PDF',
  statusMessage,
}: OutputActionsProps) {
  return (
    <section className="flex flex-col items-end gap-2" aria-label="Output actions">
      <button
        type="button"
        onClick={onDownloadPdf}
        disabled={isDownloading}
        aria-busy={isDownloading}
        className="flex min-w-[10.5rem] items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-600 disabled:cursor-wait disabled:bg-indigo-400"
      >
        {isDownloading ? (
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="3" />
            <path
              className="opacity-90"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M12 2a10 10 0 018 4"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        <span>{downloadLabel}</span>
      </button>
      <p
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem] text-right text-xs text-gray-400"
      >
        {statusMessage ?? ''}
      </p>
    </section>
  )
}
