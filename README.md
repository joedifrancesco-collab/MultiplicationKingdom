# ðŸ‘‘ Learning Kingdom

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Lightning%20Fast-646cff?logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-ffca28?logo=firebase)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](./LICENSE)
[![Android](https://img.shields.io/badge/Mobile-Android-3ddc84?logo=android)](https://capacitorjs.com)

**Master essential skills the fun way!** An engaging multi-subject educational platform for students ages 7â€“12, built with React 19 + Vite. Currently includes Multiplication Kingdom (12 kingdoms, one per times table) and Spelling, with plans for Language Arts and beyond. Earn stars, track progress on cloud-synced leaderboards, and play on web or Android.

> âœ… **Development Environment**: This project has been configured and is ready for local development. Run `npm run dev` to start the dev server at `http://localhost:5173`.

**ðŸŽ® Play now:** [multiplication-kingdom-e8c53.web.app](https://multiplication-kingdom-e8c53.web.app)

---

## ðŸ“– Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Cross-Platform Support](#-cross-platform-support)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Configuration](#ï¸-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [Resources](#-additional-resources)
- [License](#-license)
- [Support](#-support)

---

## âœ¨ Features

### ðŸ° **Conquest Mode**
Explore 12 magical kingdoms, each dedicated to one multiplication table (1â€“12). Complete three unique game modes per kingdom to earn stars:
- **Flashcard Mode** â€” Take your time and test at your own pace
- **Speed Challenge** â€” Race against the clock for bonus points
- **Match Game** â€” Flip cards and match problems to their answers

Progress unlocks the next kingdom: Kingdom 1 is free, Kingdom 2 requires â‰¥1 star from Kingdom 1, and so on.

### ðŸƒ **Flashcard Challenge**
Practice all 12 times tables (1Ã—1 to 12Ã—12) with three timed game modes:
- **Timed Mode** â€” 60-second rounds with scoring and leaderboards
- **Sprint Mode** â€” Intense 30-second challenges
- **Practice Mode** â€” Learn at your own pace (untracked)

### ðŸ§® **Number Cruncher**
Fast-paced number entry training with calculator aesthetics. Enter multi-digit numbers (2â€“7 digits) within 5-second time limits. Features 8 progressive difficulty levels with scoring and cloud leaderboards.

### ðŸ“ **Spelling Practice**
Build spelling skills through interactive word tests:
- Complete word lists with immediate corrective feedback
- Peek Hints reveal answers to learn from mistakes
- Cloud + local leaderboard tracks spelling progress

### âš”ï¸ **Kingdom Siege**
Defend your kingdom from invading towers by solving multiplication problems before they breach your defenses. How long can you survive?

### ðŸ”Š **Audio Feedback**
- Real-time sound effects for correct/incorrect answers
- Customizable volume + mute toggle in every game mode
- Procedural tone fallback (works even without audio files)

### ðŸ‘¥ **User Profiles & Cloud Leaderboard**
- Create and manage multiple player profiles
- Track personal high scores across all game modes
- Cloud-synced leaderboards for:
  - Conquest (Speed Challenge & Flashcard Mode)
  - Flashcard Challenge (Timed, Sprint, Practice)
  - Kingdom Siege
  - Number Cruncher
  - Spelling Attempts
- All progress saved locally + synced to Firebase Firestore

---

## ðŸ› ï¸ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + React Router v7 |
| **Build Tool** | Vite (lightning-fast, HMR-enabled) |
| **Styling** | Plain CSS3 + custom properties (no Tailwind, no CSS-in-JS) |
| **State Management** | localStorage + React Context (no Redux) |
| **Cloud Backend** | Firebase Firestore (leaderboards, data sync) |
| **Authentication** | Firebase Auth (email + Guest mode) |
| **Mobile** | Capacitor v8 â†’ Android deployment |
| **Minification** | R8/ProGuard (Android only) |
| **Hosting** | Firebase Hosting (GitHub Actions auto-deploy) |

---

## ðŸŒ Cross-Platform Support

Built as a **single responsive React codebase**, Learning Kingdom runs seamlessly across all devices:

- **Web** â€” Instant play on any modern browser (Chrome, Safari, Firefox, Edge). No installation needed.
- **Android** â€” Packaged via **Capacitor**, providing native app experience with offline storage and access to device features.
- **Desktop (PWA)** â€” Installable web app with offline fallback (service worker ready).

The same code, one build pipelineâ€”web or Androidâ€”optimized for touch and keyboard.

---

## ðŸ“‹ Prerequisites

### Development

| Tool | Version | Why |
|------|---------|-----|
| **Node.js** | v18+ | JavaScript runtime |
| **npm** | v9+ | Package manager |
| **Git** | Any | Version control |

### Android Deployment

| Tool | Version | Why |
|------|---------|-----|
| **Java** | 21 (via Android Studio JDK) | Required by Gradle 8+ |
| **Android SDK** | API 31+ | Target Android 12+ |
| **Gradle** | v8+ | Build automation |
| **Capacitor CLI** | v8+ | Bridge React â†’ Android |

---

## ðŸš€ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/joedifrancesco-collab/MultiplicationKingdom.git
cd multiplication-kingdom
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module reloading enabled.

### 3. Build for Production

```bash
npm run build
```

Outputs optimized, minified build to `dist/` folder.

### 4. Preview Production Build Locally

```bash
npm run preview
```

Test your production build before deploying.

### 5. Linting

```bash
npm run lint
```

Check for code quality issues using ESLint.

---

## ðŸ—ï¸ Architecture

### Project Layout

```
src/
â”œâ”€â”€ App.jsx              â† Route definitions (React Router, all routes defined here)
â”œâ”€â”€ main.jsx             â† Entry point (React 19 strict mode)
â”œâ”€â”€ index.css            â† Global CSS variables + theme
â”œâ”€â”€ components/          â† React components (one .jsx + one .css per component)
â”‚   â”œâ”€â”€ HomeScreen.jsx / HomeScreen.css
â”‚   â”œâ”€â”€ KingdomMap.jsx / KingdomMap.css
â”‚   â”œâ”€â”€ KingdomScreen.jsx / KingdomScreen.css
â”‚   â”œâ”€â”€ SpeedChallenge.jsx / SpeedChallenge.css
â”‚   â”œâ”€â”€ MatchGame.jsx / MatchGame.css
â”‚   â”œâ”€â”€ FlashcardGame.jsx / FlashcardGame.css
â”‚   â”œâ”€â”€ Leaderboard.jsx / Leaderboard.css
â”‚   â”œâ”€â”€ AuthScreen.jsx / AuthScreen.css (Firebase Auth UI)
â”‚   â”œâ”€â”€ ErrorBoundary.jsx (Error fallback component)
â”‚   â”œâ”€â”€ spelling/ â† Spelling Practice subsystem
â”‚   â”œâ”€â”€ number-cruncher/ â† Number entry training subsystem
â”‚   â””â”€â”€ ...
â”œâ”€â”€ config/
â”‚   â”œâ”€â”€ firebase.js      â† Firebase Firestore + Auth initialization
â”‚   â””â”€â”€ kingdomMapsConfig.js â† Kingdom configuration
â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ questions.js     â† Procedurally generates KINGDOMS + ALL_QUESTIONS (no API)
â”‚   â”œâ”€â”€ words.js
â”‚   â””â”€â”€ numberCruncher.js
â”œâ”€â”€ store/
â”‚   â””â”€â”€ progress.js      â† localStorage read/write (mk_progress) + Firebase sync
â”œâ”€â”€ hooks/
â”‚   â””â”€â”€ useSound.js      â† Audio playback abstraction
â””â”€â”€ utils/
    â”œâ”€â”€ contentFilter.js
    â”œâ”€â”€ geminiSentenceGenerator.js
    â””â”€â”€ ...
```

### Route Map

| Route | Component | Purpose |
|-------|-----------|---------|
| `/auth` | `AuthScreen` | Firebase authentication (email/password + Guest) |
| `/` | `HomeScreen` | Mode selection (Conquest, Flashcards, Siege, etc.) |
| `/kingdom` | `KingdomMap` | Grid of all 12 kingdoms with unlock status + star counts |
| `/kingdom/:id` | `KingdomScreen` | Three game buttons for kingdom |
| `/kingdom/:id/flashcard` | `Flashcard` | Conquest Flashcard Mode |
| `/kingdom/:id/speed` | `SpeedChallenge` | Conquest Speed Challenge Mode |
| `/kingdom/:id/match` | `MatchGame` | Conquest Match Game Mode |
| `/flashcards` | `FlashcardMenu` | Flashcard Challenge setup screen |
| `/flashcards/play` | `FlashcardGame` | Flashcard Challenge (timed/sprint/practice) |
| `/siege` | `KingdomSiege` | Tower Defense multiplication game |
| `/spelling` | `SpellingScreen` | Spelling Practice home |
| `/spelling/practice` | `SpellingPractice` | Spelling test interface |
| `/spelling/leaderboard` | `SpellingLeaderboard` | Spelling results |
| `/number-cruncher` | `NumberCruncherScreen` | Number entry training home |
| `/number-cruncher/play` | `NumberCruncherGame` | Number entry game |

### State Management

**No Redux, no Context API.** State is kept simple:

- **Component state** â€” Local UI state (current question, user input, animations)
- **localStorage** â€” Persistent across sessions (`mk_progress` key)
- **Firebase Firestore** â€” Cloud scores (leaderboards)
- **Helper functions** â€” `src/store/progress.js` exports: `getProgress()`, `awardStars()`, `saveGameScore()`, `syncScoreToFirebase()`

When your game ends:
1. Call `awardStars(kingdomId, starsEarned)` â†’ updates localStorage
2. Call `saveGameScore(gameType, scoreData)` â†’ syncs to Firestore
3. Navigate away, then back â†’ component calls `getProgress()` on mount and sees updated state

**Why no reactive store?** Components are simple, routes are sparse, and navigation re-mounts components naturally. This approach minimizes bundle size and keeps state mutation predictable.

### Data Layer: Procedural Generation

**No database fetches.** All questions are generated at startup:

```javascript
// src/data/questions.js
export const KINGDOMS = [
  { id: 1, table: 1, name: "Forest Kingdom", ... },
  { id: 2, table: 2, name: "Mountain Kingdom", ... },
  // ... 12 total
];

export const ALL_QUESTIONS = [
  { id: 0, kingdomId: 1, question: "1 Ã— 1 = ?", answer: 1 },
  // ... ~600 questions total (50 per kingdom)
];
```

- **KINGDOMS** â€” Array of 12 objects (indices 0â€“11; kingdom `id` is 1-based: 1 to 12)
- **ALL_QUESTIONS** â€” Flat array of every question across all kingdoms
- **Zero latency** â€” All questions are in-memory; no API calls

### Styling Conventions

**Plain CSS only** (no Tailwind, no CSS modules). Global theme defined in `src/index.css`:

```css
:root {
  --primary: #6C63FF;
  --secondary: #FF6B6B;
  --success: #6BCB77;
  --accent: #FFD93D;
  --bg: #F0F4FF;
  --radius: 16px;
}
```

**Component CSS classes** are scoped with kebab-case prefixes:
- `.fcg-*` â€” FlashcardGame
- `.speed-*` â€” SpeedChallenge
- `.match-*` â€” MatchGame

Each kingdom has a hardcoded color (from `KINGDOM_COLORS` array). Emojis are used as icons throughout (ðŸ‘‘, âš”ï¸, ðŸƒ, etc.)â€”this is intentional and skips icon file overhead.

### Key Design Patterns

#### 1. **Game Component Lifecycle**

Every game (Flashcard, Speed, Match, etc.) follows this 5-step pattern:

1. **Display** â€” Show question/challenge
2. **Collect** â€” Get user input (text, clicks, etc.)
3. **Validate** â€” Check answer â†’ show ðŸ˜Š/ðŸ˜Ÿ feedback
4. **Auto-advance** â€” Move to next question or manual next button
5. **Tally** â€” Calculate stars â†’ `calcStars()` â†’ `awardStars()` â†’ navigate back

This ensures consistency across all game modes.

#### 2. **Star System**

- Kingdom 1 starts unlocked; Kingdom *n+1* unlocks when Kingdom *n* reaches â‰¥1 star.
- Stars are awarded based on score: `calcStars() = Math.ceil(score / maxScore * 3)` (max 3 stars)
- Stars never decrease (only increase); `awardStars()` always compares and updates if higher.
- After calling `awardStars()`, navigate away and back to reflect changesâ€”components re-mount and call `getProgress()` fresh.

#### 3. **No Centralized Re-render Signal**

This is intentional. There's no EventBus or global state invalidation. Navigation is the signal: when you push a new route, the old component unmounts, then the new one mounts and fetches fresh state. This keeps the system predictable and bundle-small.

---

## âš™ï¸ Configuration

### Firebase Setup (Required for Leaderboards)

See the [Firebase Configuration](#%EF%B8%8F-configuration) section above for complete setup instructions, including:
- Creating a Firebase project
- Configuring credentials in `src/config/firebase.js`
- Deploying Firestore security rules
- Data structure and sync behavior

For detailed step-by-step guidance, see [FIREBASE_SETUP.md](./docs/guides/FIREBASE_SETUP.md).

### Environment Variables (Optional)

For sensitive data (API keys, etc.), create `.env.local`:

```
VITE_SOME_SECRET=value
```

Access in code via `import.meta.env.VITE_SOME_SECRET`. This file is git-ignored (never commit it).

### Key Configuration Files

| File | Purpose |
|------|---------|
| [vite.config.js](./vite.config.js) | Vite build & dev server config |
| [eslint.config.js](./eslint.config.js) | Code quality rules |
| [capacitor.config.json](./capacitor.config.json) | Android app metadata (name, version, plugins) |
| [public/manifest.json](./public/manifest.json) | PWA manifest |
| [.github/workflows/](./github/workflows) | GitHub Actions (auto-deploy on push) |

---

## ðŸš€ Deployment

### Web Hosting (Firebase Hosting)

**Live:** [multiplication-kingdom-e8c53.web.app](https://multiplication-kingdom-e8c53.web.app)

#### Manual Deploy

```bash
npm run build
firebase deploy --only hosting
```

#### Automatic Deploy (GitHub Actions)

Push to `main` branch â†’ GitHub Actions runs `.github/workflows/firebase-hosting-*.yml` â†’ automatically deploys to Firebase Hosting. No manual steps needed after merging.

**Features:**
- âš¡ Global CDN (zero cold starts)
- ðŸ”’ Automatic HTTPS
- ðŸ“Š Same Firebase project as backend (database is already syncing)

### Android Deployment (Google Play Store)

#### Prerequisites

Set up your environment first:

```powershell
# Extract from Android Studio JDK
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

#### Build Release Bundle

```bash
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

**Output files:**
- **Release Bundle:** `android/app/build/outputs/bundle/release/app-release.aab` â† Upload to Play Store
- **Deobfuscation Map:** `android/app/build/outputs/mapping/release/mapping.txt` â† Upload alongside AAB

#### Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Open your app → **Release** → **Production**
3. Upload `.aab` file + mapping file
4. Add release notes and screenshots
5. Review and publish

> **Note:** First release requires Play Store setup (developer account, app listing, screenshots, privacy policy). See [PRIVACY_POLICY.md](./PRIVACY_POLICY.md).

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create a feature branch:** `git checkout -b feature/your-feature`
3. **Make your changes** following project conventions:
   - One component = one `.jsx` + one `.css` file (co-located)
   - Use kebab-case for CSS class prefixes
   - No inline styles (use CSS files)
   - Test on both web and Android (if mobile-related)
4. **Lint before committing:** `npm run lint`
5. **Commit with clear messages:** `git commit -m "Add feature X"`
6. **Push and open a Pull Request**

**Project conventions** are documented in [.github/copilot-instructions.md](./.github/copilot-instructions.md).

---

## 🐛 Troubleshooting

### Common Issues

#### **"Cannot find module" / Build fails after git clone**

**Cause:** Dependencies not installed or corrupted.

**Fix:**
```bash
npm install
npm run build
```

#### **Dev server won't start (port 5173 in use)**

Check what's using port 5173:

**Windows:**
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5173
kill -9 <PID>
```

Then `npm run dev` again.

#### **Firebase config missing – leaderboard is empty**

**Cause:** `src/config/firebase.js` not configured.

**Fix:** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md). Copy your Firebase project config into `src/config/firebase.js`, then restart dev server.

#### **Android build fails with "Java version"**

**Cause:** Java 21 not set or Android Studio JDK not in PATH.

**Fix:**
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

#### **Slow HMR (hot reload) on Windows**

**Cause:** File watcher limits with many files.

**Fix:** Increase Node's file descriptor limit:
```bash
# Add to vite.config.js watchOptions
watch: {
  usePolling: false,
  interval: 100
}
```

#### **Sound effects not playing**

**Cause:** Browser blocked autoplay or audio context not initialized.

**Fix:**
- Allow audio in browser permissions
- Test with `useSound()` hook in browser console
- Check browser console for audio errors

#### **Stars not updating after game**

**Cause:** Component didn't re-mount; state cached from previous session.

**Fix:** Navigate away from Kingdom Screen, then back. Components call `getProgress()` on mount and see fresh state. Or hard-refresh the page (Ctrl+Shift+R).

#### **Spelling admin not accessible**

**Cause:** Role-based access not granted.

**Fix:** Contact the admin or check `SpellingAdmin.jsx` for role-checking logic.

---

## 📚 Additional Resources

- **React 19 Docs:** [react.dev](https://react.dev)
- **Vite Docs:** [vitejs.dev](https://vitejs.dev)
- **Firebase Docs:** [firebase.google.com](https://firebase.google.com)
- **Capacitor Docs:** [capacitorjs.com](https://capacitorjs.com)
- **React Router Docs:** [reactrouter.com](https://reactrouter.com)

---

## 📸 Screenshots

### Web App
| Feature | Description |
|---------|-------------|
| **Home Screen** | Select your learning mode (Conquest, Flashcards, Spelling, Number Cruncher) |
| **Conquest Mode** | Unlock kingdoms by earning stars; progress cascades through the realm |
| **Speed Challenge** | Race against the clock and climb the leaderboard |
| **US States Map** | Interactive state map with detailed info panel (elevation, area, history) |
| **Leaderboard** | Cloud-synced scores across all players |

### Mobile App (Android)
- Fully responsive touch interface
- Optimized for phone screens (4.5" – 6.7")
- Available on Google Play Store

---

## 📄 License

This project is licensed under the **Apache License 2.0**. See [LICENSE](./LICENSE) for details.

---

## 📞 Support

For questions or bug reports, open an [Issue](https://github.com/joedifrancesco-collab/MultiplicationKingdom/issues) on GitHub.

**Happy learning! 👑✨**
