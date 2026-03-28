import { THAI_CONSONANTS } from '@/data/consonants'
import {
  FONT_OPTIONS,
  FONT_FAMILY_MAP,
  FONT_SIZE_MAP,
  type SheetConfig,
} from '@/data/sheetOptions'
import { THAI_VOWELS } from '@/data/vowels'
import {
  buildWorksheetSubtitle,
  EMPTY_WORKSHEET_MESSAGE,
  WORKSHEET_TITLE,
} from '@/data/worksheetContent'
import { VowelDisplay } from './VowelDisplay'

interface PreviewProps {
  selectedConsonantIds: string[]
  selectedVowelIds: string[]
  config: SheetConfig
}

function getGhostOpacity(index: number, total: number): number {
  return Math.max(0.08, 0.4 * (1 - index / total))
}

function GuideLines({ guide }: { guide: string }) {
  if (guide === 'thai') return <div className="guide-lines-thai" />
  if (guide === 'cross') return <div className="guide-lines-cross" />
  if (guide === 'sandwich') return <div className="guide-lines-sandwich" />
  return null
}

function EmptyPreviewIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 180"
      className="mx-auto mb-5 h-36 w-auto"
    >
      <defs>
        <linearGradient id="thai-preview-card" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#fafafa" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient id="thai-preview-elephant" x1="0%" x2="100%" y1="0%" y2="100%">
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

function PracticeGrid({
  char,
  isVowel = false,
  config,
}: {
  char: string
  isVowel?: boolean
  config: SheetConfig
}) {
  const sz = FONT_SIZE_MAP[config.fontSize] || FONT_SIZE_MAP.medium
  const firstRowGhostCopies = Math.min(
    config.ghostCopiesPerRow,
    Math.max(config.columns - 1, 0),
  )
  const laterRowGhostCopies = Math.min(firstRowGhostCopies + 1, config.columns)

  const cellStyle: React.CSSProperties = {
    width: sz.cellPx,
    height: sz.cellPx,
    position: 'relative',
    border: '1px solid #d1d5db',
  }

  const charStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: sz.cellPx,
    height: sz.cellPx,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: sz.text,
    fontFamily: 'inherit',
    lineHeight: 1,
  }

  const charInnerStyle: React.CSSProperties = {
    textAlign: 'center',
  }

  return (
    <div>
      {Array.from({ length: config.rowsPerCharacter }).map((_, row) => {
        const isFirstRow = row === 0
        const ghostCopies = isFirstRow
          ? firstRowGhostCopies
          : laterRowGhostCopies

        return (
          <div
            key={row}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${config.columns}, ${sz.cellPx}px)`,
            }}
          >
            {Array.from({ length: config.columns }).map((_, col) => {
              const isModel = isFirstRow && col === 0
              const ghostIdx = isFirstRow ? col - 1 : col
              const isGhost = isFirstRow
                ? col > 0 && col <= ghostCopies
                : col < ghostCopies

              return (
                <div key={`${row}-${col}`} style={cellStyle}>
                  <GuideLines guide={config.gridGuide} />
                  {isModel && (
                    <div
                      data-char-overlay="true"
                      aria-hidden="true"
                      style={charStyle}
                    >
                      <span style={charInnerStyle}>
                        {isVowel ? (
                          <VowelDisplay
                            char={char}
                            ariaHidden
                            className="leading-none"
                            glyphClassName="text-current"
                            placeholderClassName="text-gray-300"
                          />
                        ) : (
                          <span style={{ fontWeight: 600 }}>{char}</span>
                        )}
                      </span>
                    </div>
                  )}
                  {isGhost && (
                    <div
                      data-char-overlay="true"
                      aria-hidden="true"
                      style={{
                        ...charStyle,
                        color: '#9ca3af',
                        opacity: getGhostOpacity(ghostIdx, ghostCopies),
                      }}
                    >
                      <span style={charInnerStyle}>
                        {isVowel ? (
                          <VowelDisplay
                            char={char}
                            ariaHidden
                            className="leading-none"
                            glyphClassName="text-current"
                            placeholderClassName="text-gray-300"
                          />
                        ) : (
                          <span>{char}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export function Preview({
  selectedConsonantIds,
  selectedVowelIds,
  config,
}: PreviewProps) {
  const consonants = THAI_CONSONANTS.filter((c) =>
    selectedConsonantIds.includes(c.id),
  )
  const vowels = THAI_VOWELS.filter((v) => selectedVowelIds.includes(v.id))

  const fontFamily = FONT_FAMILY_MAP[config.font] || '"Sarabun", sans-serif'
  const fontLabel =
    FONT_OPTIONS.find((f) => f.id === config.font)?.label || 'Traditional'
  const totalChars = consonants.length + vowels.length
  const subtitle = buildWorksheetSubtitle({
    consonantCount: consonants.length,
    vowelCount: vowels.length,
    fontLabel,
  })

  return (
    <section aria-label="Preview" className="min-h-[200px]">
      {totalChars === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          data-preview-surface="true"
        >
          <EmptyPreviewIllustration />
          <p className="text-gray-400 text-sm">{EMPTY_WORKSHEET_MESSAGE}</p>
        </div>
      ) : (
        <div
          className="relative bg-white rounded-2xl border border-gray-200 shadow-sm py-10 px-8 md:px-12"
          style={{ fontFamily }}
          data-preview-surface="true"
        >
          <h3
            className="text-center text-xl font-bold text-gray-900 mb-1"
            translate="no"
          >
            {WORKSHEET_TITLE}
          </h3>
          <p className="text-center text-sm text-gray-400 mb-8">{subtitle}</p>

          <div className="overflow-x-auto pb-2" data-preview-scroll="true">
            <div
              className="min-w-max space-y-8"
              data-preview-scroll-content="true"
            >
              {consonants.map((c) => (
                <div key={c.id}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="text-lg font-bold text-gray-900"
                      translate="no"
                      lang="th"
                    >
                      {c.char}
                    </span>
                    <span
                      className="text-sm text-indigo-500 font-medium"
                      translate="no"
                      lang="th"
                    >
                      {c.char}อ {c.name}
                    </span>
                  </div>
                  <PracticeGrid char={c.char} config={config} />
                </div>
              ))}

              {vowels.map((v) => (
                <div key={v.id}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <VowelDisplay
                      char={v.char}
                      className="text-lg font-bold text-gray-900"
                    />
                  </div>
                  <PracticeGrid char={v.char} isVowel config={config} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
