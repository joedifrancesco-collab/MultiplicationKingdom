# 🚀 Local Setup Guide — Multiplication Kingdom

**Status:** ✅ Your development environment is configured and ready to use!

This guide documents what has been set up and what you need to do manually to complete the local development setup and test the GitHub → Firebase deployment pipeline.

---

## ✅ What Has Been Completed

### 1. **Node.js & npm Dependencies** ✓
- ✅ Node.js v25.9.0 is installed and available
- ✅ npm dependencies installed successfully (`npm install`)
- ✅ No critical vulnerabilities blocking development

### 2. **Firebase Configuration** ✓
- ✅ `.env.local` is properly configured with Firebase credentials
- ✅ Firebase project: `multiplication-kingdom-e8c53`
- ✅ Firestore database configured and ready
- ✅ GitHub Actions workflows configured for auto-deployment

### 3. **Development Server** ✓
- ✅ Tested and working at `http://localhost:5173`
- ✅ App loads successfully with full navigation
- ✅ Hot module reloading (HMR) enabled
- ✅ Firebase Firestore connection working

### 4. **Git & GitHub Integration** ✓
- ✅ Git configured with your user identity:
  - Name: `Joseph DiFrancesco`
  - Email: `joedifrancesco@gmail.com`
- ✅ Test commit created: "Add development environment setup note to README"
- ✅ Commit hash: `873182c`

---

## 📋 Manual Steps You Need to Complete

### **Step 1: Push to GitHub (⚠️ Requires Your Action)**

The test commit has been created locally but needs to be pushed to GitHub. This will trigger the automatic Firebase deployment workflow.

#### Option A: Push via VS Code (Recommended)
1. Open the **Source Control** panel in VS Code (Ctrl+Shift+G)
2. You should see "Publish Branch" or "Sync" button
3. Click it to push to GitHub
4. VS Code may prompt for GitHub authentication (use your GitHub credentials or Personal Access Token)

#### Option B: Push via Terminal
```powershell
cd c:\Users\joedi\multiplication-kingdom
git push origin main
```

> **Note:** On Windows with PowerShell, you may need to set execution policy if prompted:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
> ```

### **Step 2: Generate Firebase CI Token (⚠️ Requires Your Action)**

If you haven't done so already, GitHub Actions needs a Firebase token to deploy automatically. Check the `.github/workflows/` to see if `FIREBASE_TOKEN` secret is configured.

#### To Generate & Add Token:

1. **Generate the token locally:**
   ```powershell
   firebase login:ci
   ```
   - This opens your browser to authenticate with Firebase
   - Returns a token like: `1//0gxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **Add it to GitHub Secrets:**
   - Go to: https://github.com/joedifrancesco-collab/MultiplicationKingdom
   - Navigate: **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - **Name:** `FIREBASE_TOKEN`
   - **Value:** Paste the token from Step 1
   - Click **Add secret**

3. **Verify the workflow files exist:**
   - `.github/workflows/firebase-hosting-merge.yml` — runs on push to main
   - `.github/workflows/firebase-hosting-pull-request.yml` — runs on pull requests

---

## 🧪 Testing the Deployment Pipeline

Once you've pushed to GitHub and added the `FIREBASE_TOKEN` secret:

1. **Watch the GitHub Actions workflow:**
   - Go to: https://github.com/joedifrancesco-collab/MultiplicationKingdom/actions
   - You should see "Deploy to Firebase Hosting on merge" running
   - It should complete in ~2-3 minutes

2. **Expected workflow steps:**
   - ✅ Checkout code
   - ✅ Set up Node.js v22
   - ✅ Install dependencies
   - ✅ Run ESLint
   - ✅ Build production bundle
   - ✅ Deploy to Firebase Hosting

3. **Verify deployment:**
   - Once complete, check: https://multiplication-kingdom-e8c53.web.app
   - The new README change should be deployed (visible in the page meta)
   - Check the browser console for any errors

---

## 🎮 Daily Development Workflow

### Starting Development
```powershell
cd c:\Users\joedi\multiplication-kingdom
npm run dev
```
- Opens dev server at `http://localhost:5173`
- Hot reload enabled — changes reflect instantly
- Open browser and start playing!

### Making Changes
1. Edit files normally
2. Changes auto-refresh in browser
3. No need to restart dev server

### Committing & Pushing
```powershell
git add .
git commit -m "Describe your changes"
git push origin main
```
- ✅ GitHub Actions automatically triggers
- ✅ Tests run (ESLint check)
- ✅ App builds
- ✅ Deploys to Firebase Hosting
- ✅ Live in ~2-3 minutes

### Building for Production
```powershell
npm run build
```
- Creates optimized bundle in `dist/` folder
- ~2-3 MB with all games + Firestore included

### Linting
```powershell
npm run lint
```
- Checks code quality with ESLint
- Run before committing to catch issues

---

## 🔧 Configuration Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `.env.local` | Firebase credentials | ✅ Configured |
| `.firebaserc` | Firebase project alias | ✅ Configured |
| `firebase.json` | Firebase hosting config | ✅ Configured |
| `.github/workflows/*.yml` | GitHub Actions deployment | ✅ Configured |
| `capacitor.config.json` | Android build config | ✅ Configured |
| `vite.config.js` | Vite bundler config | ✅ Configured |

---

## 📚 Key Documentation Files

- [README.md](./README.md) — Main project overview
- [.github/GITHUB_ACTIONS_SETUP.md](./.github/GITHUB_ACTIONS_SETUP.md) — Deployment setup details
- [docs/guides/FIREBASE_SETUP.md](./docs/guides/FIREBASE_SETUP.md) — Firebase configuration details
- [docs/CODEBASE_SPEC.md](./docs/CODEBASE_SPEC.md) — Architecture & code patterns
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) — Copilot coding conventions

---

## ⚠️ Known Issues & Troubleshooting

### Git push fails with "fatal: not a git repository"
- Ensure you're in the correct directory: `c:\Users\joedi\multiplication-kingdom`

### npm: "File cannot be loaded because running scripts is disabled"
- Solution: Run PowerShell command before npm:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
  ```

### GitHub Actions workflow fails
- Check `.github/workflows/` file has correct Firebase config
- Verify `FIREBASE_TOKEN` secret is added to GitHub
- View workflow logs at: https://github.com/joedifrancesco-collab/MultiplicationKingdom/actions

### Vite dev server slow to start
- First time startup optimizes dependencies (normal)
- Subsequent restarts are instant
- If stuck, restart with: `npm run dev`

### Browser shows blank page
- Check browser console (F12 → Console) for errors
- Clear browser cache (Ctrl+Shift+Delete)
- Verify `.env.local` has correct Firebase credentials

---

## 🎯 Next Steps

1. **Push the test commit to GitHub:**
   ```powershell
   git push origin main
   ```

2. **Add `FIREBASE_TOKEN` to GitHub Secrets** (if not already done)

3. **Monitor the deployment:**
   - GitHub Actions dashboard: https://github.com/joedifrancesco-collab/MultiplicationKingdom/actions
   - Firebase Hosting: https://multiplication-kingdom-e8c53.web.app

4. **Start developing:**
   - Run `npm run dev`
   - Make changes
   - Commit and push
   - Automatic deployment to Firebase! 🚀

---

## 📞 Support

- **Firebase Issues:** Check [docs/guides/FIREBASE_SETUP.md](./docs/guides/FIREBASE_SETUP.md)
- **GitHub Actions Issues:** Check [.github/GITHUB_ACTIONS_SETUP.md](./.github/GITHUB_ACTIONS_SETUP.md)
- **Code Questions:** Refer to [docs/CODEBASE_SPEC.md](./docs/CODEBASE_SPEC.md)

---

**Last Updated:** May 1, 2026  
**Setup Status:** ✅ Ready for Development
