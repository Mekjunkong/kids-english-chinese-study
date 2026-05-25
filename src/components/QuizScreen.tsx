import type React from 'react'
import { useEffect } from 'react'
import type { Category, ChineseCategory, ChineseWord, CnQuestion, EnQuestion, Feedback, Mode, Word } from '../data/types'
import { sayCN, sayEN } from '../utils/speech'

interface Props {
  mode: Mode
  question: EnQuestion | CnQuestion
  qi: number
  total: number
  stars: number
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

  useEffect(() => {
    const delay = window.setTimeout(() => {
      if (cnWord) sayCN(cnWord.chinese)
      if (enWord) sayEN(enWord.english)
    }, 480)
    return () => window.clearTimeout(delay)
  }, [cnWord, enWord, qi])

  function handleSpeak() {
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
        <span className="quiz-stars" aria-label={`${stars} ดาว`}>
          ⭐ {stars}
        </span>
      </div>

      <div className={`q-card${feedback ? ` is-${feedback}` : ''}`}>
        <button className="speak-btn" onClick={handleSpeak} type="button" aria-label="ฟังเสียง">
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

        {feedback === 'correct' && (
          <div className="feedback-chip is-correct" role="status">
            ✓ ถูกต้อง! 🎉
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="feedback-chip is-wrong" role="status">
            ลองใหม่นะ 😊
          </div>
        )}
      </div>

      <div className="choices" role="group" aria-label="เลือกคำตอบ">
        {question.options.map((option) => {
          const isSelected = selected === option
          const isCorrectAnswer = cnWord ? option === cnWord.thai : option === enWord?.english
          const state = isSelected
            ? feedback === 'correct' && isCorrectAnswer
              ? 'correct'
              : feedback === 'wrong'
                ? 'wrong'
                : ''
            : ''

          return (
            <button
              key={option}
              className={`choice-btn${state ? ` is-${state}` : ''}`}
              onClick={() => onPick(option)}
              type="button"
              disabled={feedback === 'correct'}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className="quiz-dots" aria-label={`คำที่ ${qi + 1} จาก ${total}`} aria-hidden="true">
        {Array.from({ length: total }, (_, dotIndex) => (
          <span
            key={dotIndex}
            className={`quiz-dot${dotIndex < qi ? ' is-done' : dotIndex === qi ? ' is-cur' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
