import { useMemo, useState } from 'react'
import './App.css'

type LevelId = 'starter' | 'builder' | 'explorer'
type StepType = 'choose' | 'listen' | 'speak' | 'sentence'

type LessonStep = {
  id: string
  type: StepType
  prompt: string
  word: string
  emoji: string
  answer: string
  options?: string[]
  sentence?: string[]
}

const levels: Array<{
  id: LevelId
  label: string
  ages: string
  title: string
  description: string
}> = [
  {
    id: 'starter',
    label: 'Starter',
    ages: '4 to 6',
    title: 'Picture-first words',
    description: 'Big taps, audio prompts, tiny wins.',
  },
  {
    id: 'builder',
    label: 'Builder',
    ages: '7 to 9',
    title: 'Words into sentences',
    description: 'Reading practice, matching, and sentence order.',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    ages: '10 to 12',
    title: 'Confident reading',
    description: 'Longer prompts, comprehension, and speaking practice.',
  },
]

const steps: LessonStep[] = [
  {
    id: 'cat',
    type: 'choose',
    prompt: 'Tap the cat.',
    word: 'Cat',
    emoji: '🐱',
    answer: 'Cat',
    options: ['Cat', 'Dog', 'Bird'],
  },
  {
    id: 'dog',
    type: 'listen',
    prompt: 'Listen, then choose the word.',
    word: 'Dog',
    emoji: '🐶',
    answer: 'Dog',
    options: ['Fish', 'Dog', 'Rabbit'],
  },
  {
    id: 'bird',
    type: 'choose',
    prompt: 'Which animal can fly?',
    word: 'Bird',
    emoji: '🐦',
    answer: 'Bird',
    options: ['Bird', 'Cat', 'Fish'],
  },
  {
    id: 'speak-rabbit',
    type: 'speak',
    prompt: 'Say the word out loud.',
    word: 'Rabbit',
    emoji: '🐰',
    answer: 'I said it',
  },
  {
    id: 'sentence',
    type: 'sentence',
    prompt: 'Build the sentence.',
    word: 'The dog is small.',
    emoji: '⭐',
    answer: 'The dog is small.',
    sentence: ['dog', 'small.', 'The', 'is'],
  },
]

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.82
  utterance.pitch = 1.08
  window.speechSynthesis.speak(utterance)
}

function App() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId>('starter')
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [sentenceWords, setSentenceWords] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [stars, setStars] = useState(0)

  const currentStep = steps[stepIndex]
  const activeLevel = levels.find((level) => level.id === selectedLevel) ?? levels[0]

  const progress = useMemo(() => {
    return Math.round(((completed ? steps.length : stepIndex) / steps.length) * 100)
  }, [completed, stepIndex])

  const isCorrect = currentStep.type === 'sentence'
    ? sentenceWords.join(' ') === currentStep.answer
    : selectedAnswer === currentStep.answer

  function resetLesson(level?: LevelId) {
    if (level) setSelectedLevel(level)
    setStepIndex(0)
    setSelectedAnswer('')
    setSentenceWords([])
    setCompleted(false)
    setStars(0)
  }

  function continueLesson() {
    if (!isCorrect) return
    const nextStars = Math.min(3, stars + 1)
    setStars(nextStars)

    if (stepIndex === steps.length - 1) {
      setCompleted(true)
      return
    }

    setStepIndex((index) => index + 1)
    setSelectedAnswer('')
    setSentenceWords([])
  }

  function addSentenceWord(word: string) {
    if (sentenceWords.includes(word)) return
    setSentenceWords((words) => [...words, word])
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <nav className="topbar" aria-label="Product status">
          <div className="brand-mark">L</div>
          <span>Little Learners</span>
          <span className="status-pill">MVP live preview</span>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Mobile-first vocabulary web app</p>
            <h1 id="page-title">Short lessons that feel calm, clear, and rewarding.</h1>
            <p className="lede">
              A deployable prototype for kids ages 4 to 12. It starts with sample animal words now, then your real curriculum can be added later.
            </p>
            <div className="hero-actions">
              <a href="#lesson" className="primary-action">Start lesson</a>
              <a href="#parent" className="secondary-action">View progress</a>
            </div>
          </div>

          <aside className="lesson-phone" aria-label="Lesson preview">
            <div className="phone-header">
              <span>{activeLevel.label}</span>
              <span>{progress}%</span>
            </div>
            <div className="phone-card">
              <span className="animal-orb">{currentStep.emoji}</span>
              <p>{currentStep.prompt}</p>
              <strong>{currentStep.word}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="levels-section" aria-labelledby="levels-title">
        <div className="section-heading">
          <p className="eyebrow">Age paths</p>
          <h2 id="levels-title">One product, three learning speeds.</h2>
        </div>
        <div className="level-list">
          {levels.map((level) => (
            <button
              className={level.id === selectedLevel ? 'level-tile active' : 'level-tile'}
              key={level.id}
              onClick={() => resetLesson(level.id)}
              type="button"
            >
              <span>{level.label}</span>
              <strong>Ages {level.ages}</strong>
              <small>{level.title}</small>
              <p>{level.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="lesson" aria-labelledby="lesson-title">
        <div className="lesson-stage">
          <div className="lesson-meta">
            <div>
              <p className="eyebrow">Lesson 1</p>
              <h2 id="lesson-title">Animals</h2>
            </div>
            <div className="stars" aria-label={`${stars} stars earned`}>
              {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
            </div>
          </div>

          <div className="progress-track" aria-label="Lesson progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          {completed ? (
            <div className="complete-panel">
              <span className="celebration">🌟</span>
              <h3>Great work.</h3>
              <p>You finished the first animal lesson and earned 3 stars.</p>
              <button className="primary-action button-reset" type="button" onClick={() => resetLesson()}>
                Practice again
              </button>
            </div>
          ) : (
            <div className="activity-card">
              <div className="activity-visual">{currentStep.emoji}</div>
              <p className="activity-prompt">{currentStep.prompt}</p>

              {(currentStep.type === 'listen' || currentStep.type === 'speak') && (
                <button className="audio-button" type="button" onClick={() => speak(currentStep.word)}>
                  Hear “{currentStep.word}”
                </button>
              )}

              {currentStep.type === 'sentence' ? (
                <div className="sentence-builder">
                  <div className="sentence-answer" aria-label="Selected sentence words">
                    {sentenceWords.length ? sentenceWords.join(' ') : 'Tap words below'}
                  </div>
                  <div className="word-bank">
                    {currentStep.sentence?.map((word) => (
                      <button key={word} type="button" onClick={() => addSentenceWord(word)} disabled={sentenceWords.includes(word)}>
                        {word}
                      </button>
                    ))}
                  </div>
                  <button className="quiet-button" type="button" onClick={() => setSentenceWords([])}>
                    Clear sentence
                  </button>
                </div>
              ) : currentStep.type === 'speak' ? (
                <div className="speak-panel">
                  <strong>{currentStep.word}</strong>
                  <button
                    className={selectedAnswer === currentStep.answer ? 'choice selected' : 'choice'}
                    type="button"
                    onClick={() => setSelectedAnswer(currentStep.answer)}
                  >
                    I said it
                  </button>
                </div>
              ) : (
                <div className="choices">
                  {currentStep.options?.map((option) => (
                    <button
                      className={selectedAnswer === option ? 'choice selected' : 'choice'}
                      key={option}
                      onClick={() => setSelectedAnswer(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <button className="continue-button" disabled={!isCorrect} onClick={continueLesson} type="button">
                {isCorrect ? 'Continue' : 'Choose the right answer'}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="parent-panel" id="parent" aria-labelledby="parent-title">
        <div>
          <p className="eyebrow">Parent view</p>
          <h2 id="parent-title">Progress without noise.</h2>
          <p className="panel-copy">Track lessons completed, words practiced, stars earned, and the recommended next step.</p>
        </div>
        <div className="metric-row">
          <div><strong>{completed ? 1 : 0}</strong><span>Lessons done</span></div>
          <div><strong>5</strong><span>Words in lesson</span></div>
          <div><strong>{stars}</strong><span>Stars earned</span></div>
        </div>
      </section>
    </main>
  )
}

export default App
