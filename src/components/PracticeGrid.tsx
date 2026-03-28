import type { CSSProperties } from 'react'
import { FONT_SIZE_MAP, type SheetConfig } from '@/data/sheetOptions'
import { VowelDisplay } from './VowelDisplay'

function getGhostOpacity(index: number, total: number): number {
  return Math.max(0.08, 0.4 * (1 - index / total))
}

function GuideLines({ guide }: { guide: string }) {
  if (guide === 'thai') return <div className="guide-lines-thai" />
  if (guide === 'cross') return <div className="guide-lines-cross" />
  if (guide === 'sandwich') return <div className="guide-lines-sandwich" />
  return null
}

export function PracticeGrid({
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

  const cellStyle: CSSProperties = {
    width: sz.cellPx,
    height: sz.cellPx,
    position: 'relative',
    border: '1px solid #d1d5db',
  }

  const charStyle: CSSProperties = {
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

  const charInnerStyle: CSSProperties = {
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
