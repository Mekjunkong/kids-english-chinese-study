import type React from 'react'
import { useEffect, useState } from 'react'
import type { Category, ChineseCategory, ChineseWord, CnQuestion, EnQuestion, Feedback, Mode, Word } from '../data/types'
import { sayCN, sayEN } from '../utils/speech'

interface Props {
  mode: Mode
  question: EnQuestion | CnQuestion
  qi: number
  total: number
  stars: number
  starSparkleKey: number
  selected: string | null
  feedback: Feedback
  category: Category | ChineseCategory
  onPick: (option: string) => void
  onBack: () => void
}

function isChineseWord(word: Word | ChineseWord): word is ChineseWord {
  return 'chinese' in word
}

export default function QuizScreen({
  mode,
  question,
  qi,
  total,
  stars,
  starSparkleKey,
  selected,
  feedback,
  category,
  onPick,
  onBack,
}: Props) {
  const isCN = mode === 'chinese'
  const word = question.word
  const cnWord = isChineseWord(word) ? word : null
  const enWord = cnWord ? null : (word as Word)
  const progress = ((qi + (feedback === 'correct' ? 1 : 0)) / total) * 100
  const correctAnswer = cnWord ? cnWord.thai : enWord?.english
  const [isSpeaking, setIsSpeaking] = useState(false)

  function showSpeakingPulse() {
    setIsSpeaking(true)
    window.setTimeout(() => setIsSpeaking(false), 900)
  }

  useEffect(() => {
    const delay = window.setTimeout(() => {
      showSpeakingPulse()
      if (cnWord) sayCN(cnWord.chinese)
      if (enWord) sayEN(enWord.english)
    }, 480)
    return () => window.clearTimeout(delay)
  }, [cnWord, enWord, qi])

  function handleSpeak() {
    showSpeakingPulse()
    if (cnWord) sayCN(cnWord.chinese)
    if (enWord) sayEN(enWord.english)
  }

  return (
    <div className="quiz-screen" style={{ '--quiz-hue': category.hue } as React.CSSProperties}>
      <div className="quiz-bar">
        <button className="back-btn" onClick={onBack} type="button" aria-label="กลับ">
          ←
        </button>
        <div
          className="quiz-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span key={starSparkleKey} className={`quiz-stars${starSparkleKey > 0 ? ' is-sparkling' : ''}`} aria-label={`${stars} ดาว`}>
          ⭐ {stars}
        </span>
      </div>

      <div className={`q-card${feedback ? ` is-${feedback}` : ''}`}>
        <button className={`speak-btn${isSpeaking ? ' is-speaking' : ''}`} onClick={handleSpeak} type="button" aria-label="ฟังเสียง">
          🔊
        </button>

        <span className="q-emoji-large" aria-hidden="true">
          {word.emoji}
        </span>

        {isCN && cnWord ? (
          <>
            <p className="q-word-primary" lang="zh">
              {cnWord.chinese}
            </p>
            <p className="q-pinyin">{cnWord.pinyin}</p>
          </>
        ) : (
          <p className="q-label">{word.thai}</p>
        )}

      </div>

      <div className="choices" role="group" aria-label="เลือกคำตอบ">
        {question.options.map((option) => {
          const isSelected = selected === option
          const isCorrectAnswer = option === correctAnswer
          const state = feedback
            ? isCorrectAnswer
              ? 'correct'
              : isSelected
                ? 'wrong'
                : ''
            : ''

          return (
            <button
              key={option}
              className={`choice-btn${state ? ` is-${state}` : ''}${isSelected ? ' is-selected' : ''}`}
              onClick={() => onPick(option)}
              type="button"
              disabled={Boolean(feedback)}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          )
        })}
      </div>

      {feedback === 'correct' && (
        <div className="answer-toast is-correct" role="status">
          🎉 เก่งมาก! / Great job!
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="answer-toast is-wrong" role="status">
          อ๊ะ! คำตอบที่ถูกต้องคือ {correctAnswer} / Oops! Answer: {correctAnswer}
        </div>
      )}
    </div>
  )
}
