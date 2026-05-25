import type React from 'react'
import type { Category, ChineseCategory, CompleteKind } from '../data/types'

const BADGE_DEFS: Record<string, { emoji: string; name: string }> = {
  'first-star': { emoji: '⭐', name: 'ดาวดวงแรก!' },
  'first-lesson': { emoji: '🎓', name: 'นักเรียนใหม่' },
  'three-lessons': { emoji: '📚', name: 'ขยันเรียน' },
  'star-collector': { emoji: '🌟', name: 'นักสะสมดาว' },
  'star-master': { emoji: '💫', name: 'ราชาดาว' },
  'english-master': { emoji: '🇬🇧', name: 'เก่งอังกฤษ' },
  'chinese-master': { emoji: '🇨🇳', name: 'เก่งจีน' },
}

interface Props {
  kind: CompleteKind
  category: Category | ChineseCategory
  stars: number
  total: number
  starsEarned: number
  newBadges: string[]
  onReplay: () => void
  onHome: () => void
}

export default function Complete({ kind, category, stars, total, starsEarned, newBadges, onReplay, onHome }: Props) {
  const isQuiz = kind === 'quiz'

  return (
    <div className="complete-screen">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <span key={index} style={{ '--i': index } as React.CSSProperties} />
        ))}
      </div>

      <span className="complete-trophy" role="img" aria-label="รางวัล">
        {category.emoji}
      </span>

      <h2 className="complete-title">หมวดนี้เสร็จแล้ว! 🎉</h2>
      <p className="complete-subtitle">Category Complete!</p>

      {isQuiz ? (
        <p className="complete-score">{stars} / {total} ถูก!</p>
      ) : (
        <p className="complete-score">จบบัตรคำครบชุดแล้ว / Flashcard deck finished</p>
      )}

      <p className="complete-stars-earned">⭐ +{starsEarned} ดาว / stars earned</p>

      {isQuiz && <div className="star-strip" aria-label={`${starsEarned} ดาวที่ได้รับ`}>
        {'⭐'.repeat(starsEarned)}
      </div>}

      {newBadges.length > 0 && (
        <div className="badges-section">
          <p className="badges-title">🏅 รางวัลใหม่ที่ได้รับ!</p>
          <div className="badge-list">
            {newBadges.map((id) => {
              const badge = BADGE_DEFS[id]
              if (!badge) return null
              return (
                <div key={id} className="badge-chip">
                  {badge.emoji} {badge.name}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="complete-btns">
        <button className="btn-replay" onClick={onReplay} type="button">
          🔄 เล่นอีกครั้ง / Play Again
        </button>
        <button className="btn-home" onClick={onHome} type="button">
          🏠 กลับหน้าหลัก / Back to Menu
        </button>
      </div>
    </div>
  )
}
