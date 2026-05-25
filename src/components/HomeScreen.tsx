import type React from 'react'
import type { Category, ChineseCategory, Mode } from '../data/types'
import { useProgress } from '../hooks/useProgress'

interface Props {
  mode: Mode
  categories: Array<Category | ChineseCategory>
  onStart: (category: Category | ChineseCategory) => void
  onLangPick: () => void
}

function isChineseCategory(category: Category | ChineseCategory): category is ChineseCategory {
  return 'chinese' in category
}

export default function HomeScreen({ mode, categories, onStart, onLangPick }: Props) {
  const { progress } = useProgress()
  const isCN = mode === 'chinese'

  return (
    <div className="home-screen">
      <div className="home-top-bar">
        <button className="back-lang-btn" onClick={onLangPick} type="button">
          🌐 เปลี่ยนภาษา
        </button>
        <div className="stars-display">⭐ {progress.totalStars}</div>
      </div>

      <div className="app-header">
        <span className="mascot">{isCN ? '🐼' : '⭐'}</span>
        <h1 className="app-title">Little Learners</h1>
        <p className="app-subtitle">
          {isCN ? 'เรียนภาษาจีน HSK 1! 🇨🇳' : 'เรียนภาษาอังกฤษกันเถอะ! 🇬🇧'}
        </p>
      </div>

      <p className="section-title">เลือกหมวดที่อยากเรียน</p>

      <div className="cat-grid">
        {categories.map((category) => {
          const completed = progress.completedCategories.includes(category.id)
          const cnCategory = isChineseCategory(category) ? category : null

          return (
            <button
              key={category.id}
              className={`cat-card${completed ? ' is-completed' : ''}`}
              style={
                {
                  '--card-color': category.color,
                  '--quiz-hue': category.hue,
                } as React.CSSProperties
              }
              onClick={() => onStart(category)}
              type="button"
              aria-label={cnCategory ? `เรียน ${category.thai} — ${cnCategory.chinese}` : `เรียน ${category.thai} — ${category.english}`}
            >
              <span className="cat-icon">{category.emoji}</span>
              <strong className="cat-primary">{cnCategory ? cnCategory.chinese : category.english}</strong>
              {cnCategory && <span className="cat-pinyin">{cnCategory.pinyin}</span>}
              <span className="cat-thai">{category.thai}</span>
              <span className="mode-actions" aria-hidden="true">
                <span className="mode-action">บัตรคำ</span>
                <span className="mode-action">Quiz</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
