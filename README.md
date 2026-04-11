# 👑 Multiplication Kingdom

Master multiplication tables the fun way! An engaging educational game for students ages 7-12, built with React and available on web and Android.

## 🎮 Features

### 🏰 Conquest
Explore 12 magical lands, each dedicated to one multiplication table (1-12). Each land offers three game modes:
- **Flashcard Mode** - Test your knowledge at your own pace
- **Speed Challenge** - Race against the clock
- **Match Game** - Match problems to their answers

Earn stars by completing lands and track your progress!

### 🃏 Flashcard Challenge
Practice multiplication with flexible modes:
- **Timed Mode** - 60-second speed rounds with scoring
- **Sprint Mode** - 30-second intense challenges
- **Practice Mode** - Learn at your own pace (untracked)

Work through all 12 times tables (1×1 to 12×12).

### 🧮 Number Cruncher
Fast-paced number entry training game with calculator aesthetics. Players enter multi-digit numbers (2-7 digits) within 5-second time limits. Features 8 progressive difficulty levels with scoring and leaderboards.

### 📝 Spelling Practice
Build spelling skills through interactive spelling tests with:
- **Spelling Practice Mode** - Complete word lists with immediate feedback
- **Spelling Leaderboard** - Track your spelling progress (cloud+local storage)
- **Peek Hints** - Learn from mistakes with answer previews

### ⚔️ Kingdom Siege
Defend your kingdom by solving multiplication problems before towers breach your defenses. How long can you survive?

### � Audio Feedback
- Real-time sound effects for correct/incorrect answers
- Customizable volume and mute toggle in every game
- Procedural tone fallback system (works without audio files)

### 👥 User Profiles & Cloud Leaderboard
- Create and manage multiple player profiles
- Track personal high scores across all game modes
- Cloud-synced leaderboards for:
  - **Conquest** (Speed Challenge & Flashcard Mode)
  - **Flashcard Challenge** (Timed, Sprint, Practice)
  - **Kingdom Siege**
  - **Number Cruncher**
  - **Spelling Attempts**
- All progress saved locally on your device + synced to Firebase

## 🛠 Tech Stack

- **Frontend**: React 19 + React Router v7
- **Build Tool**: Vite
- **Mobile**: Capacitor for Android deployment
- **State Management**: React Context / localStorage
- **Cloud Backend**: Firebase Firestore (leaderboards + data sync)
- **Authentication**: Firebase Auth
- **Styling**: CSS3
- **Minification**: R8/ProGuard (Android)

## 🌐 Cross-Platform Support

Built with **React 19 and Vite**, Multiplication Kingdom runs seamlessly on desktop and mobile browsers through a single, responsive codebase. The web app is instantly playable on any modern browser—no installation needed. For mobile-first users, **Capacitor bridges React to native Android**, allowing the same application to be packaged as a mobile app with access to native features like offline storage and push notifications.

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For version control

*For Android development:*
- Java 21 (via Android Studio JDK)
- Android SDK & Gradle
- Capacitor CLI

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173` with hot module reloading.

### 3. Production Build
```bash
npm run build
```
Outputs optimized build to `dist/` folder.

### 4. Preview Production Build
```bash
npm run preview
```
Test your production build locally.

## 📱 Android Deployment

### Set JAVA_HOME (First Time Only)
```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### Build Release Bundle
```bash
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`
**Deobfuscation Map**: `android/app/build/outputs/mapping/release/mapping.txt`

Upload both to Google Play Console with your release notes.

## 🌍 Web Hosting

### Firebase Hosting (Recommended)
The app is hosted on **Firebase Hosting** with automatic SPA routing:

**Live URL:** https://multiplication-kingdom-e8c53.web.app

**Features:**
- ⚡ Lightning-fast global CDN (no cold starts)
- 🔒 Automatic HTTPS
- ♻️ Automatic deployments on every `git push` to main
- 📊 Same Firebase project as your backend

**Deploy manually:**
```bash
npm run build
firebase deploy --only hosting
```

**Deploy automatically:** Push to `main` branch and GitHub Actions will deploy automatically (see `.github/workflows/firebase-hosting-*.yml`)

## 📂 Project Structure

```
src/
├── components/          # React components (one .jsx + one .css file per component)
│   ├── HomeScreen.jsx
│   ├── KingdomMap.jsx
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

**See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) and [FIRESTORE_RULES_UPDATE.md](./FIRESTORE_RULES_UPDATE.md) for detailed instructions.**

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
