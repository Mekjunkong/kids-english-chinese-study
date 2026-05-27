---
name: Little Learners
description: Bilingual vocabulary practice app for Thai children (English + Mandarin Chinese)
colors:
  purple: "oklch(0.55 0.25 287)"
  coral: "oklch(0.68 0.17 25)"
  gold: "oklch(0.86 0.16 88)"
  green: "oklch(0.74 0.16 166)"
  red: "oklch(0.65 0.22 18)"
  bg: "oklch(0.95 0.035 294)"
  surface: "oklch(0.99 0.006 294)"
  surface2: "oklch(0.97 0.018 294)"
  text: "oklch(0.24 0.055 284)"
  textMuted: "oklch(0.48 0.065 292)"
  textLight: "oklch(0.66 0.05 292)"
typography:
  display:
    fontFamily: "'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 900
    lineHeight: 1.1
  headline:
    fontFamily: "'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 900
    lineHeight: 1.25
  body:
    fontFamily: "'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
rounded:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "var(--color-primary)"
    textColor: "white"
    borderRadius: "var(--radius-full)"
    minHeight: "52px"
    padding: "0 24px"
    fontWeight: 900
  card-category:
    backgroundColor: "var(--card-color)"
    borderRadius: "var(--radius-xl)"
    border: "3px solid rgba(255,255,255,0.7)"
    boxShadow: "var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.65)"
    minHeight: "166px"
---

# Design System: Little Learners

## 1. Overview

**Creative North Star: "A classroom where every answer feels like a win"**

The visual system is built around the feeling of a premium educational game: bright enough to feel alive, structured enough to feel capable, and rewarding enough to keep a child coming back. The reference point is Duolingo's mastery of gamification signals without the chaos of an educational cartoon app.

Single typeface throughout — Baloo 2 — a rounded, warm sans-serif with excellent multilingual legibility (Latin, Thai, Chinese characters render clearly). Weight variation (500 body, 700–900 headings) creates the full typographic hierarchy without needing a second font.

The color strategy is **committed-purple**: OKLCH purple (`0.55 0.25 287`) is the primary identity color, appearing at every level of hierarchy. Coral and gold serve as progress/reward accents. Section backgrounds use lavender-tinted surfaces rather than pure white, keeping the experience warm.

**Key Characteristics:**
- Rounded: everything is soft — `8px` (sm), `16px` (md), `24px` (lg), `32px` (xl), `9999px` (pill) — a consistent softness system
- Claymorphism cards: white inner border + inset highlight + outer drop shadow creates the layered depth that children find satisfying and tactile
- Gamification layer: stars, streaks, and completion badges are first-class UI elements, not afterthoughts
- Single font, weight-driven hierarchy: Baloo 2 from 500 to 900 carries the full scale
- Touch-first: every interactive element meets the 44px minimum; category cards are 166px+ tall

## 2. Colors

### Primary
- **Purple** (`oklch(0.55 0.25 287)`): brand and interaction. Buttons, active states, header labels, category outlines on hover. The dominant signal color.
- **Coral** (`oklch(0.68 0.17 25)`): warmth and energy. Used in the Chinese path and as a secondary accent. Naturally distinguishes the two learning tracks.
- **Gold** (`oklch(0.86 0.16 88)`): reward and achievement. Stars, streak indicators, achievement badges. Appears only in feedback moments.
- **Green** (`oklch(0.74 0.16 166)`): success. Correct answer states, completion checkmarks. Unambiguous positive feedback.
- **Red** (`oklch(0.65 0.22 18)`): error. Wrong answers only. Never appears in decorative contexts.

### Surfaces
- **bg** (`oklch(0.95 0.035 294)`): page background — a soft lavender tint rather than neutral grey
- **surface** (`oklch(0.99 0.006 294)`): card background — near-white with a trace of purple warmth
- **surface2** (`oklch(0.97 0.018 294)`): elevated surface — slightly more tinted than surface

### Text
- **text** (`oklch(0.24 0.055 284)`): primary text — deep cool-purple, not pure black
- **textMuted** (`oklch(0.48 0.065 292)`): secondary text — pinyin, labels, subtitles
- **textLight** (`oklch(0.66 0.05 292)`): tertiary text — word counts, meta labels

## 3. Typography

Single font: **Baloo 2** (Google Fonts). Loaded at weights 400, 500, 600, 700, 800. The rounded form factor of Baloo 2 matches the rounded border-radius system and reads well in Thai and Latin mixed contexts.

- **Display** (900, 40px, lh 1.1): App title in hero moments. Used once per screen.
- **Headline** (800, 32px, lh 1.2): Large word display on flashcards, section headings.
- **Title** (900, 24px, lh 1.25): Category names, quiz word display, card titles.
- **Body** (500, 16px, lh 1.5): Subtitles, descriptions, answer options.
- **Label** (700, 12px, lh 1): Metadata — word counts, "วันต่อเนื่อง", duration tags.

## 4. Elevation

Depth comes from the claymorphism system — not from flat material shadows. The three-layer formula:

1. **Outer shadow** (`0 6px 24px rgba(0,0,0,0.08)`): lifts the card off the background
2. **Inner top highlight** (`inset 0 1px 0 rgba(255,255,255,0.65)`): simulates a top light source
3. **White outer border** (`3px solid rgba(255,255,255,0.7)`): creates the "clay" edge thickness

For primary action buttons, the shadow intensifies to `0 8px 32px rgba(108,59,245,0.22)` with the purple hue — making the CTA feel warm and present.

## 5. Components

### Category Cards
The centrepiece component. Each card represents a vocabulary category (Animals, Colors, Food, etc.) with an emoji icon, category name in English/Chinese, a Thai translation, and two action buttons (Flashcard + Quiz).

- 2-column grid, 166px minimum height
- Background: category-specific pastel hue via `--card-color` CSS variable
- Before pseudo-element: `linear-gradient(150deg, rgba(255,255,255,0.58), transparent 72%)` — gives every card an upper-left light catch regardless of its color
- Hover: `translateY(-4px) scale(1.02)` with elevated shadow
- Completion badge: green check circle, top-right, absolute positioned

### Flashcard
A flip-card mechanic. Front shows the word/emoji; back reveals the English/Chinese. 3D perspective transform on click.

### Quiz Screen
- Large emoji at top (120px), acts as the visual anchor
- Word shown in the card; 4 answer options below in a 2×2 grid
- Correct: card border goes green, background tints green
- Wrong: card shakes (`@keyframes shake`), border goes red

### Progress Strip
Three stats in a pill-shaped container: categories completed, streak (fire emoji), daily goal with a mini progress bar. Serves as the primary motivation layer on the home screen.

### Gamification Tokens
- ⭐ **Stars**: displayed in a pill, top-right of home screen. Sparkle animation on increment.
- 🔥 **Streak**: fire emoji + day count. Displayed in progress strip.
- 🏅 **Badges**: completion milestones. Displayed in stats pill on language picker.

## 6. Motion

- `--transition-fast`: 150ms `cubic-bezier(0.22, 1, 0.36, 1)` — immediate feedback (tap states)
- `--transition-normal`: 250ms same easing — hover, focus transitions
- `--transition-slow`: 400ms `cubic-bezier(0.16, 1, 0.3, 1)` — screen transitions, card reveals
- Entrance: `@keyframes slideUp` (cards) and `@keyframes bounceIn` (category grid with staggered delay)
- Feedback: `@keyframes shake` (wrong answer), `@keyframes starSparkle` (star reward)
- Mascot: `@keyframes pandaBob` — gentle float, 2.5s loop

All animations respect `prefers-reduced-motion`. Comprehension never depends on seeing an animation.

## 7. Do's and Don'ts

### Do:
- **Do** use rounded values consistently — every interactive element uses the radius scale (sm/md/lg/xl/full). No custom radii.
- **Do** use claymorphism for cards — the three-layer formula (outer shadow + inner highlight + white border) is the system's depth signature.
- **Do** treat Baloo 2 weight contrast as the primary typographic tool. 900 for headings, 500 for body.
- **Do** use emoji as first-class visual content — they carry meaning (category icons, mascots, gamification rewards) and should be sized and filtered appropriately.
- **Do** distinguish the two learning tracks by color — purple for English, coral/red for Chinese. This spatial color identity helps children self-orient.
- **Do** use `oklch()` for all colors defined in theme.css. Maintain chroma in the moderate range (0.12–0.25) — never so saturated it vibrates.

### Don't:
- **Don't** remove the claymorphism border or inner highlight from cards — the tactile feel is part of what makes the app feel premium and child-appropriate.
- **Don't** use shadows on text or add glow effects to type. The emoji has `drop-shadow`; text does not.
- **Don't** animate layout properties (width, height, top, left). Stick to transform and opacity.
- **Don't** add thin (< 2px) borders as the only visual container — children need clear affordances.
- **Don't** use low-contrast text for functional content. `textLight` (`oklch(0.66 0.05 292)`) is only for non-critical metadata; quiz answers, category names, and navigation must use `text` or `textMuted`.
- **Don't** introduce a new font. Baloo 2 handles all three scripts (Latin, Thai, Chinese) with adequate quality.
