# Deploy Firestore Security Rules

The new username feature requires the app to write to the Firestore `users` collection. You need to update your Firestore security rules to allow this.

## Quick Deploy (PowerShell)

```powershell
# 1. Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy the rules
firebase deploy --only firestore:rules --project multiplication-kingdom-e8c53
```

## What the Rules Allow

✅ **Authenticated users** can:
- Create new user documents (signup)
- Read user profiles
- Write game scores to leaderboard
- Update/delete their own data

✅ **Anyone** can:
- Read the leaderboard (public scores)

❌ **No one** can:
- Write to unauthenticated leaderboard entries
- Modify other users' data
- Access other undeclared collections

## Verify Deployment

After deployment, try signing up again. The error should be gone!

To verify rules in Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **multiplication-kingdom-e8c53**
3. Go to **Firestore Database**
4. Click **Rules** tab
5. You should see the deployed rules

## Troubleshooting

If you get `Error: Could not locate a valid project for project id 'null'`:
- Make sure you have a `.firebaserc` file in the project root (should be auto-created by `firebase init`)
- Or specify the project explicitly: `firebase deploy --only firestore:rules --project multiplication-kingdom-e8c53`

## Manual Deploy via Console

Alternatively, copy the rules from `firestore.rules` and paste them into the Firebase Console:
1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with the contents of `firestore.rules`
3. Click **Publish**
