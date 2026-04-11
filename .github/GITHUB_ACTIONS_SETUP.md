# GitHub Actions Firebase Deployment Setup

This guide explains how to set up automatic Firebase deployments on every push to the main branch.

## 🔐 Prerequisites

You need to generate a **Firebase CI token** to authenticate GitHub Actions with Firebase.

### Step 1: Generate Firebase CI Token

Run this command locally:
```bash
firebase login:ci
```

This will:
1. Open your browser to authenticate
2. Return a long token string
3. Display a message: "Success! Use this token to login on a CI server..."

**Copy this token** — you'll need it in Step 3.

### Step 2: Add GitHub Repository Secret

1. Go to your GitHub repository: https://github.com/joedifrancesco-collab/MultiplicationKingdom
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. **Name:** `FIREBASE_TOKEN`
5. **Value:** Paste the token from Step 1
6. Click **Add secret**

### Step 3: Verify Workflows Are Enabled

1. In your GitHub repository, click **Actions** tab
2. You should see two workflows:
   - `Deploy to Firebase Hosting on merge`
   - `Deploy to Firebase Hosting on PR`

If you don't see them, go to **Actions** → **New workflow** and make sure the workflows in `.github/workflows/` are recognized.

## 🚀 How It Works

### On Push to Main
When you push to the `main` branch:
1. GitHub Actions automatically runs
2. Builds your app (`npm run build`)
3. Deploys to Firebase Hosting
4. Your app is live in ~2-3 minutes

**No manual `firebase deploy` needed!**

### On Pull Request
When you create a pull request:
1. GitHub Actions builds and previews your changes
2. Shows a preview URL in the PR
3. You can test before merging to main

## 📝 Workflow Files

Located in `.github/workflows/`:
- `firebase-hosting-merge.yml` — Deploys on push to main
- `firebase-hosting-pull-request.yml` — Previews on PR

These workflows will use the `FIREBASE_TOKEN` secret to authenticate with Firebase.

## ✅ Testing

To test if everything works:
1. Make a small change to the code
2. Commit and push to `main`
3. Go to GitHub **Actions** tab
4. Watch the "Deploy to Firebase Hosting on merge" workflow run
5. Once complete, visit https://multiplication-kingdom-e8c53.web.app to see the changes

## 🔧 Troubleshooting

**Workflows not running?**
- Check that `FIREBASE_TOKEN` secret is added correctly
- Go to **Actions** tab and click the workflow to see error logs

**Firebase deployment fails?**
- Check the workflow run logs on GitHub
- Ensure your Firebase project is active and has Hosting enabled

**Can't generate Firebase token?**
- Ensure you're logged in: `firebase login`
- Check that your Firebase project has Hosting enabled
- Try: `firebase logout && firebase login:ci`

## 📚 More Information

- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Firebase Hosting with GitHub Actions](https://firebase.google.com/docs/hosting/github-integration)
