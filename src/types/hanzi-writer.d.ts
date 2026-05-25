declare module 'hanzi-writer' {
  export default class HanziWriter {
    static create(element: HTMLElement, character: string, options?: object): HanziWriter
    animateCharacter(options?: object): void
    loopCharacterAnimation(): void
    cancelAnimation?(): void
    cancelQuiz?(): void
  }
}
