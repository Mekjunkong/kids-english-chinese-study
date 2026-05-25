import { useEffect, useState } from 'react'
import type { Category, ChineseCategory, ChineseWord, Mode, Word } from '../data/types'
import { sayCN, sayEN, sayTH } from '../utils/speech'
import StrokeCard from './StrokeCard'

interface Props {
  mode: Mode
  category: Category | ChineseCategory
  onStartQuiz: () => void
  onCompleteDeck: () => void
  onBack: () => void
}

function isChineseWord(word: Word | ChineseWord): word is ChineseWord {
  return 'chinese' in word
}

function isChineseCategory(category: Category | ChineseCategory): category is ChineseCategory {
  return 'chinese' in category
}

const ENGLISH_PHONETICS: Record<string, string> = {
  apple: 'ap-uhl',
  baby: 'bay-bee',
  bag: 'bag',
  banana: 'buh-na-nuh',
  bird: 'burd',
  black: 'blak',
  blue: 'bloo',
  bone: 'bohn',
  book: 'buuk',
  brain: 'brayn',
  bread: 'bred',
  brother: 'bruh-thur',
  brown: 'brown',
  cat: 'kæt',
  cloudy: 'klow-dee',
  cold: 'kohld',
  computer: 'kuhm-pyoo-ter',
  dog: 'dawg',
  ear: 'eer',
  egg: 'eg',
  eight: 'ayt',
  elephant: 'el-uh-fuhnt',
  eye: 'ai',
  family: 'fam-uh-lee',
  father: 'fah-thur',
  fish: 'fish',
  five: 'faiv',
  food: 'food',
  foot: 'fuut',
  four: 'for',
  frog: 'frog',
  green: 'green',
  hand: 'hand',
  heart: 'hart',
  home: 'hohm',
  hot: 'hot',
  ice: 'ais',
  lion: 'lai-uhn',
  love: 'luv',
  milk: 'milk',
  monkey: 'muhng-kee',
  mother: 'muh-thur',
  mouth: 'mowth',
  nine: 'nain',
  nose: 'nohz',
  orange: 'or-inj',
  paper: 'pay-per',
  pen: 'pen',
  pencil: 'pen-suhl',
  pet: 'pet',
  pink: 'pingk',
  pizza: 'peet-suh',
  purple: 'pur-puhl',
  rabbit: 'rab-it',
  rainy: 'ray-nee',
  rainbow: 'rayn-boh',
  red: 'red',
  rice: 'rais',
  ruler: 'roo-ler',
  school: 'skool',
  science: 'sai-uhns',
  seven: 'sev-uhn',
  sister: 'sis-ter',
  six: 'siks',
  snowy: 'snoh-ee',
  stormy: 'stor-mee',
  sunny: 'sun-ee',
  ten: 'ten',
  three: 'three',
  tiger: 'tai-ger',
  tooth: 'tooth',
  triangle: 'trai-ang-guhl',
  two: 'too',
  water: 'waw-ter',
  wave: 'wayv',
  weather: 'weh-ther',
  white: 'wait',
  windy: 'win-dee',
  yellow: 'yel-oh',
}

function getEnglishPhonetic(text: string) {
  const key = text.toLowerCase().split(' ')[0]
  return ENGLISH_PHONETICS[key] ?? text.toLowerCase()
}

export default function FlashCard({ mode, category, onStartQuiz, onCompleteDeck, onBack }: Props) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [speakingSide, setSpeakingSide] = useState<'front' | 'back' | null>(null)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [deckAwarded, setDeckAwarded] = useState(false)
  const isCN = mode === 'chinese'
  const words = category.words
  const word = words[index]
  const cnWord = isChineseWord(word) ? word : null
  const enWord = cnWord ? null : (word as Word)

  useEffect(() => {
    const delay = window.setTimeout(() => {
      showSpeakingPulse('front')
      if (cnWord) sayCN(cnWord.chinese)
      if (enWord) sayEN(enWord.english)
    }, 500)
    return () => window.clearTimeout(delay)
  }, [cnWord, enWord, index])

  function showSpeakingPulse(side: 'front' | 'back') {
    setSpeakingSide(side)
    window.setTimeout(() => setSpeakingSide(null), 900)
  }

  function speakCurrent() {
    showSpeakingPulse('front')
    if (cnWord) sayCN(cnWord.chinese)
    if (enWord) sayEN(enWord.english)
  }

  function speakThai() {
    showSpeakingPulse('back')
    sayTH(word.thai)
  }

  function handleFlip() {
    setFlipped((value) => !value)
    if (!flipped) speakCurrent()
  }

  function goNext() {
    if (index < words.length - 1) {
      setFlipped(false)
      setIndex((value) => value + 1)
      return
    }

    if (!deckAwarded) {
      onCompleteDeck()
      setDeckAwarded(true)
    }
    setCompleteOpen(true)
  }

  const progress = ((index + 1) / words.length) * 100
  const phonetics = cnWord ? cnWord.pinyin : getEnglishPhonetic((word as Word).english)

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
            <button
              className={`card-speak-btn${speakingSide === 'front' ? ' is-speaking' : ''}`}
              onClick={(event) => {
                event.stopPropagation()
                speakCurrent()
              }}
              type="button"
              aria-label="ฟังคำศัพท์ / Listen"
            >
              🔊
            </button>
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
            <p className="fc-tap-hint">👆 แตะเพื่อดูความหมาย / Tap to reveal</p>
          </div>

          <div className="flip-card-back">
            <button
              className={`card-speak-btn${speakingSide === 'back' ? ' is-speaking' : ''}`}
              onClick={(event) => {
                event.stopPropagation()
                speakThai()
              }}
              type="button"
              aria-label="ฟังคำแปลไทย / Listen Thai"
            >
              🔊
            </button>
            <span className="fc-back-emoji">{word.emoji}</span>
            {isCN && cnWord && <StrokeCard character={cnWord.chinese} autoAnimate={flipped} />}
            <p className="fc-meaning">{word.thai}</p>
            <p className="fc-phonetic">{phonetics}</p>
            {cnWord?.english && <p className="fc-meaning-sub">{cnWord.english}</p>}
          </div>
        </div>
      </div>

      <div className="fc-progress-wrap" aria-label={`Card ${index + 1} of ${words.length}`}>
        <p className="fc-progress-label">
          Card {index + 1} of {words.length} · ใบที่ {index + 1} จาก {words.length}
        </p>
        <div className="fc-progress-track">
          <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="fc-nav">
        <button className="fc-btn fc-btn-prev" onClick={goPrev} disabled={index === 0} type="button">
          ← ก่อนหน้า
        </button>
        <button className="fc-btn fc-btn-next" onClick={goNext} type="button">
          ถัดไป →
        </button>
      </div>

      {completeOpen && (
        <div className="deck-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="deck-complete-title">
          <div className="deck-modal">
            <h2 id="deck-complete-title">✨ เสร็จแล้ว! / All done!</h2>
            <span className="deck-modal-emoji" aria-hidden="true">
              {category.emoji}
            </span>
            <p className="deck-modal-stars">+2 ⭐ Stars earned!</p>
            <div className="deck-modal-actions">
              <button className="fc-btn-quiz" onClick={onStartQuiz} type="button">
                Quiz ต่อไป / Take Quiz
              </button>
              <button className="fc-btn fc-btn-prev" onClick={onBack} type="button">
                กลับ / Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
