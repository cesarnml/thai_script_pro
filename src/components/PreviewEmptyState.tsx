import { EMPTY_WORKSHEET_MESSAGE } from '@/data/worksheetContent'

function EmptyPreviewIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 180"
      className="mx-auto mb-5 h-36 w-auto"
    >
      <defs>
        <linearGradient
          id="thai-preview-card"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient
          id="thai-preview-elephant"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
      </defs>

      <path
        d="M52 58 72 42 92 58 110 36 128 58 148 42 168 58"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M70 66h80a18 18 0 0 1 18 18v49a18 18 0 0 1-18 18H70a18 18 0 0 1-18-18V84a18 18 0 0 1 18-18Z"
        fill="url(#thai-preview-card)"
        stroke="#d1d5db"
        strokeWidth="4"
      />
      <path
        d="M82 92h56"
        fill="none"
        stroke="#9ca3af"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M82 108h32"
        fill="none"
        stroke="#d1d5db"
        strokeLinecap="round"
        strokeWidth="5"
        opacity="0.8"
      />
      <path
        d="M82 122h44"
        fill="none"
        stroke="#d1d5db"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.55"
      />
      <path
        d="M82 134h26"
        fill="none"
        stroke="#d1d5db"
        strokeLinecap="round"
        strokeWidth="4"
        opacity="0.35"
      />
      <circle cx="149" cy="117" r="30" fill="url(#thai-preview-elephant)" />
      <circle cx="137" cy="112" r="4" fill="#4b5563" />
      <circle cx="158" cy="112" r="4" fill="#4b5563" />
      <path
        d="M142 125c5 5 12 5 17 0"
        fill="none"
        stroke="#6b7280"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  )
}

export function PreviewEmptyState() {
  return (
    <div
      className="bg-white rounded-2xl p-12 text-center"
      data-preview-surface="true"
    >
      <EmptyPreviewIllustration />
      <p className="text-gray-400 text-sm">{EMPTY_WORKSHEET_MESSAGE}</p>
    </div>
  )
}
