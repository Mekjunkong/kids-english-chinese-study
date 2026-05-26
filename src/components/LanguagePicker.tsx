import type { Mode } from '../data/types'
import { useProgress } from '../hooks/useProgress'

interface Props {
  onSelect: (mode: Mode) => void
}

export default function LanguagePicker({ onSelect }: Props) {
  const { progress } = useProgress()

  return (
    <div className="lang-pick">
      <div className="app-header">
        <span className="mascot">🐼</span>
        <h1 className="app-title">Little Learners</h1>
        <p className="app-subtitle">เลือกภาษาที่อยากฝึกวันนี้</p>
      </div>

      <div className="progress-strip">
        <div className="progress-stat">
          <span className="stat-value">🔥 {progress.streak}</span>
          <span className="stat-label">วันติดต่อกัน</span>
        </div>
        <div className="stat-divider" />
        <div className="progress-stat">
          <span className="stat-value">⭐ {progress.totalStars}</span>
          <span className="stat-label">ดาวทั้งหมด</span>
        </div>
        <div className="stat-divider" />
        <div className="progress-stat">
          <span className="stat-value">🏅 {progress.badges.length}</span>
          <span className="stat-label">รางวัล</span>
        </div>
      </div>

      <div className="lang-grid">
        <button
          className="lang-card lang-english"
          onClick={() => onSelect('english')}
          type="button"
          aria-label="เรียนภาษาอังกฤษ"
        >
          <span className="lang-flag">🇬🇧</span>
          <strong className="lang-name">English</strong>
          <span className="lang-sub">ฝึกคำศัพท์จากภาพและเสียง</span>
        </button>

        <button
          className="lang-card lang-chinese"
          onClick={() => onSelect('chinese')}
          type="button"
          aria-label="เรียนภาษาจีน"
        >
          <span className="lang-flag">🇨🇳</span>
          <strong className="lang-name">中文</strong>
          <span className="lang-sub">ฝึกคำจีน พินอิน และลำดับขีด</span>
        </button>
      </div>
    </div>
  )
}
