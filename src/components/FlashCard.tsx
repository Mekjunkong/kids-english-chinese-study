import { useEffect, useState } from 'react'
import type { Category, ChineseCategory, ChineseWord, Mode, Word } from '../data/types'
import { sayCN, sayEN } from '../utils/speech'
import StrokeCard from './StrokeCard'

interface Props {
  mode: Mode
  category: Category | ChineseCategory
  onStartQuiz: () => void
  onBack: () => void
}

function isChineseWord(word: Word | ChineseWord): word is ChineseWord {
  return 'chinese' in word
}

function isChineseCategory(category: Category | ChineseCategory): category is ChineseCategory {
  return 'chinese' in category
}

export default function FlashCard({ mode, category, onStartQuiz, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const isCN = mode === 'chinese'
  const words = category.words
  const word = words[index]
  const cnWord = isChineseWord(word) ? word : null
  const enWord = cnWord ? null : (word as Word)

  useEffect(() => {
    const delay = window.setTimeout(() => {
      if (cnWord) sayCN(cnWord.chinese)
      if (enWord) sayEN(enWord.english)
    }, 400)
    return () => window.clearTimeout(delay)
  }, [cnWord, enWord, index])

  function speakCurrent() {
    if (cnWord) sayCN(cnWord.chinese)
    if (enWord) sayEN(enWord.english)
  }

  function handleFlip() {
    setFlipped((value) => !value)
    if (!flipped) speakCurrent()
  }

  function goNext() {
    if (index < words.length - 1) {
      setFlipped(false)
      setIndex((value) => value + 1)
    }
  }

  function goPrev() {
    if (index > 0) {
      setFlipped(false)
      setIndex((value) => value - 1)
    }
  }

  return (
    <div className="flashcard-screen">
      <div className="flashcard-header">
        <button className="back-btn" onClick={onBack} type="button" aria-label="กลับ">
          ←
        </button>
        <span style={{ fontWeight: 900, fontSize: 'var(--font-size-lg)' }}>
          {isChineseCategory(category) ? category.chinese : category.english}
        </span>
        <span className="fc-counter">
          {index + 1} / {words.length}
        </span>
      </div>

      <div
        className={`flip-card${flipped ? ' is-flipped' : ''}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') handleFlip()
        }}
        aria-label="แตะเพื่อพลิก"
      >
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <span className="fc-emoji">{word.emoji}</span>
            {cnWord ? (
              <>
                <p className="fc-word" lang="zh">
                  {cnWord.chinese}
                </p>
                <p className="fc-pinyin">{cnWord.pinyin}</p>
              </>
            ) : (
              <p className="fc-word">{word.english}</p>
            )}
            <p className="fc-tap-hint">👆 แตะเพื่อดูความหมาย</p>
          </div>

          <div className="flip-card-back">
            {isCN && cnWord && <StrokeCard character={cnWord.chinese} autoAnimate={flipped} />}
            <p className="fc-meaning">{word.thai}</p>
            {cnWord?.english && <p className="fc-meaning-sub">{cnWord.english}</p>}
          </div>
        </div>
      </div>

      <div className="fc-dots">
        {words.map((item, dotIndex) => (
          <div
            key={`${item.emoji}-${dotIndex}`}
            className={`fc-dot${dotIndex === index ? ' is-active' : dotIndex < index ? ' is-done' : ''}`}
          />
        ))}
      </div>

      {index < words.length - 1 ? (
        <div className="fc-nav">
          <button className="fc-btn fc-btn-prev" onClick={goPrev} disabled={index === 0} type="button">
            ← ก่อนหน้า
          </button>
          <button className="fc-btn fc-btn-next" onClick={goNext} type="button">
            ถัดไป →
          </button>
        </div>
      ) : (
        <div className="fc-nav" style={{ flexDirection: 'column' }}>
          {index > 0 && (
            <button className="fc-btn fc-btn-prev" onClick={goPrev} type="button">
              ← ก่อนหน้า
            </button>
          )}
          <button className="fc-btn-quiz" onClick={onStartQuiz} type="button">
            🎮 เริ่มทำแบบทดสอบ!
          </button>
        </div>
      )}
    </div>
  )
}
