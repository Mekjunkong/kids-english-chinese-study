import type { Category, ChineseCategory, CnQuestion, EnQuestion } from '../data/types'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildEnQuestions(cat: Category, count = 10): EnQuestion[] {
  const pool = shuffle(cat.words).slice(0, Math.min(count, cat.words.length))
  return pool.map((word) => {
    const wrongs = shuffle(cat.words.filter((w) => w.english !== word.english)).slice(0, 3)
    return { word, options: shuffle([word.english, ...wrongs.map((w) => w.english)]) }
  })
}

export function buildCnQuestions(cat: ChineseCategory, count = 10): CnQuestion[] {
  const pool = shuffle(cat.words).slice(0, Math.min(count, cat.words.length))
  return pool.map((word) => {
    const wrongs = shuffle(cat.words.filter((w) => w.chinese !== word.chinese)).slice(0, 3)
    return { word, options: shuffle([word.thai, ...wrongs.map((w) => w.thai)]) }
  })
}
