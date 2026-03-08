import type { SheetConfig } from '../data/sheetOptions'
import { THAI_CONSONANTS } from '../data/consonants'
import { THAI_VOWELS } from '../data/vowels'
import { FONT_OPTIONS, FONT_FAMILY_MAP } from '../data/sheetOptions'

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
  config,
}: {
  char: string
  config: SheetConfig
}) {
  const totalCols = config.ghostCopiesPerRow + 4

  return (
    <table className="border-collapse">
      <tbody>
        {Array.from({ length: config.rowsPerCharacter }).map((_, row) => (
          <tr key={row}>
            {Array.from({ length: totalCols }).map((_, col) => {
              const isFirstRow = row === 0
              const isModel = isFirstRow && col === 0
              const ghostIdx = isFirstRow ? col - 1 : col
              const isGhost = isFirstRow
                ? col > 0 && col <= config.ghostCopiesPerRow
                : col < config.ghostCopiesPerRow

              return (
                <td
                  key={col}
                  className="border border-gray-300 w-14 h-14 text-center align-middle relative"
                >
                  <GuideLines guide={config.gridGuide} />
                  {isModel && (
                    <span className="text-3xl font-semibold relative z-10">
                      {char}
                    </span>
                  )}
                  {isGhost && (
                    <span
                      className="text-3xl relative z-10 text-gray-400"
                      style={{
                        opacity: getGhostOpacity(ghostIdx, config.ghostCopiesPerRow),
                      }}
                    >
                      {char}
                    </span>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function Preview({ selectedConsonantIds, selectedVowelIds, config }: PreviewProps) {
  const consonants = THAI_CONSONANTS.filter((c) => selectedConsonantIds.includes(c.id))
  const vowels = THAI_VOWELS.filter((v) => selectedVowelIds.includes(v.id))

  const fontFamily = FONT_FAMILY_MAP[config.font] || '"Noto Serif Thai", serif'
  const fontLabel = FONT_OPTIONS.find((f) => f.id === config.font)?.label || 'Noto Serif Thai'
  const totalChars = consonants.length + vowels.length
  const charType =
    consonants.length > 0 && vowels.length > 0
      ? 'characters'
      : consonants.length > 0
        ? 'consonants'
        : 'vowels'

  return (
    <section role="region" aria-label="Preview" className="min-h-[200px]">
      {totalChars === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-gray-400 text-sm">
            Select consonants or vowels to see preview.
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-sm py-10 px-8 md:px-12"
          style={{ fontFamily }}
        >
          <h3 className="text-center text-xl font-bold text-gray-900 mb-1">
            แบบฝึกหัดเขียนอักษรไทย
          </h3>
          <p className="text-center text-sm text-gray-400 mb-8">
            Thai {charType.charAt(0).toUpperCase() + charType.slice(1)} Writing
            Practice &middot; {totalChars} {charType} &middot;{' '}
            {config.paperSize.toUpperCase()} &middot; {fontLabel}
          </p>

          <div className="space-y-8">
            {consonants.map((c) => (
              <div key={c.id}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">{c.char}</span>
                  <span className="text-sm text-indigo-500 font-medium">
                    {c.char}อ {c.name}
                  </span>
                </div>
                <PracticeGrid char={c.char} config={config} />
              </div>
            ))}

            {vowels.map((v) => (
              <div key={v.id}>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">{v.char}</span>
                </div>
                <PracticeGrid char={v.char} config={config} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
