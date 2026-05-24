import { useEffect, useState } from 'react'
import './App.css'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Word {
  emoji: string
  english: string
  thai: string
}

interface ChineseWord {
  emoji: string
  chinese: string
  pinyin: string
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

interface ChineseCategory {
  id: string
  emoji: string
  chinese: string
  pinyin: string
  thai: string
  hue: number
  words: ChineseWord[]
}

interface EnQuestion {
  word: Word
  options: string[]
}

interface CnQuestion {
  word: ChineseWord
  options: string[]
}

type Screen = 'lang' | 'en-home' | 'en-lesson' | 'cn-home' | 'cn-lesson' | 'complete'
type Mode   = 'english' | 'chinese'
type Feedback = 'correct' | 'wrong' | null

// ─── English Content ──────────────────────────────────────────────────────────

const EN_CATEGORIES: Category[] = [
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

// ─── Chinese Content (HSK 1 · 500 คำ) ────────────────────────────────────────

const CN_CATEGORIES: ChineseCategory[] = [
  {
    id: 'cn-family',
    emoji: '👨‍👩‍👧',
    chinese: '家人',
    pinyin: 'jiārén',
    thai: 'ครอบครัว',
    hue: 10,
    words: [
      { emoji: '👨', chinese: '爸爸', pinyin: 'bàba',   thai: 'พ่อ'     },
      { emoji: '👩', chinese: '妈妈', pinyin: 'māma',   thai: 'แม่'     },
      { emoji: '👴', chinese: '爷爷', pinyin: 'yéye',   thai: 'ปู่'     },
      { emoji: '👵', chinese: '奶奶', pinyin: 'nǎinai', thai: 'ยาย'    },
      { emoji: '🧑', chinese: '哥哥', pinyin: 'gēge',   thai: 'พี่ชาย' },
      { emoji: '👧', chinese: '姐姐', pinyin: 'jiějie', thai: 'พี่สาว' },
      { emoji: '👦', chinese: '弟弟', pinyin: 'dìdi',   thai: 'น้องชาย'},
      { emoji: '🧒', chinese: '妹妹', pinyin: 'mèimei', thai: 'น้องสาว'},
    ],
  },
  {
    id: 'cn-numbers',
    emoji: '🔢',
    chinese: '数字',
    pinyin: 'shùzì',
    thai: 'ตัวเลข',
    hue: 260,
    words: [
      { emoji: '1️⃣', chinese: '一', pinyin: 'yī',  thai: 'หนึ่ง' },
      { emoji: '2️⃣', chinese: '二', pinyin: 'èr',  thai: 'สอง'   },
      { emoji: '3️⃣', chinese: '三', pinyin: 'sān', thai: 'สาม'   },
      { emoji: '4️⃣', chinese: '四', pinyin: 'sì',  thai: 'สี่'    },
      { emoji: '5️⃣', chinese: '五', pinyin: 'wǔ',  thai: 'ห้า'    },
      { emoji: '6️⃣', chinese: '六', pinyin: 'liù', thai: 'หก'    },
      { emoji: '7️⃣', chinese: '七', pinyin: 'qī',  thai: 'เจ็ด'  },
      { emoji: '8️⃣', chinese: '八', pinyin: 'bā',  thai: 'แปด'   },
      { emoji: '9️⃣', chinese: '九', pinyin: 'jiǔ', thai: 'เก้า'  },
      { emoji: '🔟', chinese: '十', pinyin: 'shí', thai: 'สิบ'   },
    ],
  },
  {
    id: 'cn-food',
    emoji: '🍜',
    chinese: '食物',
    pinyin: 'shíwù',
    thai: 'อาหาร',
    hue: 30,
    words: [
      { emoji: '🍚', chinese: '米饭',   pinyin: 'mǐfàn',     thai: 'ข้าวสวย'    },
      { emoji: '🍞', chinese: '面包',   pinyin: 'miànbāo',   thai: 'ขนมปัง'     },
      { emoji: '🍜', chinese: '面条儿', pinyin: 'miàntiáor', thai: 'ก๋วยเตี๋ยว' },
      { emoji: '🍵', chinese: '茶',     pinyin: 'chá',       thai: 'ชา'         },
      { emoji: '💧', chinese: '水',     pinyin: 'shuǐ',      thai: 'น้ำ'        },
      { emoji: '🥛', chinese: '牛奶',   pinyin: 'niúnǎi',   thai: 'นมวัว'      },
      { emoji: '🥚', chinese: '鸡蛋',   pinyin: 'jīdàn',     thai: 'ไข่ไก่'     },
      { emoji: '🍎', chinese: '水果',   pinyin: 'shuǐguǒ',   thai: 'ผลไม้'      },
    ],
  },
  {
    id: 'cn-school',
    emoji: '🏫',
    chinese: '学校',
    pinyin: 'xuéxiào',
    thai: 'โรงเรียน',
    hue: 200,
    words: [
      { emoji: '🏫',  chinese: '学校', pinyin: 'xuéxiào',  thai: 'โรงเรียน'     },
      { emoji: '👩‍🏫', chinese: '老师', pinyin: 'lǎoshī',   thai: 'ครู'          },
      { emoji: '🧑‍🎓', chinese: '学生', pinyin: 'xuésheng', thai: 'นักเรียน'     },
      { emoji: '📚',  chinese: '书',   pinyin: 'shū',       thai: 'หนังสือ'      },
      { emoji: '🎒',  chinese: '书包', pinyin: 'shūbāo',    thai: 'กระเป๋า'     },
      { emoji: '📖',  chinese: '课本', pinyin: 'kèběn',     thai: 'หนังสือเรียน' },
      { emoji: '✏️',  chinese: '写',   pinyin: 'xiě',       thai: 'เขียน'        },
      { emoji: '📝',  chinese: '考试', pinyin: 'kǎoshì',    thai: 'การสอบ'       },
    ],
  },
  {
    id: 'cn-time',
    emoji: '⏰',
    chinese: '时间',
    pinyin: 'shíjiān',
    thai: 'เวลา',
    hue: 175,
    words: [
      { emoji: '📅', chinese: '今天', pinyin: 'jīntiān',  thai: 'วันนี้'   },
      { emoji: '🗓️', chinese: '明天', pinyin: 'míngtiān', thai: 'พรุ่งนี้' },
      { emoji: '📆', chinese: '昨天', pinyin: 'zuótiān',  thai: 'เมื่อวาน' },
      { emoji: '🌅', chinese: '早上', pinyin: 'zǎoshang', thai: 'ตอนเช้า'  },
      { emoji: '☀️', chinese: '上午', pinyin: 'shàngwǔ',  thai: 'ช่วงเช้า' },
      { emoji: '🌤️', chinese: '下午', pinyin: 'xiàwǔ',    thai: 'ตอนบ่าย'  },
      { emoji: '🌙', chinese: '晚上', pinyin: 'wǎnshang', thai: 'กลางคืน'  },
      { emoji: '📆', chinese: '星期', pinyin: 'xīngqī',   thai: 'สัปดาห์'  },
    ],
  },
  {
    id: 'cn-places',
    emoji: '🏙️',
    chinese: '地方',
    pinyin: 'dìfang',
    thai: 'สถานที่',
    hue: 100,
    words: [
      { emoji: '🏠', chinese: '家',     pinyin: 'jiā',        thai: 'บ้าน'       },
      { emoji: '🏥', chinese: '医院',   pinyin: 'yīyuàn',     thai: 'โรงพยาบาล' },
      { emoji: '📚', chinese: '图书馆', pinyin: 'túshūguǎn',  thai: 'ห้องสมุด'   },
      { emoji: '🏪', chinese: '商店',   pinyin: 'shāngdiàn',  thai: 'ร้านค้า'    },
      { emoji: '🍽️', chinese: '饭店',   pinyin: 'fàndiàn',    thai: 'ร้านอาหาร'  },
      { emoji: '🏬', chinese: '商场',   pinyin: 'shāngchǎng', thai: 'ห้างสรรพฯ'  },
      { emoji: '🏙️', chinese: '北京',   pinyin: 'Běijīng',    thai: 'ปักกิ่ง'    },
      { emoji: '🇨🇳', chinese: '中国',   pinyin: 'Zhōngguó',   thai: 'จีน'        },
    ],
  },
  {
    id: 'cn-actions',
    emoji: '🎯',
    chinese: '动作',
    pinyin: 'dòngzuò',
    thai: 'การกระทำ',
    hue: 320,
    words: [
      { emoji: '🍽️', chinese: '吃',   pinyin: 'chī',       thai: 'กิน'    },
      { emoji: '🥤', chinese: '喝',   pinyin: 'hē',        thai: 'ดื่ม'   },
      { emoji: '🏃', chinese: '跑',   pinyin: 'pǎo',       thai: 'วิ่ง'   },
      { emoji: '😊', chinese: '喜欢', pinyin: 'xǐhuān',    thai: 'ชอบ'    },
      { emoji: '🛒', chinese: '买',   pinyin: 'mǎi',       thai: 'ซื้อ'   },
      { emoji: '👁️', chinese: '看',   pinyin: 'kàn',       thai: 'ดู'     },
      { emoji: '📖', chinese: '学习', pinyin: 'xuéxí',     thai: 'เรียน'  },
      { emoji: '😴', chinese: '睡觉', pinyin: 'shuìjiào',  thai: 'นอนหลับ'},
    ],
  },
  {
    id: 'cn-transport',
    emoji: '🚌',
    chinese: '交通',
    pinyin: 'jiāotōng',
    thai: 'การเดินทาง',
    hue: 210,
    words: [
      { emoji: '🚗', chinese: '汽车', pinyin: 'qìchē',    thai: 'รถยนต์'      },
      { emoji: '✈️', chinese: '飞机', pinyin: 'fēijī',    thai: 'เครื่องบิน'  },
      { emoji: '🚂', chinese: '火车', pinyin: 'huǒchē',   thai: 'รถไฟ'        },
      { emoji: '🚏', chinese: '车站', pinyin: 'chēzhàn',  thai: 'ป้ายรถ'      },
      { emoji: '🛫', chinese: '机场', pinyin: 'jīchǎng',  thai: 'สนามบิน'     },
      { emoji: '🎫', chinese: '车票', pinyin: 'chēpiào',  thai: 'ตั๋วรถ'      },
      { emoji: '🚕', chinese: '打车', pinyin: 'dǎ chē',   thai: 'เรียกแท็กซี่'},
      { emoji: '🎟️', chinese: '机票', pinyin: 'jīpiào',   thai: 'ตั๋วเครื่องบิน'},
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

function buildEnQuestions(cat: Category, count = 8): EnQuestion[] {
  const pool = shuffle(cat.words).slice(0, Math.min(count, cat.words.length))
  return pool.map((word) => {
    const wrongs = shuffle(cat.words.filter((w) => w.english !== word.english)).slice(0, 2)
    return { word, options: shuffle([word.english, ...wrongs.map((w) => w.english)]) }
  })
}

function buildCnQuestions(cat: ChineseCategory, count = 8): CnQuestion[] {
  const pool = shuffle(cat.words).slice(0, Math.min(count, cat.words.length))
  return pool.map((word) => {
    const wrongs = shuffle(cat.words.filter((w) => w.chinese !== word.chinese)).slice(0, 2)
    return { word, options: shuffle([word.thai, ...wrongs.map((w) => w.thai)]) }
  })
}

function sayEN(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang  = 'en-US'
  u.rate  = 0.78
  u.pitch = 1.15
  window.speechSynthesis.speak(u)
}

function sayCN(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang  = 'zh-CN'
  u.rate  = 0.82
  u.pitch = 1.1
  window.speechSynthesis.speak(u)
}

// ─── Language Picker ──────────────────────────────────────────────────────────

function LanguagePicker({ onSelect }: { onSelect: (m: Mode) => void }) {
  return (
    <div className="lang-pick">
      <header className="home-header">
        <span className="home-star">🌟</span>
        <div>
          <h1>Little Learners</h1>
          <p>เลือกภาษาที่อยากเรียน</p>
        </div>
      </header>

      <div className="lang-grid">
        <button
          className="lang-card"
          onClick={() => onSelect('english')}
          type="button"
          aria-label="เรียนภาษาอังกฤษ"
        >
          <span className="lang-flag">🇬🇧</span>
          <strong className="lang-name">English</strong>
          <span className="lang-sub">ภาษาอังกฤษ</span>
        </button>

        <button
          className="lang-card lang-card-cn"
          onClick={() => onSelect('chinese')}
          type="button"
          aria-label="เรียนภาษาจีน"
        >
          <span className="lang-flag">🇨🇳</span>
          <strong className="lang-name">中文</strong>
          <span className="lang-sub">ภาษาจีน (HSK 1)</span>
        </button>
      </div>
    </div>
  )
}

// ─── English Home ─────────────────────────────────────────────────────────────

function EnHome({
  onStart,
  onLangPick,
}: {
  onStart: (cat: Category) => void
  onLangPick: () => void
}) {
  return (
    <div className="home">
      <header className="home-header">
        <span className="home-star">🌟</span>
        <div>
          <h1>Little Learners</h1>
          <p>เรียนภาษาอังกฤษกันเถอะ!</p>
        </div>
      </header>

      <button className="lang-switch" onClick={onLangPick} type="button">
        🌐 เปลี่ยนภาษา
      </button>

      <p className="home-prompt">เลือกหมวดที่อยากเรียน</p>

      <div className="cat-grid">
        {EN_CATEGORIES.map((c) => (
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

// ─── Chinese Home ─────────────────────────────────────────────────────────────

function CnHome({
  onStart,
  onLangPick,
}: {
  onStart: (cat: ChineseCategory) => void
  onLangPick: () => void
}) {
  return (
    <div className="home home-cn">
      <header className="home-header">
        <span className="home-star">🌟</span>
        <div>
          <h1>Little Learners</h1>
          <p>เรียนภาษาจีน HSK 1!</p>
        </div>
      </header>

      <button className="lang-switch" onClick={onLangPick} type="button">
        🌐 เปลี่ยนภาษา
      </button>

      <p className="home-prompt">เลือกหมวดคำศัพท์</p>

      <div className="cat-grid">
        {CN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className="cat-card"
            style={{ '--hue': c.hue } as React.CSSProperties}
            onClick={() => onStart(c)}
            type="button"
            aria-label={`เรียน ${c.thai} — ${c.chinese}`}
          >
            <span className="cat-icon">{c.emoji}</span>
            <strong className="cat-cn">{c.chinese}</strong>
            <span className="cat-py">{c.pinyin}</span>
            <span className="cat-th">{c.thai}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── English Lesson ───────────────────────────────────────────────────────────

function EnLesson({
  q, qi, total, stars, selected, feedback, cat,
  onPick, onBack, onSpeak,
}: {
  q: EnQuestion; qi: number; total: number; stars: number
  selected: string | null; feedback: Feedback; cat: Category
  onPick: (opt: string) => void; onBack: () => void; onSpeak: () => void
}) {
  const progress = ((qi + (feedback === 'correct' ? 1 : 0)) / total) * 100

  return (
    <div className="lesson" style={{ '--hue': cat.hue } as React.CSSProperties}>
      <div className="lesson-bar">
        <button className="back-btn" onClick={onBack} type="button" aria-label="กลับหน้าหลัก">←</button>
        <div className="prog-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="prog-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="star-badge" aria-label={`${stars} ดาว`}>⭐ {stars}</span>
      </div>

      <div className={`q-card${feedback ? ` is-${feedback}` : ''}`}>
        <button className="speak-btn" onClick={onSpeak} type="button" aria-label="ฟังการออกเสียง">🔊</button>
        <div className="q-emoji" aria-hidden="true">{q.word.emoji}</div>
        <p className="q-thai">{q.word.thai}</p>
        {feedback === 'correct' && <div className="chip chip-ok" role="status">✓ ถูกต้อง!</div>}
        {feedback === 'wrong'   && <div className="chip chip-err" role="status">ลองใหม่นะ 😊</div>}
      </div>

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

      <div className="dots" aria-label={`คำที่ ${qi + 1} จาก ${total}`} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`dot${i < qi ? ' is-done' : i === qi ? ' is-cur' : ''}`} />
        ))}
      </div>
    </div>
  )
}

// ─── Chinese Lesson ───────────────────────────────────────────────────────────

function CnLesson({
  q, qi, total, stars, selected, feedback, cat,
  onPick, onBack, onSpeak,
}: {
  q: CnQuestion; qi: number; total: number; stars: number
  selected: string | null; feedback: Feedback; cat: ChineseCategory
  onPick: (opt: string) => void; onBack: () => void; onSpeak: () => void
}) {
  const progress = ((qi + (feedback === 'correct' ? 1 : 0)) / total) * 100

  return (
    <div className="lesson" style={{ '--hue': cat.hue } as React.CSSProperties}>
      <div className="lesson-bar">
        <button className="back-btn" onClick={onBack} type="button" aria-label="กลับหน้าหลัก">←</button>
        <div className="prog-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="prog-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="star-badge" aria-label={`${stars} ดาว`}>⭐ {stars}</span>
      </div>

      {/* Question card – shows Chinese character + pinyin */}
      <div className={`q-card${feedback ? ` is-${feedback}` : ''}`}>
        <button className="speak-btn" onClick={onSpeak} type="button" aria-label="ฟังการออกเสียงภาษาจีน">🔊</button>
        <div className="q-emoji" aria-hidden="true">{q.word.emoji}</div>
        <p className="q-chinese" lang="zh">{q.word.chinese}</p>
        <p className="q-pinyin">{q.word.pinyin}</p>
        {feedback === 'correct' && <div className="chip chip-ok" role="status">✓ ถูกต้อง!</div>}
        {feedback === 'wrong'   && <div className="chip chip-err" role="status">ลองใหม่นะ 😊</div>}
      </div>

      {/* Choices – Thai meanings */}
      <div className="choices" role="group" aria-label="เลือกความหมาย">
        {q.options.map((opt) => {
          const state = selected === opt ? (feedback === 'correct' ? 'ok' : 'err') : ''
          return (
            <button
              key={opt}
              className={`choice choice-th${state ? ` is-${state}` : ''}`}
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

      <div className="dots" aria-label={`คำที่ ${qi + 1} จาก ${total}`} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`dot${i < qi ? ' is-done' : i === qi ? ' is-cur' : ''}`} />
        ))}
      </div>
    </div>
  )
}

// ─── Complete ─────────────────────────────────────────────────────────────────

function Complete({
  stars, total, hue, onReplay, onHome,
}: {
  stars: number; total: number; hue: number
  onReplay: () => void; onHome: () => void
}) {
  const perfect = stars === total
  return (
    <div className="complete" style={{ '--hue': hue } as React.CSSProperties}>
      <div className="celebrate" aria-hidden="true">{perfect ? '🏆' : '🌟'}</div>
      <h2>{perfect ? 'เก่งมากเลย!' : 'ดีมาก!'}</h2>
      <p className="result-line">{stars} / {total} ถูกต้อง</p>
      <div className="star-strip" aria-label={`${stars} ดาวจาก ${total}`} aria-hidden="true">
        {'⭐'.repeat(stars)}{'☆'.repeat(total - stars)}
      </div>
      <div className="done-btns">
        <button className="btn-play" onClick={onReplay} type="button">🔄 เล่นอีกครั้ง</button>
        <button className="btn-home" onClick={onHome}   type="button">🏠 หน้าหลัก</button>
      </div>
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen,  setScreen]  = useState<Screen>('lang')
  const [mode,    setMode]    = useState<Mode>('english')

  // English quiz state
  const [enCat,       setEnCat]       = useState<Category>(EN_CATEGORIES[0])
  const [enQuestions, setEnQuestions] = useState<EnQuestion[]>([])

  // Chinese quiz state
  const [cnCat,       setCnCat]       = useState<ChineseCategory>(CN_CATEGORIES[0])
  const [cnQuestions, setCnQuestions] = useState<CnQuestion[]>([])

  // Shared quiz state
  const [qi,       setQi]       = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [stars,    setStars]    = useState(0)

  const enQ = enQuestions[qi]
  const cnQ = cnQuestions[qi]

  // Auto-speak English word
  useEffect(() => {
    if (!enQ || screen !== 'en-lesson') return
    const id = setTimeout(() => sayEN(enQ.word.english), 480)
    return () => clearTimeout(id)
  }, [qi, screen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-speak Chinese word
  useEffect(() => {
    if (!cnQ || screen !== 'cn-lesson') return
    const id = setTimeout(() => sayCN(cnQ.word.chinese), 480)
    return () => clearTimeout(id)
  }, [qi, screen]) // eslint-disable-line react-hooks/exhaustive-deps

  function resetQuiz() {
    setQi(0)
    setSelected(null)
    setFeedback(null)
    setStars(0)
  }

  function startEN(category: Category) {
    setEnCat(category)
    setEnQuestions(buildEnQuestions(category))
    resetQuiz()
    setScreen('en-lesson')
  }

  function startCN(category: ChineseCategory) {
    setCnCat(category)
    setCnQuestions(buildCnQuestions(category))
    resetQuiz()
    setScreen('cn-lesson')
  }

  function advance(qLen: number) {
    if (qi + 1 >= qLen) {
      setScreen('complete')
    } else {
      setQi((i) => i + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  function pickEN(option: string) {
    if (feedback) return
    setSelected(option)
    if (option === enQ.word.english) {
      setFeedback('correct')
      sayEN(enQ.word.english)
      setStars((s) => s + 1)
      setTimeout(() => advance(enQuestions.length), 1100)
    } else {
      setFeedback('wrong')
      setTimeout(() => { setSelected(null); setFeedback(null) }, 750)
    }
  }

  function pickCN(option: string) {
    if (feedback) return
    setSelected(option)
    if (option === cnQ.word.thai) {
      setFeedback('correct')
      sayCN(cnQ.word.chinese)
      setStars((s) => s + 1)
      setTimeout(() => advance(cnQuestions.length), 1100)
    } else {
      setFeedback('wrong')
      setTimeout(() => { setSelected(null); setFeedback(null) }, 750)
    }
  }

  function goLangPick() {
    setScreen('lang')
  }

  function goHome() {
    setScreen(mode === 'english' ? 'en-home' : 'cn-home')
  }

  // ── Routing ──────────────────────────────────────────────────────────────────

  if (screen === 'lang')
    return (
      <LanguagePicker
        onSelect={(m) => {
          setMode(m)
          setScreen(m === 'english' ? 'en-home' : 'cn-home')
        }}
      />
    )

  if (screen === 'en-home')
    return <EnHome onStart={startEN} onLangPick={goLangPick} />

  if (screen === 'cn-home')
    return <CnHome onStart={startCN} onLangPick={goLangPick} />

  if (screen === 'complete')
    return (
      <Complete
        stars={stars}
        total={mode === 'english' ? enQuestions.length : cnQuestions.length}
        hue={mode === 'english' ? enCat.hue : cnCat.hue}
        onReplay={() => (mode === 'english' ? startEN(enCat) : startCN(cnCat))}
        onHome={goHome}
      />
    )

  if (screen === 'en-lesson' && enQ)
    return (
      <EnLesson
        q={enQ} qi={qi} total={enQuestions.length}
        stars={stars} selected={selected} feedback={feedback} cat={enCat}
        onPick={pickEN}
        onBack={() => setScreen('en-home')}
        onSpeak={() => sayEN(enQ.word.english)}
      />
    )

  if (screen === 'cn-lesson' && cnQ)
    return (
      <CnLesson
        q={cnQ} qi={qi} total={cnQuestions.length}
        stars={stars} selected={selected} feedback={feedback} cat={cnCat}
        onPick={pickCN}
        onBack={() => setScreen('cn-home')}
        onSpeak={() => sayCN(cnQ.word.chinese)}
      />
    )

  return null
}
