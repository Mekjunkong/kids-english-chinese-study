import { useCallback, useState } from 'react'
import { CN_CATEGORIES } from '../data/chinese'
import { EN_CATEGORIES } from '../data/english'

interface Progress {
  totalStars: number
  streak: number
  lastStudyDate: string
  completedCategories: string[]
  badges: string[]
}

const STORAGE_KEY = 'little-learners-progress'

const DEFAULT_PROGRESS: Progress = {
  totalStars: 0,
  streak: 0,
  lastStudyDate: '',
  completedCategories: [],
  badges: [],
}

const ENGLISH_IDS = EN_CATEGORIES.map((category) => category.id)
const CHINESE_IDS = CN_CATEGORIES.map((category) => category.id)

function withEarnedBadges(progress: Progress, totalStars: number, completedCategories: string[]) {
  const badges = [...progress.badges]

  if (!badges.includes('first-star') && totalStars >= 1) badges.push('first-star')
  if (!badges.includes('star-collector') && totalStars >= 50) badges.push('star-collector')
  if (!badges.includes('star-master') && totalStars >= 100) badges.push('star-master')
  if (!badges.includes('first-lesson') && completedCategories.length >= 1) badges.push('first-lesson')
  if (!badges.includes('three-lessons') && completedCategories.length >= 3) badges.push('three-lessons')
  if (!badges.includes('english-master') && ENGLISH_IDS.every((id) => completedCategories.includes(id))) {
    badges.push('english-master')
  }
  if (!badges.includes('chinese-master') && CHINESE_IDS.every((id) => completedCategories.includes(id))) {
    badges.push('chinese-master')
  }

  return badges
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : DEFAULT_PROGRESS
      const today = new Date().toISOString().split('T')[0]
      if (parsed.lastStudyDate === today) return parsed

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const streak = parsed.lastStudyDate === yesterday ? parsed.streak + 1 : 1
      const current = { ...parsed, streak, lastStudyDate: today }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
      return current
    } catch {
      return DEFAULT_PROGRESS
    }
  })

  const save = useCallback((p: Progress) => {
    setProgress(p)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  }, [])

  function addStars(count: number) {
    const newTotal = progress.totalStars + count
    const newBadges = withEarnedBadges(progress, newTotal, progress.completedCategories)
    save({ ...progress, totalStars: newTotal, badges: newBadges })
  }

  function completeCategory(categoryId: string) {
    const already = progress.completedCategories.includes(categoryId)
    if (already) return

    const newCompleted = [...progress.completedCategories, categoryId]
    const newBadges = withEarnedBadges(progress, progress.totalStars, newCompleted)
    save({ ...progress, completedCategories: newCompleted, badges: newBadges })
  }

  function recordSession(starsEarned: number, categoryId: string) {
    const totalStars = progress.totalStars + starsEarned
    const completedCategories = progress.completedCategories.includes(categoryId)
      ? progress.completedCategories
      : [...progress.completedCategories, categoryId]
    const badges = withEarnedBadges(progress, totalStars, completedCategories)
    const newBadges = badges.filter((badge) => !progress.badges.includes(badge))

    save({ ...progress, totalStars, completedCategories, badges })
    return newBadges
  }

  return { progress, addStars, completeCategory, recordSession }
}
