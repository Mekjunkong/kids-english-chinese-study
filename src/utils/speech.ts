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
