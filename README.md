# 👑 Learning Kingdom

**Master essential skills the fun way!** An engaging multi-subject educational platform for students ages 7–12, built with React 19 + Vite. Currently includes Multiplication Kingdom (12 kingdoms, one per times table) and Spelling, with plans for Language Arts and beyond. Earn stars, track progress on cloud-synced leaderboards, and play on web or Android.

> ✅ **Development Environment**: This project has been configured and is ready for local development. Run `npm run dev` to start the dev server at `http://localhost:5173`.

**🎮 Play now:** [multiplication-kingdom-e8c53.web.app](https://multiplication-kingdom-e8c53.web.app)

---

## ✨ Features

### 🏰 **Conquest Mode**
Explore 12 magical kingdoms, each dedicated to one multiplication table (1–12). Complete three unique game modes per kingdom to earn stars:
- **Flashcard Mode** — Take your time and test at your own pace
- **Speed Challenge** — Race against the clock for bonus points
- **Match Game** — Flip cards and match problems to their answers

Progress unlocks the next kingdom: Kingdom 1 is free, Kingdom 2 requires ≥1 star from Kingdom 1, and so on.

### 🃏 **Flashcard Challenge**
Practice all 12 times tables (1×1 to 12×12) with three timed game modes:
- **Timed Mode** — 60-second rounds with scoring and leaderboards
- **Sprint Mode** — Intense 30-second challenges
- **Practice Mode** — Learn at your own pace (untracked)

### 🧮 **Number Cruncher**
Fast-paced number entry training with calculator aesthetics. Enter multi-digit numbers (2–7 digits) within 5-second time limits. Features 8 progressive difficulty levels with scoring and cloud leaderboards.

### 📝 **Spelling Practice**
Build spelling skills through interactive word tests:
- Complete word lists with immediate corrective feedback
- Peek Hints reveal answers to learn from mistakes
- Cloud + local leaderboard tracks spelling progress

### ⚔️ **Kingdom Siege**
Defend your kingdom from invading towers by solving multiplication problems before they breach your defenses. How long can you survive?

### 🔊 **Audio Feedback**
- Real-time sound effects for correct/incorrect answers
- Customizable volume + mute toggle in every game mode
- Procedural tone fallback (works even without audio files)

### 👥 **User Profiles & Cloud Leaderboard**
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

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + React Router v7 |
| **Build Tool** | Vite (lightning-fast, HMR-enabled) |
| **Styling** | Plain CSS3 + custom properties (no Tailwind, no CSS-in-JS) |
| **State Management** | localStorage + React Context (no Redux) |
| **Cloud Backend** | Firebase Firestore (leaderboards, data sync) |
| **Authentication** | Firebase Auth (email + Guest mode) |
| **Mobile** | Capacitor v8 → Android deployment |
| **Minification** | R8/ProGuard (Android only) |
| **Hosting** | Firebase Hosting (GitHub Actions auto-deploy) |

---

## 🌐 Cross-Platform Support

Built as a **single responsive React codebase**, Learning Kingdom runs seamlessly across all devices:

- **Web** — Instant play on any modern browser (Chrome, Safari, Firefox, Edge). No installation needed.
- **Android** — Packaged via **Capacitor**, providing native app experience with offline storage and access to device features.
- **Desktop (PWA)** — Installable web app with offline fallback (service worker ready).

The same code, one build pipeline—web or Android—optimized for touch and keyboard.

---

## 📋 Prerequisites

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
| **Capacitor CLI** | v8+ | Bridge React → Android |

---

## 🚀 Getting Started

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

## 🏗️ Architecture

### Project Layout

```
src/
├── App.jsx              ← Route definitions (React Router, all routes defined here)
├── main.jsx             ← Entry point (React 19 strict mode)
├── index.css            ← Global CSS variables + theme
├── components/          ← React components (one .jsx + one .css per component)
│   ├── HomeScreen.jsx / HomeScreen.css
│   ├── KingdomMap.jsx / KingdomMap.css
│   ├── KingdomScreen.jsx / KingdomScreen.css
│   ├── SpeedChallenge.jsx / SpeedChallenge.css
│   ├── MatchGame.jsx / MatchGame.css
│   ├── FlashcardGame.jsx / FlashcardGame.css
│   ├── Leaderboard.jsx / Leaderboard.css
│   ├── AuthScreen.jsx / AuthScreen.css (Firebase Auth UI)
│   ├── ErrorBoundary.jsx (Error fallback component)
│   ├── spelling/ ← Spelling Practice subsystem
│   ├── number-cruncher/ ← Number entry training subsystem
│   └── ...
├── config/
│   ├── firebase.js      ← Firebase Firestore + Auth initialization
│   └── kingdomMapsConfig.js ← Kingdom configuration
├── data/
│   ├── questions.js     ← Procedurally generates KINGDOMS + ALL_QUESTIONS (no API)
│   ├── words.js
│   └── numberCruncher.js
├── store/
│   └── progress.js      ← localStorage read/write (mk_progress) + Firebase sync
├── hooks/
│   └── useSound.js      ← Audio playback abstraction
└── utils/
    ├── contentFilter.js
    ├── geminiSentenceGenerator.js
    └── ...
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

- **Component state** — Local UI state (current question, user input, animations)
- **localStorage** — Persistent across sessions (`mk_progress` key)
- **Firebase Firestore** — Cloud scores (leaderboards)
- **Helper functions** — `src/store/progress.js` exports: `getProgress()`, `awardStars()`, `saveGameScore()`, `syncScoreToFirebase()`

When your game ends:
1. Call `awardStars(kingdomId, starsEarned)` → updates localStorage
2. Call `saveGameScore(gameType, scoreData)` → syncs to Firestore
3. Navigate away, then back → component calls `getProgress()` on mount and sees updated state

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
  { id: 0, kingdomId: 1, question: "1 × 1 = ?", answer: 1 },
  // ... ~600 questions total (50 per kingdom)
];
```

- **KINGDOMS** — Array of 12 objects (indices 0–11; kingdom `id` is 1-based: 1 to 12)
- **ALL_QUESTIONS** — Flat array of every question across all kingdoms
- **Zero latency** — All questions are in-memory; no API calls

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
- `.fcg-*` — FlashcardGame
- `.speed-*` — SpeedChallenge
- `.match-*` — MatchGame

Each kingdom has a hardcoded color (from `KINGDOM_COLORS` array). Emojis are used as icons throughout (👑, ⚔️, 🃏, etc.)—this is intentional and skips icon file overhead.

### Key Design Patterns

#### 1. **Game Component Lifecycle**

Every game (Flashcard, Speed, Match, etc.) follows this 5-step pattern:

1. **Display** — Show question/challenge
2. **Collect** — Get user input (text, clicks, etc.)
3. **Validate** — Check answer → show 😊/😟 feedback
4. **Auto-advance** — Move to next question or manual next button
5. **Tally** — Calculate stars → `calcStars()` → `awardStars()` → navigate back

This ensures consistency across all game modes.

#### 2. **Star System**

- Kingdom 1 starts unlocked; Kingdom *n+1* unlocks when Kingdom *n* reaches ≥1 star.
- Stars are awarded based on score: `calcStars() = Math.ceil(score / maxScore * 3)` (max 3 stars)
- Stars never decrease (only increase); `awardStars()` always compares and updates if higher.
- After calling `awardStars()`, navigate away and back to reflect changes—components re-mount and call `getProgress()` fresh.

#### 3. **No Centralized Re-render Signal**

This is intentional. There's no EventBus or global state invalidation. Navigation is the signal: when you push a new route, the old component unmounts, then the new one mounts and fetches fresh state. This keeps the system predictable and bundle-small.

---

## ⚙️ Configuration

### Firebase Setup (Required for Leaderboards)

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for step-by-step instructions. In summary:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Create a Firestore database (test mode is fine for development)
3. Copy your Firebase config into `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

4. Deploy Firestore rules (see [DEPLOY_FIRESTORE_RULES.md](./docs/guides/DEPLOY_FIRESTORE_RULES.md))

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

## 🚀 Deployment

### Web Hosting (Firebase Hosting)

**Live:** [multiplication-kingdom-e8c53.web.app](https://multiplication-kingdom-e8c53.web.app)

#### Manual Deploy

```bash
npm run build
firebase deploy --only hosting
```

#### Automatic Deploy (GitHub Actions)

Push to `main` branch → GitHub Actions runs `.github/workflows/firebase-hosting-*.yml` → automatically deploys to Firebase Hosting. No manual steps needed after merging.

**Features:**
- ⚡ Global CDN (zero cold starts)
- 🔒 Automatic HTTPS
- 📊 Same Firebase project as backend (database is already syncing)

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
- **Release Bundle:** `android/app/build/outputs/bundle/release/app-release.aab` ← Upload to Play Store
- **Deobfuscation Map:** `android/app/build/outputs/mapping/release/mapping.txt` ← Upload alongside AAB

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

## 📄 License

This project is licensed under the **Apache License 2.0**. See [LICENSE](./LICENSE) for details.

---

## 📞 Support

For questions or bug reports, open an [Issue](https://github.com/joedifrancesco-collab/MultiplicationKingdom/issues) on GitHub.

**Happy learning! 👑✨**
│   ├── KingdomScreen.jsx
│   ├── Flashcard.jsx
│   ├── SpeedChallenge.jsx
│   ├── MatchGame.jsx
│   ├── FlashcardMenu.jsx
│   ├── FlashcardGame.jsx
│   ├── KingdomSiege.jsx
│   ├── Leaderboard.jsx
│   ├── NavBar.jsx
│   ├── number-cruncher/
│   │   ├── NumberCruncherScreen.jsx
│   │   ├── NumberCruncherGame.jsx
│   │   ├── NumberCruncherLeaderboard.jsx
│   │   └── number-cruncher.css
│   ├── spelling/
│   │   ├── SpellingScreen.jsx
│   │   ├── SpellingPractice.jsx
│   │   ├── SpellingLeaderboard.jsx
│   │   └── SpellingPractice.css
│   └── ErrorBoundary.jsx
├── data/
│   ├── questions.js      # All multiplication questions (1-12 tables)
│   └── words.js          # Spelling words database
├── config/
│   └── firebase.js       # Firebase Firestore initialization
├── store/
│   └── progress.js       # User profiles, progress tracking, Firebase sync
├── hooks/
│   └── useSound.js       # Sound effects hook
├── utils/
│   ├── soundManager.js
│   └── contentFilter.js
├── App.jsx               # Main router & authentication
└── index.css             # Global styles & theme variables
android/                  # Capacitor Android project
public/                   # Static assets & manifest
```

## 🎯 Game Progression

- **Progress Storage**: All progress stored in browser localStorage (device-local)
- **Multi-User Support**: Create multiple player profiles, easily switch between them
- **Star System**: Earn stars in each land by completing games (Speed Challenge: up to 3 stars per land)
- **High Scores**: Track best performances per game type
- **Leaderboard**: Compare scores with other players on the same device

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

ESLint is configured for React best practices. Check for issues:
```bash
npm run lint
```

## 🔥 Firebase Configuration (Leaderboards)

**Status:** Firebase Firestore is integrated for cloud-synced leaderboards.

### First-Time Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database and Firebase Authentication
3. Update `src/config/firebase.js` with your Firebase credentials
4. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   Rules allow authenticated users to read/write their own game data while maintaining public leaderboard access.

### Data Collections
- `leaderboard/{document}` - Multiplication game scores (public reads)
- `spelling_attempts/{document}` - Spelling test results (authenticated reads)
- `number_cruncher_attempts/{document}` - Number Cruncher scores (public reads)
- `users/{username}` - User profile data (public reads for signup validation)

### How It Works
- **Offline First**: All scores save to localStorage immediately
- **Background Sync**: Scores sync to Firebase when online
- **Fallback**: If Firebase is unavailable, local leaderboard still works
- **Public Leaderboards**: Game data is world-viewable; spelling data is private per user

**See [FIREBASE_SETUP.md](./docs/guides/FIREBASE_SETUP.md) and [FIRESTORE_RULES_UPDATE.md](./docs/guides/FIRESTORE_RULES_UPDATE.md) for detailed instructions.**

## 🌐 Web Deployment

This app is designed as a static site and can be deployed to any static hosting:

### Render.com (Recommended)
1. Connect GitHub repo
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Deploy!

### Other Platforms
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📦 Building for Multiple Platforms

This is a **hybrid app** using Capacitor:

```
┌─────────────────┐
│   React App     │
│   (src/)        │
└────────┬────────┘
         │
    ┌────▼────┐
    │   npm    │ → Vite builds to /dist
    │  build   │
    └────┬────┘
         │
    ┌────▼──────────────────────┐
    │   npx cap sync android    │
    │   (copies web app)        │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────┐
    │  ./gradlew bundle │ → app-release.aab
    │   Release        │
    └─────────────────┘
```

## 📄 License

MIT License - feel free to use this project for education and personal use.

## 🤝 Contributing

Contributions welcome! Please submit pull requests to improve gameplay, add features, or fix bugs.

## 📞 Support

For issues or questions:
- Open a GitHub Issue
- Check existing documentation in this README

---

**Happy Learning! Master multiplication and unlock the kingdom! 👑**
