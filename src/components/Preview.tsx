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
