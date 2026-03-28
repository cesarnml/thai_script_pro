import type { ReactNode } from 'react'
import type { SheetConfig } from '@/data/sheetOptions'
import { PracticeGrid } from './PracticeGrid'

interface PreviewCharacterBlockProps {
  header: ReactNode
  char: string
  config: SheetConfig
  isVowel?: boolean
}

export function PreviewCharacterBlock({
  header,
  char,
  config,
  isVowel = false,
}: PreviewCharacterBlockProps) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">{header}</div>
      <PracticeGrid char={char} isVowel={isVowel} config={config} />
    </div>
  )
}
