# Firebase Firestore Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **+ Create a project**
3. Enter project name: `multiplication-kingdom`
4. Continue through setup (disable Google Analytics is fine)
5. Once created, click on your project

## Step 2: Add a Web App

1. On the project dashboard, click the **Web** icon (</> symbol)
2. Register app with name `Multiplication Kingdom Web`
3. Copy the Firebase config object (looks like below):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "multiplication-kingdom-xxxxx.firebaseapp.com",
  projectId: "multiplication-kingdom-xxxxx",
  storageBucket: "multiplication-kingdom-xxxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};
```

## Step 3: Update Firebase Config

1. Open `src/config/firebase.js`
2. Replace the `firebaseConfig` object with your actual config from Step 2
3. Save the file

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **+ Create database**
3. Choose **Start in test mode** (for development)
4. Select region closest to you (or keep default)
5. Click **Create**

## Step 5: Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read leaderboard
    match /leaderboard/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // For now, allow all writes (add authentication later if needed)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

## Step 6: Firestore Database Structure

The app will automatically create collections:

```
firestore/
├── leaderboard/
│   └── {gameType}_{timestamp}/
│       ├── playerName: string
│       ├── gameType: string ("speed", "flashcard", "siege", etc.)
│       ├── score: object (varies by game)
│       ├── timestamp: timestamp
│       └── kingdomId: number (for Conquest games)
```

## Testing

1. Start your app: `npm run dev`
2. Create a player profile and play a game
3. Check Firebase Console → **Firestore Database** to see scores being saved
4. Scores should appear immediately in the app's leaderboard

## Environment Variables (Optional but Recommended)

For security, create a `.env.local` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Update `src/config/firebase.js` to use these:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

**Note:** Don't commit `.env.local` to GitHub (add to `.gitignore`)

## What's Next?

Once the config is set:
- Game scores will sync to Firestore automatically
- Leaderboard will fetch from cloud
- Local storage + cloud combines best of both worlds
- Students can still play offline, scores sync when online

## Troubleshooting

**"PERMISSION_DENIED: Missing or insufficient permissions"**
- Check Firestore Rules (Step 5)
- Make sure rules were published

**"Firebase config not found"**
- Verify `src/config/firebase.js` has correct config values
- Check no typos in Firebase project ID

**Scores not appearing in Firestore**
- Open browser DevTools → Console
- Look for Firebase errors
- Verify app is using updated `progress.js`

---

Let me know if you run into any issues!
