import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Category, ChineseCategory, Mode } from '../data/types'
import { useProgress } from '../hooks/useProgress'

interface Props {
  mode: Mode
  categories: Array<Category | ChineseCategory>
  onStartFlashcard: (category: Category | ChineseCategory) => void
  onStartQuiz: (category: Category | ChineseCategory) => void
  onLangPick: () => void
}

function isChineseCategory(category: Category | ChineseCategory): category is ChineseCategory {
  return 'chinese' in category
}

export default function HomeScreen({ mode, categories, onStartFlashcard, onStartQuiz, onLangPick }: Props) {
  const { progress } = useProgress()
  const isCN = mode === 'chinese'
  const previousStars = useRef(progress.totalStars)
  const [sparkling, setSparkling] = useState(false)
  const completedInMode = categories.filter((category) => progress.completedCategories.includes(category.id)).length
  const dailyGoal = 5
  const dailyGoalProgress = Math.min(progress.streak, dailyGoal)
  const dailyGoalPercent = (dailyGoalProgress / dailyGoal) * 100

  useEffect(() => {
    if (progress.totalStars > previousStars.current) {
      setSparkling(true)
      const timeout = window.setTimeout(() => setSparkling(false), 550)
      previousStars.current = progress.totalStars
      return () => window.clearTimeout(timeout)
    }
    previousStars.current = progress.totalStars
  }, [progress.totalStars])

  return (
    <div className="home-screen">
      <div className="home-top-bar">
        <button className="back-lang-btn" onClick={onLangPick} type="button">
          🌐 เปลี่ยนภาษา
        </button>
        <div className={`stars-display${sparkling ? ' is-sparkling' : ''}`}>⭐ {progress.totalStars}</div>
      </div>

      <div className="app-header">
        <span className="mascot">{isCN ? '🐼' : '🦉'}</span>
        <p className="eyebrow">{isCN ? 'Chinese path' : 'English path'} · 5 minute practice</p>
        <h1 className="app-title">Little Learners</h1>
        <p className="app-subtitle">
          {isCN ? 'ฟัง พูด อ่านจีน HSK 1 แบบสนุก ๆ 🇨🇳' : 'ฟังเสียง ดูภาพ แล้วตอบคำศัพท์อังกฤษ 🇬🇧'}
        </p>
      </div>

      <section className="learning-flow" aria-label="Learning flow">
        <span>1 ดูภาพ</span>
        <span>2 ฟังเสียง</span>
        <span>3 พลิกบัตร</span>
        <span>4 เล่น Quiz</span>
      </section>

      <section className="progress-strip" aria-label="สรุปความก้าวหน้า">
        <div className="progress-stat">
          <span className="stat-value">{completedInMode}/{categories.length}</span>
          <span className="stat-label">หมวดที่ผ่าน</span>
        </div>
        <span className="stat-divider" aria-hidden="true" />
        <div className="progress-stat">
          <span className="stat-value">🔥 {progress.streak}</span>
          <span className="stat-label">วันต่อเนื่อง</span>
        </div>
        <span className="stat-divider" aria-hidden="true" />
        <div className="progress-stat daily-goal-stat">
          <span className="stat-value">{dailyGoalProgress}/{dailyGoal}</span>
          <span className="stat-label">เป้าหมายวันนี้</span>
          <span className="daily-goal-track" aria-hidden="true">
            <span className="daily-goal-fill" style={{ width: `${dailyGoalPercent}%` }} />
          </span>
        </div>
      </section>

      <p className="section-title">เลือกหมวดที่อยากเรียน</p>

      <div className="cat-grid">
        {categories.map((category) => {
          const completed = progress.completedCategories.includes(category.id)
          const cnCategory = isChineseCategory(category) ? category : null

          return (
            <article
              key={category.id}
              className={`cat-card${completed ? ' is-completed' : ''}`}
              style={
                {
                  '--card-color': category.color,
                  '--quiz-hue': category.hue,
                } as React.CSSProperties
              }
              aria-label={cnCategory ? `เรียน ${category.thai} — ${cnCategory.chinese}` : `เรียน ${category.thai} — ${category.english}`}
            >
              <span className="cat-icon">{category.emoji}</span>
              <strong className="cat-primary">{cnCategory ? cnCategory.chinese : category.english}</strong>
              {cnCategory && <span className="cat-pinyin">{cnCategory.pinyin}</span>}
              <span className="cat-thai">{category.thai}</span>
              <span className="cat-word-count">{category.words.length} คำ · {completed ? 'ผ่านแล้ว' : 'ยังไม่ผ่าน'}</span>
              <span className="cat-progress" aria-hidden="true">
                <span className="cat-progress-fill" style={{ width: completed ? '100%' : '18%' }} />
              </span>
              <span className="mode-actions">
                <button className="mode-action" onClick={() => onStartFlashcard(category)} type="button">
                  บัตรคำ / Cards
                </button>
                <button className="mode-action" onClick={() => onStartQuiz(category)} type="button">
                  Quiz / แบบทดสอบ
                </button>
              </span>
            </article>
          )
        })}
      </div>
    </div>
  )
}
