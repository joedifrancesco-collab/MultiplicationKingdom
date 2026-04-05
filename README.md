# 👑 Multiplication Kingdom

Master multiplication tables the fun way! An engaging educational game for students ages 7-12, built with React and available on web and Android.

## 🎮 Features

### 🏰 Conquest
Explore 12 magical lands, each dedicated to one multiplication table (1-12). Each land offers two game modes:
- **Flashcard Mode** - Test your knowledge at your own pace
- **Speed Challenge** - Race against the clock

Earn stars by completing lands and track your progress!

### 🃏 Flashcard Challenge
Practice multiplication with flexible modes:
- **Timed Mode** - 60-second speed rounds with scoring
- **Sprint Mode** - 30-second intense challenges
- **Practice Mode** - Learn at your own pace (untracked)

Work through all 12 times tables (1×1 to 12×12).

### ⚔️ Kingdom Siege
Defend your kingdom by solving multiplication problems before towers breach your defenses. How long can you survive?

### � Audio Feedback
- Real-time sound effects for correct/incorrect answers
- Customizable volume and mute toggle in every game
- Procedural tone fallback system (works without audio files)

### �👥 User Profiles & Leaderboard
- Create and manage multiple player profiles
- Track personal high scores across all game modes
- View leaderboards organized by game type:
  - **Conquest** (Speed Challenge & Flashcard Mode)
  - **Flashcard Challenge** (Timed, Sprint, Practice)
  - **Kingdom Siege**
- All progress saved locally on your device

## 🛠 Tech Stack

- **Frontend**: React 19 + React Router v7
- **Build Tool**: Vite
- **Mobile**: Capacitor for Android deployment
- **State Management**: React Context / localStorage
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

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── HomeScreen.jsx
│   ├── KingdomMap.jsx
│   ├── KingdomScreen.jsx
│   ├── Flashcard.jsx
│   ├── SpeedChallenge.jsx
│   ├── FlashcardMenu.jsx
│   ├── FlashcardGame.jsx
│   ├── KingdomSiege.jsx
│   └── Leaderboard.jsx  # Multi-user leaderboard
├── data/
│   └── questions.js      # All multiplication questions (1-12 tables)
├── store/
│   └── progress.js       # User profiles & game progress tracking
├── App.jsx               # Main router
└── index.css             # Global styles
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
