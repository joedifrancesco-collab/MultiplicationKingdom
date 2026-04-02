# Clear Leaderboard Script

Quick utility to delete all scores from the Firestore `leaderboard` collection, useful for testing and resetting the leaderboard.

## Setup

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **multiplication-kingdom-e8c53**
3. Click ⚙️ **Project Settings** (top-left, next to project name)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** → saves `serviceAccountKey.json`
6. Move the file to your project root: `multiplication-kingdom/serviceAccountKey.json`

### 2. Run the Script

**PowerShell:**
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "$PWD/serviceAccountKey.json"
node scripts/clearLeaderboard.js
```

**Bash/Zsh:**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
node scripts/clearLeaderboard.js
```

The script will:
1. Fetch all leaderboard documents
2. Show the count
3. Ask for confirmation ("yes" to proceed)
4. Delete all documents in batches
5. Confirm completion

### ⚠️ Warning

This **permanently deletes all leaderboard scores**. Use only for:
- Local testing
- Development environments
- Resetting test data

---

## Alternative: Firebase Console

You can also delete documents manually via Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **multiplication-kingdom-e8c53** project
3. Go to **Firestore Database**
4. Click on **leaderboard** collection
5. For each document, click **Delete** (or select multiple and delete in batch)

---

## Security Note

⚠️ **Do NOT commit `serviceAccountKey.json` to git!** 

It's already in `.gitignore`, but never share this file publicly — it grants full database access.
