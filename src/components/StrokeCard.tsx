import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

interface Props {
  character: string
  autoAnimate?: boolean
}

export default function StrokeCard({ character, autoAnimate = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const writerRef = useRef<HanziWriter | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ''
    const char = character.trim().split('')[0]
    if (!char || !/[一-鿿]/.test(char)) return

    try {
      writerRef.current = HanziWriter.create(containerRef.current, char, {
        width: 200,
        height: 200,
        padding: 16,
        showOutline: true,
        strokeColor: '#6C3BF5',
        outlineColor: '#D0C8FF',
        drawingColor: '#6C3BF5',
        radicalColor: '#FF6B6B',
        delayBetweenStrokes: 80,
        strokeAnimationSpeed: 1.2,
      })

      if (autoAnimate) {
        window.setTimeout(() => writerRef.current?.loopCharacterAnimation(), 300)
      }
    } catch {
      // Some multi-character words are not available in the writer database.
    }

    return () => {
      const writer = writerRef.current as (HanziWriter & { cancelAnimation?: () => void; cancelQuiz?: () => void }) | null
      writer?.cancelAnimation?.()
      writer?.cancelQuiz?.()
      writerRef.current = null
    }
  }, [character, autoAnimate])

  return <div className="stroke-container" ref={containerRef} />
}
