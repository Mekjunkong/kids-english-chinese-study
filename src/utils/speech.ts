export type SpeechResult = 'spoken' | 'unsupported' | 'limited' | 'failed'

export function canUseSpeech() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  )
}

function isLikelyInAppBrowser() {
  if (typeof navigator === 'undefined') return false
  return /FBAN|FBAV|FB_IAB|FB4A|Messenger|Instagram|Line\//i.test(navigator.userAgent)
}

function findVoice(lang: string) {
  if (!canUseSpeech()) return undefined
  const normalizedLang = lang.toLowerCase()
  const baseLang = normalizedLang.split('-')[0]
  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase() === normalizedLang || voice.lang.toLowerCase().startsWith(baseLang))
}

function say(text: string, lang: string, rate: number, pitch: number): SpeechResult {
  if (!canUseSpeech()) return 'unsupported'

  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch

    const matchingVoice = findVoice(lang)
    if (matchingVoice) utterance.voice = matchingVoice

    window.speechSynthesis.speak(utterance)
    return isLikelyInAppBrowser() ? 'limited' : 'spoken'
  } catch {
    return 'failed'
  }
}

export function sayEN(text: string): SpeechResult {
  return say(text, 'en-US', 0.78, 1.15)
}

export function sayCN(text: string): SpeechResult {
  return say(text, 'zh-CN', 0.82, 1.1)
}

export function sayTH(text: string): SpeechResult {
  return say(text, 'th-TH', 0.82, 1.08)
}

function getAudioContextClass() {
  const audioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext }
  return audioWindow.AudioContext || audioWindow.webkitAudioContext
}

export function playDing() {
  const AudioContextClass = getAudioContextClass()
  if (!AudioContextClass) return

  const ctx = new AudioContextClass()
  if (ctx.state === 'suspended') void ctx.resume()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.3)
  gain.gain.setValueAtTime(0.001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.3)
  oscillator.onended = () => {
    void ctx.close()
  }
}

export function playBuzz() {
  const AudioContextClass = getAudioContextClass()
  if (!AudioContextClass) return

  const ctx = new AudioContextClass()
  if (ctx.state === 'suspended') void ctx.resume()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(200, ctx.currentTime)
  gain.gain.setValueAtTime(0.001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start()
  oscillator.stop(ctx.currentTime + 0.2)
  oscillator.onended = () => {
    void ctx.close()
  }
}
