import { useState } from 'react'
import { CN_CATEGORIES } from './data/chinese'
import { HSK1_CATEGORIES } from './data/hsk1-complete'
import { EN_CATEGORIES } from './data/english'
import type { Category, ChineseCategory, CompleteKind, Feedback, Mode, Screen } from './data/types'
import { useProgress } from './hooks/useProgress'
import { buildCnQuestions, buildEnQuestions } from './utils/quiz'
import { playBuzz, playDing, sayCN, sayEN } from './utils/speech'
import Complete from './components/Complete'
import FlashCard from './components/FlashCard'
import HomeScreen from './components/HomeScreen'
import LanguagePicker from './components/LanguagePicker'
import QuizScreen from './components/QuizScreen'

import './styles/theme.css'
import './styles/home.css'
import './styles/flashcard.css'
import './styles/quiz.css'
import './styles/complete.css'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState<Screen>('lang')
  const [mode, setMode] = useState<Mode>('english')
  const [enCat, setEnCat] = useState<Category>(EN_CATEGORIES[0])
  const [cnCat, setCnCat] = useState<ChineseCategory>(CN_CATEGORIES[0])
  const [enQs, setEnQs] = useState(() => buildEnQuestions(EN_CATEGORIES[0]))
  const [cnQs, setCnQs] = useState(() => buildCnQuestions(CN_CATEGORIES[0]))
  const [qi, setQi] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [stars, setStars] = useState(0)
  const [starSparkleKey, setStarSparkleKey] = useState(0)
  const [completionKind, setCompletionKind] = useState<CompleteKind>('quiz')
  const [completionStars, setCompletionStars] = useState(0)
  const [newBadges, setNewBadges] = useState<string[]>([])
  const { recordSession } = useProgress()

  function resetQuiz() {
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
    setStarSparkleKey(0)
    setCompletionStars(0)
    setNewBadges([])
  }

  function startENFlashcard(category: Category) {
    setMode('english')
    setEnCat(category)
    setEnQs(buildEnQuestions(category))
    resetQuiz()
    setScreen('en-flashcard')
  }

  function startCNFlashcard(category: ChineseCategory) {
    setMode('chinese')
    setCnCat(category)
    setCnQs(buildCnQuestions(category))
    resetQuiz()
    setScreen('cn-flashcard')
  }

  function startENQuiz(category: Category) {
    setMode('english')
    setEnCat(category)
    setEnQs(buildEnQuestions(category))
    resetQuiz()
    setScreen('en-quiz')
  }

  function startCNQuiz(category: ChineseCategory) {
    setMode('chinese')
    setCnCat(category)
    setCnQs(buildCnQuestions(category))
    resetQuiz()
    setScreen('cn-quiz')
  }

  function beginQuiz() {
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
    setScreen(mode === 'english' ? 'en-quiz' : 'cn-quiz')
  }

  function quizBonus(correct: number, total: number) {
    const percentage = total > 0 ? correct / total : 0
    if (percentage === 1) return 5
    if (percentage >= 0.8) return 3
    if (percentage >= 0.6) return 2
    return 1
  }

  function completeCategory(kind: CompleteKind, earnedStars: number) {
    const category = mode === 'english' ? enCat : cnCat
    setCompletionKind(kind)
    setCompletionStars(earnedStars)
    setNewBadges(recordSession(earnedStars, category.id))
    setScreen('complete')
  }

  function completeFlashcards() {
    const category = mode === 'english' ? enCat : cnCat
    recordSession(2, category.id)
  }

  function advance(total: number, earnedStars = stars) {
    if (qi + 1 >= total) {
      completeCategory('quiz', quizBonus(earnedStars, total))
    } else {
      setQi((index) => index + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  function pickEN(option: string) {
    if (feedback) return
    setSelected(option)

    const correct = enQs[qi].word.english
    if (option === correct) {
      const nextStars = stars + 1
      setFeedback('correct')
      setStars(nextStars)
      setStarSparkleKey((key) => key + 1)
      playDing()
      sayEN(correct)
      window.setTimeout(() => advance(enQs.length, nextStars), 800)
    } else {
      setFeedback('wrong')
      playBuzz()
      window.setTimeout(() => advance(enQs.length, stars), 1500)
    }
  }

  function pickCN(option: string) {
    if (feedback) return
    setSelected(option)

    const correct = cnQs[qi].word.thai
    if (option === correct) {
      const nextStars = stars + 1
      setFeedback('correct')
      setStars(nextStars)
      setStarSparkleKey((key) => key + 1)
      playDing()
      sayCN(cnQs[qi].word.chinese)
      window.setTimeout(() => advance(cnQs.length, nextStars), 800)
    } else {
      setFeedback('wrong')
      playBuzz()
      window.setTimeout(() => advance(cnQs.length, stars), 1500)
    }
  }

  function goLangPick() {
    setScreen('lang')
  }

  function goHome() {
    setScreen(mode === 'english' ? 'en-home' : 'cn-home')
  }

  let content: React.ReactNode = null

  if (screen === 'lang') {
    content = (
      <LanguagePicker
        onSelect={(selectedMode) => {
          setMode(selectedMode)
          setScreen(selectedMode === 'english' ? 'en-home' : 'cn-home')
        }}
      />
    )
  } else if (screen === 'en-home') {
    content = (
      <HomeScreen
        mode="english"
        categories={EN_CATEGORIES}
        onStartFlashcard={(category) => startENFlashcard(category as Category)}
        onStartQuiz={(category) => startENQuiz(category as Category)}
        onLangPick={goLangPick}
      />
    )
  } else if (screen === 'cn-home') {
    content = (
      <HomeScreen
        mode="chinese"
        categories={[...CN_CATEGORIES, ...HSK1_CATEGORIES]}
        onStartFlashcard={(category) => startCNFlashcard(category as ChineseCategory)}
        onStartQuiz={(category) => startCNQuiz(category as ChineseCategory)}
        onLangPick={goLangPick}
      />
    )
  } else if (screen === 'en-flashcard') {
    content = (
      <FlashCard
        mode="english"
        category={enCat}
        onStartQuiz={beginQuiz}
        onCompleteDeck={completeFlashcards}
        onBack={() => setScreen('en-home')}
      />
    )
  } else if (screen === 'cn-flashcard') {
    content = (
      <FlashCard
        mode="chinese"
        category={cnCat}
        onStartQuiz={beginQuiz}
        onCompleteDeck={completeFlashcards}
        onBack={() => setScreen('cn-home')}
      />
    )
  } else if (screen === 'en-quiz' && enQs[qi]) {
    content = (
      <QuizScreen
        mode="english"
        question={enQs[qi]}
        qi={qi}
        total={enQs.length}
        stars={stars}
        starSparkleKey={starSparkleKey}
        selected={selected}
        feedback={feedback}
        category={enCat}
        onPick={pickEN}
        onBack={() => setScreen('en-flashcard')}
      />
    )
  } else if (screen === 'cn-quiz' && cnQs[qi]) {
    content = (
      <QuizScreen
        mode="chinese"
        question={cnQs[qi]}
        qi={qi}
        total={cnQs.length}
        stars={stars}
        starSparkleKey={starSparkleKey}
        selected={selected}
        feedback={feedback}
        category={cnCat}
        onPick={pickCN}
        onBack={() => setScreen('cn-flashcard')}
      />
    )
  } else if (screen === 'complete') {
    content = (
      <Complete
        kind={completionKind}
        category={mode === 'english' ? enCat : cnCat}
        stars={stars}
        total={mode === 'english' ? enQs.length : cnQs.length}
        starsEarned={completionStars}
        newBadges={newBadges}
        onReplay={() => (completionKind === 'quiz' ? (mode === 'english' ? startENQuiz(enCat) : startCNQuiz(cnCat)) : (mode === 'english' ? startENFlashcard(enCat) : startCNFlashcard(cnCat)))}
        onHome={goHome}
      />
    )
  }

  return <main className="app">{content}</main>
}
