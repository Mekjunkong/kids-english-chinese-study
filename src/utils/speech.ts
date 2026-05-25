export function sayEN(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.78
  u.pitch = 1.15
  window.speechSynthesis.speak(u)
}

export function sayCN(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 0.82
  u.pitch = 1.1
  window.speechSynthesis.speak(u)
}

export function sayTH(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'th-TH'
  u.rate = 0.82
  u.pitch = 1.08
  window.speechSynthesis.speak(u)
}

export function playDing() {
  const audioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext }
  const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext
  if (!AudioContextClass) return

  const ctx = new AudioContextClass()
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
  const audioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext }
  const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext
  if (!AudioContextClass) return

  const ctx = new AudioContextClass()
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
