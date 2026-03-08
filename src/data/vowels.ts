export interface ThaiVowel {
  id: string
  char: string
}

/**
 * Thai vowel symbols (traditional set). PRD ~32; includes
 * core vowels and common compound forms for practice.
 */
export const THAI_VOWELS: ThaiVowel[] = [
  { id: 'ะ', char: 'ะ' },
  { id: 'ั', char: 'ั' },
  { id: 'า', char: 'า' },
  { id: 'ำ', char: 'ำ' },
  { id: 'ิ', char: 'ิ' },
  { id: 'ี', char: 'ี' },
  { id: 'ึ', char: 'ึ' },
  { id: 'ื', char: 'ื' },
  { id: 'ุ', char: 'ุ' },
  { id: 'ู', char: 'ู' },
  { id: 'เ', char: 'เ' },
  { id: 'แ', char: 'แ' },
  { id: 'โ', char: 'โ' },
  { id: 'ใ', char: 'ใ' },
  { id: 'ไ', char: 'ไ' },
  { id: 'ฤ', char: 'ฤ' },
  { id: 'ฤๅ', char: 'ฤๅ' },
  { id: 'ฦ', char: 'ฦ' },
  { id: 'ฦๅ', char: 'ฦๅ' },
  { id: 'เีย', char: 'เีย' },
  { id: 'ือ', char: 'ือ' },
  { id: 'ัว', char: 'ัว' },
  { id: 'ัวะ', char: 'ัวะ' },
  { id: 'เาะ', char: 'เาะ' },
  { id: 'ียว', char: 'ียว' },
  { id: 'ัะ', char: 'ัะ' },
  { id: 'เียะ', char: 'เียะ' },
  { id: 'ือะ', char: 'ือะ' },
]
