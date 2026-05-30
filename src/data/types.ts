export interface Word {
  emoji: string
  english: string
  thai: string
}

export interface ChineseWord {
  emoji: string
  chinese: string
  pinyin: string
  thai: string
  english?: string
  example?: string
}

export interface Category {
  id: string
  emoji: string
  english: string
  thai: string
  hue: number
  color: string
  words: Word[]
}

export interface ChineseCategory {
  id: string
  emoji: string
  chinese: string
  pinyin: string
  thai: string
  english: string
  hue: number
  color: string
  words: ChineseWord[]
}

export interface EnQuestion {
  word: Word
  options: string[]
}

export interface CnQuestion {
  word: ChineseWord
  options: string[]
}

export type CompleteKind = 'flashcard' | 'quiz'

export interface Badge {
  id: string
  emoji: string
  name: string
  description: string
  earned: boolean
}

export type Screen =
  | 'lang'
  | 'en-home'
  | 'cn-home'
  | 'en-flashcard'
  | 'cn-flashcard'
  | 'en-quiz'
  | 'cn-quiz'
  | 'complete'

export type Mode = 'english' | 'chinese'
export type Feedback = 'correct' | 'wrong' | null
