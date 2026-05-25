import { useState } from 'react'
import type { Category, ChineseCategory, CnQuestion, EnQuestion, Feedback } from '../data/types'
import { buildCnQuestions, buildEnQuestions } from '../utils/quiz'

export function useQuiz() {
  const [enCat, setEnCat] = useState<Category | null>(null)
  const [cnCat, setCnCat] = useState<ChineseCategory | null>(null)
  const [enQuestions, setEnQuestions] = useState<EnQuestion[]>([])
  const [cnQuestions, setCnQuestions] = useState<CnQuestion[]>([])
  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [stars, setStars] = useState(0)

  function startEN(category: Category) {
    setEnCat(category)
    setCnCat(null)
    setEnQuestions(buildEnQuestions(category))
    setCnQuestions([])
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
  }

  function startCN(category: ChineseCategory) {
    setCnCat(category)
    setEnCat(null)
    setCnQuestions(buildCnQuestions(category))
    setEnQuestions([])
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
  }

  function advance(total: number, onComplete: () => void) {
    if (qi + 1 >= total) {
      onComplete()
    } else {
      setQi((i) => i + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  return {
    enCat,
    cnCat,
    enQuestions,
    cnQuestions,
    qi,
    selected,
    feedback,
    stars,
    setSelected,
    setFeedback,
    setStars,
    startEN,
    startCN,
    advance,
  }
}
