# Firestore Security Rules Update - Authentication

**Status:** Firebase Authentication has been integrated. Firestore security rules need to be updated to work with the new authentication system.

## Updated Document Structure

Leaderboard collection now stores documents with user authentication info:

```json
{
  "uid": "user-123",
  "email": "player@example.com",
  "gameType": "speed",
  "stars": 3,
  "correct": 12,
  "total": 12,
  "kingdomId": 5,
  "kingdomName": "5 Times Table",
  "timestamp": "2026-04-01T..."
}
```

## New Security Rules

Replace the Firestore security rules with these rules that allow:
- ✅ **Anyone** to read leaderboard scores (public view)
- ✅ **Only authenticated users** to write their own scores

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leaderboard: Anyone can read, only authenticated users can write
    match /leaderboard/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.uid;
      allow delete: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

## How to Update Rules

1. Go to **Firebase Console** → Your Project → **Firestore Database** → **Rules** tab
2. Replace the existing rules with the rules above
3. Click **Publish**
4. Verify that:
   - Public users can view the leaderboard
   - Authenticated users can submit scores
   - Users cannot modify other users' scores

## Testing the Rules

- **Before signing in:** Leaderboard should be readable but empty (no recent scores)
- **After signing in:** Users should be able to submit scores
- **Anonymous writes:** Should be rejected with "auth/configuration-not-found" or similar permission error

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `auth/configuration-not-found` | Rules requiring auth but no auth info sent | Ensure user is authenticated before trying to write |
| `permission-denied` | User trying to write another user's score | Verify rules check `request.auth.uid == request.resource.data.uid` |
| Leaderboard appears empty | Rules too restrictive | Check that `allow read: if true;` is present |

## Notes

- Each score write creates a new document (no updates to existing scores)
- `uid` and `email` are automatically set from the authenticated user
- Scores can only be written if the user is signed in
- The leaderboard remains readable by everyone (public viewing)
