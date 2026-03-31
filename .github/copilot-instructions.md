# Multiplication Kingdom — Copilot Instructions

An educational multiplication game for ages 7–12, built with React 19 + Vite. Students explore 12 kingdoms (one per times table), earning stars by completing three game modes per kingdom. Available on web and Android via Capacitor.

---

## Build & Dev Commands

```bash
npm run dev          # Vite dev server → http://localhost:5173 (hot reload)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint check
```

**Android release bundle:**
```powershell
# Set JAVA_HOME first (Android Studio JDK)
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

npm run build
npx cap sync android
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Architecture

```
src/
  App.jsx            ← React Router route definitions (all routes live here)
  main.jsx           ← Entry point, React 19 strict mode
  index.css          ← Global CSS custom properties / theme variables
  components/        ← One .jsx + one .css file per component (co-located)
  data/questions.js  ← Procedurally generates KINGDOMS and ALL_QUESTIONS (no API)
  store/progress.js  ← All localStorage reads/writes (mk_progress key)
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

## Known Pitfalls

- **No centralized re-render signal.** After calling `awardStars()`, navigate away and back to see updated star counts — components won't auto-update mid-session without re-mounting.
- **localStorage only.** Progress is device-local and lost on browser/app data clear. No cloud sync.
- **Android only** for mobile — no iOS Capacitor setup.
- **No error boundaries.** Games can white-screen on unexpected state; add `<ErrorBoundary>` when reliability matters.
- **Focus management in games.** `inputRef.current?.focus()` is called after state changes; rapid interactions can cause focus to be lost.

---

## Exemplary Files

- [src/components/SpeedChallenge.jsx](../src/components/SpeedChallenge.jsx) — best example of full game loop + star calculation
- [src/components/MatchGame.jsx](../src/components/MatchGame.jsx) — card flip state, blocking animation pattern
- [src/store/progress.js](../src/store/progress.js) — all unlock/star logic
- [src/data/questions.js](../src/data/questions.js) — procedural question generation pattern
