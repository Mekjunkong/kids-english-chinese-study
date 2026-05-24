import { useEffect, useState } from 'react'
import './App.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Word {
  emoji: string
  english: string
  thai: string
}

interface Category {
  id: string
  emoji: string
  english: string
  thai: string
  hue: number
  words: Word[]
}

interface Question {
  word: Word
  options: string[]
}

type Screen = 'home' | 'lesson' | 'complete'
type Feedback = 'correct' | 'wrong' | null

// ─── Content ──────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'animals',
    emoji: '🐾',
    english: 'Animals',
    thai: 'สัตว์',
    hue: 175,
    words: [
      { emoji: '🐱', english: 'Cat',      thai: 'แมว'     },
      { emoji: '🐶', english: 'Dog',      thai: 'หมา'     },
      { emoji: '🐦', english: 'Bird',     thai: 'นก'      },
      { emoji: '🐠', english: 'Fish',     thai: 'ปลา'     },
      { emoji: '🐰', english: 'Rabbit',   thai: 'กระต่าย' },
      { emoji: '🐸', english: 'Frog',     thai: 'กบ'      },
      { emoji: '🐘', english: 'Elephant', thai: 'ช้าง'    },
      { emoji: '🦁', english: 'Lion',     thai: 'สิงโต'   },
      { emoji: '🐒', english: 'Monkey',   thai: 'ลิง'     },
      { emoji: '🐯', english: 'Tiger',    thai: 'เสือ'    },
    ],
  },
  {
    id: 'colors',
    emoji: '🎨',
    english: 'Colors',
    thai: 'สี',
    hue: 75,
    words: [
      { emoji: '🔴', english: 'Red',    thai: 'แดง'     },
      { emoji: '🔵', english: 'Blue',   thai: 'น้ำเงิน' },
      { emoji: '🟡', english: 'Yellow', thai: 'เหลือง'  },
      { emoji: '🟢', english: 'Green',  thai: 'เขียว'   },
      { emoji: '🟠', english: 'Orange', thai: 'ส้ม'     },
      { emoji: '🟣', english: 'Purple', thai: 'ม่วง'    },
      { emoji: '🩷', english: 'Pink',   thai: 'ชมพู'    },
      { emoji: '🟤', english: 'Brown',  thai: 'น้ำตาล'  },
      { emoji: '⬜', english: 'White',  thai: 'ขาว'     },
      { emoji: '⬛', english: 'Black',  thai: 'ดำ'      },
    ],
  },
  {
    id: 'numbers',
    emoji: '🔢',
    english: 'Numbers',
    thai: 'ตัวเลข',
    hue: 260,
    words: [
      { emoji: '1️⃣', english: 'One',   thai: 'หนึ่ง' },
      { emoji: '2️⃣', english: 'Two',   thai: 'สอง'   },
      { emoji: '3️⃣', english: 'Three', thai: 'สาม'   },
      { emoji: '4️⃣', english: 'Four',  thai: 'สี่'    },
      { emoji: '5️⃣', english: 'Five',  thai: 'ห้า'    },
      { emoji: '6️⃣', english: 'Six',   thai: 'หก'    },
      { emoji: '7️⃣', english: 'Seven', thai: 'เจ็ด'  },
      { emoji: '8️⃣', english: 'Eight', thai: 'แปด'   },
      { emoji: '9️⃣', english: 'Nine',  thai: 'เก้า'  },
      { emoji: '🔟', english: 'Ten',   thai: 'สิบ'   },
    ],
  },
  {
    id: 'food',
    emoji: '🍎',
    english: 'Food',
    thai: 'อาหาร',
    hue: 20,
    words: [
      { emoji: '🍎', english: 'Apple',      thai: 'แอปเปิ้ล' },
      { emoji: '🍌', english: 'Banana',     thai: 'กล้วย'    },
      { emoji: '🍊', english: 'Orange',     thai: 'ส้ม'      },
      { emoji: '🍉', english: 'Watermelon', thai: 'แตงโม'    },
      { emoji: '🍕', english: 'Pizza',      thai: 'พิซซ่า'   },
      { emoji: '🍚', english: 'Rice',       thai: 'ข้าว'     },
      { emoji: '🥚', english: 'Egg',        thai: 'ไข่'      },
      { emoji: '🥛', english: 'Milk',       thai: 'นม'       },
      { emoji: '🍞', english: 'Bread',      thai: 'ขนมปัง'   },
      { emoji: '🍦', english: 'Ice Cream',  thai: 'ไอศกรีม'  },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(cat: Category, count = 8): Question[] {
  const pool = shuffle(cat.words).slice(0, Math.min(count, cat.words.length))
  return pool.map((word) => {
    const wrongs = shuffle(cat.words.filter((w) => w.english !== word.english)).slice(0, 2)
    return { word, options: shuffle([word.english, ...wrongs.map((w) => w.english)]) }
  })
}

function say(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.78
  u.pitch = 1.15
  window.speechSynthesis.speak(u)
}

// ─── Home screen ──────────────────────────────────────────────────────────────

function Home({ onStart }: { onStart: (cat: Category) => void }) {
  return (
    <div className="home">
      <header className="home-header">
        <span className="home-star">🌟</span>
        <div>
          <h1>Little Learners</h1>
          <p>เรียนภาษาอังกฤษกันเถอะ!</p>
        </div>
      </header>

      <p className="home-prompt">เลือกหมวดที่อยากเรียน</p>

      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="cat-card"
            style={{ '--hue': c.hue } as React.CSSProperties}
            onClick={() => onStart(c)}
            type="button"
            aria-label={`เรียน ${c.thai} — ${c.english}`}
          >
            <span className="cat-icon">{c.emoji}</span>
            <strong className="cat-en">{c.english}</strong>
            <span className="cat-th">{c.thai}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Lesson screen ────────────────────────────────────────────────────────────

function Lesson({
  q,
  qi,
  total,
  stars,
  selected,
  feedback,
  cat,
  onPick,
  onBack,
  onSpeak,
}: {
  q: Question
  qi: number
  total: number
  stars: number
  selected: string | null
  feedback: Feedback
  cat: Category
  onPick: (opt: string) => void
  onBack: () => void
  onSpeak: () => void
}) {
  const progress = ((qi + (feedback === 'correct' ? 1 : 0)) / total) * 100

  return (
    <div className="lesson" style={{ '--hue': cat.hue } as React.CSSProperties}>
      {/* Top bar */}
      <div className="lesson-bar">
        <button className="back-btn" onClick={onBack} type="button" aria-label="กลับหน้าหลัก">
          ←
        </button>
        <div className="prog-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="prog-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="star-badge" aria-label={`${stars} ดาว`}>⭐ {stars}</span>
      </div>

      {/* Question card */}
      <div className={`q-card${feedback ? ` is-${feedback}` : ''}`}>
        <button className="speak-btn" onClick={onSpeak} type="button" aria-label="ฟังการออกเสียง">
          🔊
        </button>
        <div className="q-emoji" aria-hidden="true">{q.word.emoji}</div>
        <p className="q-thai">{q.word.thai}</p>
        {feedback === 'correct' && <div className="chip chip-ok" role="status">✓ ถูกต้อง!</div>}
        {feedback === 'wrong'   && <div className="chip chip-err" role="status">ลองใหม่นะ 😊</div>}
      </div>

      {/* Choices */}
      <div className="choices" role="group" aria-label="เลือกคำตอบ">
        {q.options.map((opt) => {
          const state = selected === opt ? (feedback === 'correct' ? 'ok' : 'err') : ''
          return (
            <button
              key={opt}
              className={`choice${state ? ` is-${state}` : ''}`}
              onClick={() => onPick(opt)}
              type="button"
              disabled={feedback === 'correct'}
              aria-pressed={selected === opt}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Progress dots */}
      <div className="dots" aria-label={`คำที่ ${qi + 1} จาก ${total}`} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`dot${i < qi ? ' is-done' : i === qi ? ' is-cur' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Complete screen ──────────────────────────────────────────────────────────

function Complete({
  stars,
  total,
  cat,
  onReplay,
  onHome,
}: {
  stars: number
  total: number
  cat: Category
  onReplay: () => void
  onHome: () => void
}) {
  const perfect = stars === total
  return (
    <div className="complete" style={{ '--hue': cat.hue } as React.CSSProperties}>
      <div className="celebrate" aria-hidden="true">{perfect ? '🏆' : '🌟'}</div>
      <h2>{perfect ? 'เก่งมากเลย!' : 'ดีมาก!'}</h2>
      <p className="result-line">
        {stars} / {total} ถูกต้อง
      </p>
      <div className="star-strip" aria-label={`${stars} ดาวจาก ${total}`} aria-hidden="true">
        {'⭐'.repeat(stars)}{'☆'.repeat(total - stars)}
      </div>
      <div className="done-btns">
        <button className="btn-play" onClick={onReplay} type="button">
          🔄 เล่นอีกครั้ง
        </button>
        <button className="btn-home" onClick={onHome} type="button">
          🏠 หน้าหลัก
        </button>
      </div>
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [cat, setCat]       = useState<Category>(CATEGORIES[0])
  const [questions, setQuestions] = useState<Question[]>([])
  const [qi, setQi]         = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [stars, setStars]   = useState(0)

  const q = questions[qi]

  // Auto-speak each new word
  useEffect(() => {
    if (!q || screen !== 'lesson') return
    const id = setTimeout(() => say(q.word.english), 480)
    return () => clearTimeout(id)
  }, [qi, screen]) // q is derived from qi — intentional dep list

  function start(category: Category) {
    setCat(category)
    setQuestions(buildQuestions(category))
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
    setScreen('lesson')
  }

  function pick(option: string) {
    if (feedback) return
    setSelected(option)

    if (option === q.word.english) {
      setFeedback('correct')
      say(q.word.english)
      setStars((s) => s + 1)
      setTimeout(() => {
        if (qi + 1 >= questions.length) {
          setScreen('complete')
        } else {
          setQi((i) => i + 1)
          setSelected(null)
          setFeedback(null)
        }
      }, 1100)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setSelected(null)
        setFeedback(null)
      }, 750)
    }
  }

  if (screen === 'home')
    return <Home onStart={start} />

  if (screen === 'complete')
    return (
      <Complete
        stars={stars}
        total={questions.length}
        cat={cat}
        onReplay={() => start(cat)}
        onHome={() => setScreen('home')}
      />
    )

  return (
    <Lesson
      q={q}
      qi={qi}
      total={questions.length}
      stars={stars}
      selected={selected}
      feedback={feedback}
      cat={cat}
      onPick={pick}
      onBack={() => setScreen('home')}
      onSpeak={() => say(q.word.english)}
    />
  )
}
