import { THAI_CONSONANTS } from '@/data/consonants'
import {
  FONT_OPTIONS,
  FONT_FAMILY_MAP,
  type SheetConfig,
} from '@/data/sheetOptions'
import { THAI_VOWELS } from '@/data/vowels'
import {
  buildWorksheetSubtitle,
  WORKSHEET_TITLE,
} from '@/data/worksheetContent'
import { PreviewCharacterBlock } from './PreviewCharacterBlock'
import { PreviewEmptyState } from './PreviewEmptyState'
import { VowelDisplay } from './VowelDisplay'

interface PreviewProps {
  selectedConsonantIds: string[]
  selectedVowelIds: string[]
  config: SheetConfig
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
        <PreviewEmptyState />
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
                <PreviewCharacterBlock
                  key={c.id}
                  char={c.char}
                  config={config}
                  header={
                    <>
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
                    </>
                  }
                />
              ))}

              {vowels.map((v) => (
                <PreviewCharacterBlock
                  key={v.id}
                  char={v.char}
                  config={config}
                  isVowel
                  header={
                    <VowelDisplay
                      char={v.char}
                      className="text-lg font-bold text-gray-900"
                    />
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
