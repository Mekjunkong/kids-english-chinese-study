import { useState } from 'react'
import { CN_CATEGORIES } from './data/chinese'
import { EN_CATEGORIES } from './data/english'
import type { Category, ChineseCategory, Feedback, Mode, Screen } from './data/types'
import { useProgress } from './hooks/useProgress'
import { buildCnQuestions, buildEnQuestions } from './utils/quiz'
import { sayCN, sayEN } from './utils/speech'
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
  const [newBadges, setNewBadges] = useState<string[]>([])
  const { recordSession } = useProgress()

  function resetQuiz() {
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
    setNewBadges([])
  }

  function startEN(category: Category) {
    setMode('english')
    setEnCat(category)
    setEnQs(buildEnQuestions(category))
    resetQuiz()
    setScreen('en-flashcard')
  }

  function startCN(category: ChineseCategory) {
    setMode('chinese')
    setCnCat(category)
    setCnQs(buildCnQuestions(category))
    resetQuiz()
    setScreen('cn-flashcard')
  }

  function beginQuiz() {
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
    setScreen(mode === 'english' ? 'en-quiz' : 'cn-quiz')
  }

  function advance(total: number, earnedStars = stars) {
    if (qi + 1 >= total) {
      const category = mode === 'english' ? enCat : cnCat
      setNewBadges(recordSession(earnedStars, category.id))
      setScreen('complete')
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
      sayEN(correct)
      window.setTimeout(() => advance(enQs.length, nextStars), 1100)
    } else {
      setFeedback('wrong')
      window.setTimeout(() => {
        setSelected(null)
        setFeedback(null)
      }, 750)
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
      sayCN(cnQs[qi].word.chinese)
      window.setTimeout(() => advance(cnQs.length, nextStars), 1100)
    } else {
      setFeedback('wrong')
      window.setTimeout(() => {
        setSelected(null)
        setFeedback(null)
      }, 750)
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
        onStart={(category) => startEN(category as Category)}
        onLangPick={goLangPick}
      />
    )
  } else if (screen === 'cn-home') {
    content = (
      <HomeScreen
        mode="chinese"
        categories={CN_CATEGORIES}
        onStart={(category) => startCN(category as ChineseCategory)}
        onLangPick={goLangPick}
      />
    )
  } else if (screen === 'en-flashcard') {
    content = <FlashCard mode="english" category={enCat} onStartQuiz={beginQuiz} onBack={() => setScreen('en-home')} />
  } else if (screen === 'cn-flashcard') {
    content = <FlashCard mode="chinese" category={cnCat} onStartQuiz={beginQuiz} onBack={() => setScreen('cn-home')} />
  } else if (screen === 'en-quiz' && enQs[qi]) {
    content = (
      <QuizScreen
        mode="english"
        question={enQs[qi]}
        qi={qi}
        total={enQs.length}
        stars={stars}
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
        stars={stars}
        total={mode === 'english' ? enQs.length : cnQs.length}
        newBadges={newBadges}
        onReplay={() => (mode === 'english' ? startEN(enCat) : startCN(cnCat))}
        onHome={goHome}
      />
    )
  }

  return <main className="app">{content}</main>
}
