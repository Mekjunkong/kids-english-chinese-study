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
  stars: number
  total: number
  newBadges: string[]
  onReplay: () => void
  onHome: () => void
}

export default function Complete({ stars, total, newBadges, onReplay, onHome }: Props) {
  const perfect = stars === total
  const percentage = total > 0 ? Math.round((stars / total) * 100) : 0

  return (
    <div className="complete-screen">
      <span className="complete-trophy" role="img" aria-label="รางวัล">
        {perfect ? '🏆' : percentage >= 70 ? '🌟' : '🐼'}
      </span>

      <h2 className="complete-title">
        {perfect ? 'เก่งมากเลย! สุดยอด!' : percentage >= 70 ? 'ดีมาก เก่งมาก!' : 'สู้ต่อไปนะ! 💪'}
      </h2>

      <p className="complete-score">
        {stars} / {total} ถูกต้อง ({percentage}%)
      </p>

      <div className="star-strip" aria-label={`${stars} ดาวจาก ${total}`}>
        {'⭐'.repeat(stars)}
        {'☆'.repeat(Math.max(0, total - stars))}
      </div>

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
          🔄 เล่นอีกครั้ง
        </button>
        <button className="btn-home" onClick={onHome} type="button">
          🏠 หน้าหลัก
        </button>
      </div>
    </div>
  )
}
