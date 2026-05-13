# Big City Education — Copilot Instructions

A modular educational platform for ages 7–12, built with React 19 + Vite. Currently includes multiplication (12 kingdoms, one per times table), spelling, and geography (US States game). Available as a responsive web app with Firebase backend for leaderboards.

---

## Build & Dev Commands

```bash
npm run dev          # Vite dev server → http://localhost:5173 (hot reload)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint check
npm start            # Build and start Node.js server
```

---

## Architecture

```
src/
  App.jsx            ← React Router route definitions (all routes live here)
  main.jsx           ← Entry point, React 19 strict mode
  index.css          ← Global CSS custom properties / theme variables
  components/        ← One .jsx + one .css file per component (co-located)
  config/
    firebase.js      ← Firebase Firestore initialization (centralized leaderboard)
  data/questions.js  ← Procedurally generates KINGDOMS and ALL_QUESTIONS (no API)
  store/progress.js  ← localStorage reads/writes (mk_progress key) + Firebase sync
```

**Route map:**
- `/` — `HomeScreen` (mode selection)
- `/kingdom` → `KingdomMap`, `/kingdom/:id` → `KingdomScreen`
- `/kingdom/:id/flashcard` → `FlashcardGame`
- `/kingdom/:id/speed` → `SpeedChallenge`
- `/kingdom/:id/match` → `MatchGame`
- `/flashcards` → `FlashcardMenu`, `/flashcards/play` → `Flashcard`
- `/siege` → `KingdomSiege`

---

## Key Conventions

### State Management
- **No Redux or Context API.** State is managed via plain `localStorage` through helpers in `src/store/progress.js`.
- Components call `getProgress()` fresh on mount — there is no shared reactive store.
- `awardStars(kingdomId, stars)` updates stars (never decreases) and cascades to unlock the next kingdom.
- Kingdom 1 starts unlocked; kingdom *n+1* unlocks when kingdom *n* reaches ≥ 1 star.

### Data Layer
- Questions are generated procedurally in `src/data/questions.js` — no fetches, no database.
- `KINGDOMS` is an array of 12 objects (indices 0–11); kingdom `id` is 1-based (`1` to `12`).
- `ALL_QUESTIONS` is a flat array of every question across all kingdoms.

### Component Pattern
Every game component follows the same lifecycle:
1. Display question / challenge
2. Collect user input (text input for math, clicks for Match)
3. Validate answer → show immediate emoji feedback
4. Auto-advance or manual next
5. Tally score → `calcStars()` → `awardStars()` → navigate back

### Naming
| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `FlashcardGame.jsx` |
| CSS selectors | Scoped kebab-case prefix | `.fcg-*`, `.speed-*`, `.match-*` |
| Functions | camelCase | `awardStars`, `handleSubmit` |
| CSS variables | `--` kebab in `index.css` | `--primary`, `--radius` |

### Styling
- Plain CSS — no Tailwind, no CSS modules, no styled-components.
- Global theme in `src/index.css`: `--primary: #6C63FF`, `--secondary: #FF6B6B`, `--success: #6BCB77`, `--accent: #FFD93D`, `--bg: #F0F4FF`, `--radius: 16px`.
- Each kingdom has a hardcoded color from `KINGDOM_COLORS` (array in `KingdomMap.jsx`/`KingdomScreen.jsx`).
- Emoji are used as icons throughout (e.g., 👑, ⚔️, 🃏) — this is intentional.

---

## Firebase Setup (Centralized Leaderboard)

**Status:** Integrated via Firebase Firestore (games sync scores to cloud automatically).

**Configuration:**
- Config file: `src/config/firebase.js`
- Integration: `src/store/progress.js` — functions `syncScoreToFirebase()`, `fetchAggregatedLeaderboard()`
- Leaderboard UI: `src/components/Leaderboard.jsx` loads cloud scores on mount

**How it works:**
1. When `saveGameScore(gameType, data)` is called, scores are saved to localStorage AND synced to Firestore
2. Leaderboard component fetches top scores from Firestore (cloud) on mount
3. Local players show in the leaderboard alongside cloud scores
4. Fallback: if Firebase is unavailable, local leaderboard still works

**First time setup:**
- See `FIREBASE_SETUP.md` for complete instructions
- Must configure `src/config/firebase.js` with your Firebase project credentials
- Create Firestore database with rules allowing read-only public access

**Notes:**
- Scores sync in background without blocking gameplay
- Firebase errors fail silently (games still work offline)
- Free Firebase tier supports leaderboards for small schools/classrooms

---

## Known Pitfalls

- **No centralized re-render signal.** After calling `awardStars()`, navigate away and back to see updated star counts — components won't auto-update mid-session without re-mounting.
- **Firebase config required.** App starts but leaderboard shows empty until `src/config/firebase.js` is configured with real credentials.
- **Android only** for mobile — no iOS Capacitor setup.
- **No error boundaries.** Games can white-screen on unexpected state; add `<ErrorBoundary>` when reliability matters.
- **Focus management in games.** `inputRef.current?.focus()` is called after state changes; rapid interactions can cause focus to be lost.

---

## Exemplary Files

- [src/components/SpeedChallenge.jsx](../src/components/SpeedChallenge.jsx) — best example of full game loop + star calculation
- [src/components/MatchGame.jsx](../src/components/MatchGame.jsx) — card flip state, blocking animation pattern
- [src/store/progress.js](../src/store/progress.js) — all unlock/star logic
- [src/data/questions.js](../src/data/questions.js) — procedural question generation pattern
