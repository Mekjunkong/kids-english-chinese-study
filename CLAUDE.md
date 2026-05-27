# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (hot reload)
npm run build     # tsc -b && vite build (type-check then bundle)
npm run lint      # eslint . (TypeScript + React rules)
npm run preview   # Serve the production build locally
```

No test runner is configured. Deploy is automatic via Vercel on `git push origin main`.

## Architecture

### Screen state machine
All navigation is a single `useState<Screen>` in `src/App.tsx`. There is no router. Valid screens: `'lang' | 'en-home' | 'cn-home' | 'en-flashcard' | 'cn-flashcard' | 'en-quiz' | 'cn-quiz' | 'complete'`. The quiz state lives in App alongside the screen (`qi`, `selected`, `feedback`, `stars`, etc.) and is reset between categories.

### Two parallel learning tracks
- **English** — `src/data/en-categories.ts` exports `EN_CATEGORIES: Category[]`. Words have `english`, `thai`, `emoji`, optional `phonetic`.
- **Chinese** — `src/data/cn-categories.ts` exports `CN_CATEGORIES: ChineseCategory[]`. Words add `chinese`, `pinyin`; quiz answers are Thai.
- Both tracks share the same component layer. `Mode = 'english' | 'chinese'` determines which data and which screen prefix is used.

### Key types (`src/data/types.ts`)
`Category`, `ChineseCategory`, `Word`, `ChineseWord`, `Screen`, `Mode` — check here before adding new data fields.

### Progress persistence (`src/hooks/useProgress.ts`)
`localStorage` key `'little-learners-progress'`. Exports `progress`, `addStars(n)`, `completeCategory(mode, id)`, `recordSession()`. Streak increments only if `lastStudyDate` was yesterday; it resets otherwise. Badge IDs are defined here — add new badges by extending the `BADGES` constant.

### Quiz generation (`src/utils/quiz.ts`)
`buildEnQuestions(cat, count=10)` and `buildCnQuestions(cat, count=10)` produce 4-choice questions (1 correct + 3 wrong from the same category). Wrong options are sampled from the same category's words to keep choices semantically related.

### Audio (`src/utils/speech.ts`)
Wraps Web Speech API. Returns `SpeechResult: 'spoken' | 'unsupported' | 'limited' | 'failed'`. In-app browsers (LINE, Facebook, Instagram) are detected and return `'limited'` — the UI shows a warning banner in this case. Always call `sayEN`, `sayCN`, or `sayTH`; never call `speechSynthesis` directly.

### Stroke order (`src/components/StrokeCard.tsx`)
Uses `hanzi-writer` (^3.7.3) to animate CJK strokes. Renders only for characters matching `/[一-鿿]/`. Stroke color is hardcoded `#6C3BF5` (matches `--color-primary` in theme).

### CSS structure
Five files imported in order in `App.tsx`:
1. `src/styles/theme.css` — CSS custom properties (color tokens, spacing, radius, shadows, keyframes). All colors use `oklch()`. Edit tokens here; never hardcode hex/hsl elsewhere.
2. `src/styles/home.css` — language picker + home screen + category grid
3. `src/styles/flashcard.css` — flip card mechanic + nav buttons + deck completion modal
4. `src/styles/quiz.css` — question card + choice buttons + answer toast + progress bar
5. `src/styles/complete.css` — session complete screen

### Design system constraints
- **Colors**: OKLCH only. Primary purple `oklch(0.55 0.25 287)` = `var(--color-primary)`. Never use `#6c63ff` or hardcoded hsl.
- **Claymorphism cards**: every card needs outer shadow + `inset 0 1px 0 rgba(255,255,255,0.65)` + `3px solid rgba(255,255,255,0.7)` border. Don't remove these.
- **Touch targets**: 44×44px minimum for all interactive elements. `min-height: 44px` is the floor.
- **Font**: Baloo 2 only — it covers Latin, Thai, and Chinese. Do not add a second font.
- **Animations**: transform + opacity only. Never animate layout properties.
- Full design rationale in `DESIGN.md`; brand/user context in `PRODUCT.md`.
