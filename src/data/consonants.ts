export interface ThaiConsonant {
  id: string
  char: string
  name?: string
}

export interface ThaiConsonantPreset {
  id: 'LCG1' | 'LCG2' | 'MC' | 'HC'
  shortLabel: string
  fullLabel: string
  colorKey: 'teal' | 'amber' | 'indigo' | 'rose'
  consonantIds: string[]
}

/** 44 Thai consonants in traditional order (ก–ฮ), with optional Thai name (e.g. ก ไก่). */
export const THAI_CONSONANTS: ThaiConsonant[] = [
  { id: 'ก', char: 'ก', name: 'ไก่' },
  { id: 'ข', char: 'ข', name: 'ไข่' },
  { id: 'ฃ', char: 'ฃ', name: 'ขวด' },
  { id: 'ค', char: 'ค', name: 'ควาย' },
  { id: 'ฅ', char: 'ฅ', name: 'คน' },
  { id: 'ฆ', char: 'ฆ', name: 'ระฆัง' },
  { id: 'ง', char: 'ง', name: 'งู' },
  { id: 'จ', char: 'จ', name: 'จาน' },
  { id: 'ฉ', char: 'ฉ', name: 'ฉิ่ง' },
  { id: 'ช', char: 'ช', name: 'ช้าง' },
  { id: 'ซ', char: 'ซ', name: 'โซ่' },
  { id: 'ฌ', char: 'ฌ', name: 'เฌอ' },
  { id: 'ญ', char: 'ญ', name: 'หญิง' },
  { id: 'ฎ', char: 'ฎ', name: 'ชฎา' },
  { id: 'ฏ', char: 'ฏ', name: 'ปฏัก' },
  { id: 'ฐ', char: 'ฐ', name: 'ฐาน' },
  { id: 'ฑ', char: 'ฑ', name: 'มณโฑ' },
  { id: 'ฒ', char: 'ฒ', name: 'ผู้เฒ่า' },
  { id: 'ณ', char: 'ณ', name: 'เณร' },
  { id: 'ด', char: 'ด', name: 'เด็ก' },
  { id: 'ต', char: 'ต', name: 'เต่า' },
  { id: 'ถ', char: 'ถ', name: 'ถุง' },
  { id: 'ท', char: 'ท', name: 'ทหาร' },
  { id: 'ธ', char: 'ธ', name: 'ธง' },
  { id: 'น', char: 'น', name: 'หนู' },
  { id: 'บ', char: 'บ', name: 'ใบไม้' },
  { id: 'ป', char: 'ป', name: 'ปลา' },
  { id: 'ผ', char: 'ผ', name: 'ผึ้ง' },
  { id: 'ฝ', char: 'ฝ', name: 'ฝา' },
  { id: 'พ', char: 'พ', name: 'พาน' },
  { id: 'ฟ', char: 'ฟ', name: 'ฟัน' },
  { id: 'ภ', char: 'ภ', name: 'สำเภา' },
  { id: 'ม', char: 'ม', name: 'ม้า' },
  { id: 'ย', char: 'ย', name: 'ยักษ์' },
  { id: 'ร', char: 'ร', name: 'เรือ' },
  { id: 'ล', char: 'ล', name: 'ลิง' },
  { id: 'ว', char: 'ว', name: 'แหวน' },
  { id: 'ศ', char: 'ศ', name: 'ศาลา' },
  { id: 'ษ', char: 'ษ', name: 'ฤๅษี' },
  { id: 'ส', char: 'ส', name: 'เสือ' },
  { id: 'ห', char: 'ห', name: 'หีบ' },
  { id: 'ฬ', char: 'ฬ', name: 'จุฬา' },
  { id: 'อ', char: 'อ', name: 'อ่าง' },
  { id: 'ฮ', char: 'ฮ', name: 'นกฮูก' },
]

export const THAI_CONSONANT_PRESETS: ThaiConsonantPreset[] = [
  {
    id: 'LCG1',
    shortLabel: 'Low Class - Group 1',
    fullLabel: 'Low Class Consonants - Unpaired',
    colorKey: 'teal',
    consonantIds: ['ง', 'ญ', 'ณ', 'น', 'ม', 'ย', 'ร', 'ล', 'ว', 'ฬ'],
  },
  {
    id: 'LCG2',
    shortLabel: 'Low Class - Group 2',
    fullLabel: 'Low Class Consonants - Paired',
    colorKey: 'amber',
    consonantIds: ['ค', 'ฅ', 'ฆ', 'ช', 'ซ', 'ฌ', 'ฑ', 'ฒ', 'ท', 'ธ', 'พ', 'ฟ', 'ภ', 'ฮ'],
  },
  {
    id: 'MC',
    shortLabel: 'Middle Class',
    fullLabel: 'Middle Class Consonants',
    colorKey: 'indigo',
    consonantIds: ['ก', 'จ', 'ฎ', 'ฏ', 'ด', 'ต', 'บ', 'ป', 'อ'],
  },
  {
    id: 'HC',
    shortLabel: 'High Class',
    fullLabel: 'High Class Consonants',
    colorKey: 'rose',
    consonantIds: ['ข', 'ฃ', 'ฉ', 'ฐ', 'ถ', 'ผ', 'ฝ', 'ศ', 'ษ', 'ส', 'ห'],
  },
]

export const CONSONANT_GROUP_COLOR_CLASSES = {
  teal: {
    tileIdle: 'border-teal-200 bg-teal-50/70 text-teal-900 hover:bg-teal-100/80',
    tileActive: 'border-teal-300 bg-teal-100 ring-1 ring-teal-200 text-teal-950',
    tileMeta: 'text-teal-700',
    rowIdle: 'border border-transparent hover:bg-teal-50/70 text-gray-700',
    rowActive: 'border border-teal-200 bg-teal-50 text-teal-800',
    rowMeta: 'text-teal-700',
    check: 'text-teal-500',
    trigger: 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100/80',
  },
  amber: {
    tileIdle: 'border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80',
    tileActive: 'border-amber-300 bg-amber-100 ring-1 ring-amber-200 text-amber-950',
    tileMeta: 'text-amber-700',
    rowIdle: 'border border-transparent hover:bg-amber-50/70 text-gray-700',
    rowActive: 'border border-amber-200 bg-amber-50 text-amber-800',
    rowMeta: 'text-amber-700',
    check: 'text-amber-500',
    trigger: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100/80',
  },
  indigo: {
    tileIdle: 'border-indigo-200 bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100/80',
    tileActive: 'border-indigo-300 bg-indigo-100 ring-1 ring-indigo-200 text-indigo-950',
    tileMeta: 'text-indigo-700',
    rowIdle: 'border border-transparent hover:bg-indigo-50/70 text-gray-700',
    rowActive: 'border border-indigo-200 bg-indigo-50 text-indigo-800',
    rowMeta: 'text-indigo-700',
    check: 'text-indigo-500',
    trigger: 'border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100/80',
  },
  rose: {
    tileIdle: 'border-rose-200 bg-rose-50/70 text-rose-900 hover:bg-rose-100/80',
    tileActive: 'border-rose-300 bg-rose-100 ring-1 ring-rose-200 text-rose-950',
    tileMeta: 'text-rose-700',
    rowIdle: 'border border-transparent hover:bg-rose-50/70 text-gray-700',
    rowActive: 'border border-rose-200 bg-rose-50 text-rose-800',
    rowMeta: 'text-rose-700',
    check: 'text-rose-500',
    trigger: 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100/80',
  },
} as const

export function getConsonantPresetById(id: ThaiConsonantPreset['id']) {
  return THAI_CONSONANT_PRESETS.find((preset) => preset.id === id)
}

export function getConsonantPresetByConsonantId(consonantId: string) {
  return THAI_CONSONANT_PRESETS.find((preset) => preset.consonantIds.includes(consonantId))
}

export function getConsonantPresetTriggerLabel(selectedConsonantIds: string[]): string {
  if (selectedConsonantIds.length === 0) return 'Presets'

  const selectedSet = new Set(selectedConsonantIds)
  const exactMatch = THAI_CONSONANT_PRESETS.find(
    (preset) =>
      preset.consonantIds.length === selectedSet.size &&
      preset.consonantIds.every((id) => selectedSet.has(id))
  )

  return exactMatch?.shortLabel ?? 'Custom'
}

export function getConsonantExactMatchPreset(selectedConsonantIds: string[]) {
  if (selectedConsonantIds.length === 0) return undefined

  const selectedSet = new Set(selectedConsonantIds)
  return THAI_CONSONANT_PRESETS.find(
    (preset) =>
      preset.consonantIds.length === selectedSet.size &&
      preset.consonantIds.every((id) => selectedSet.has(id))
  )
}
