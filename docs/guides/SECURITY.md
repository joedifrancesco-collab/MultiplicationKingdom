# 🔒 Security Guidelines

## Credential Management

### Never Commit Credentials to Git

The following should NEVER be committed to version control:

- ❌ Firebase service account keys (`serviceAccountKey.json`)
- ❌ Google Cloud credentials (`.json` key files)
- ❌ API keys (Stripe, SendGrid, etc.)
- ❌ Database passwords
- ❌ JWT secrets
- ❌ `.env` files with sensitive values

### How to Handle Credentials

**For Local Development:**
```bash
# Create a local .env file (never commit this)
echo "FIREBASE_KEY=your_key_here" > .env.local

# Load it in your app:
const key = process.env.VITE_FIREBASE_KEY;
```

**For Production (Render):**
1. Go to Render Dashboard → Project Settings → Environment
2. Add secrets as environment variables (not in repo)
3. Reference them in code: `process.env.VITE_SECRET_NAME`

**For Firebase Admin SDK:**
- Keep `serviceAccountKey.json` **locally only**
- Never commit it
- Use it only on backend/server-side code
- For frontend: Use public Firebase config (safe to commit)

### .gitignore Setup

Your `.gitignore` now includes:

```
# Credentials
serviceAccountKey.json
*.json.key
.firebaserc

# Environment variables
.env
.env.local
.env.*.local
```

If you accidentally add a credential file:

```bash
# Remove from git (but keep locally)
git rm --cached serviceAccountKey.json

# Then commit the removal
git commit -m "chore: Remove credentials from tracking"
```

### If Credentials Are Exposed

**Immediate steps:**
1. 🚨 Revoke/disable the exposed credential immediately
2. Rotate it (delete old, create new)
3. Remove from git history using `git filter-branch` or BFG
4. Force-push to update GitHub

```bash
# Option 1: Simple git filter (for recent commits)
git filter-branch --tree-filter 'rm -f serviceAccountKey.json' HEAD
git push origin main --force-with-lease

# Option 2: BFG Repo-Cleaner (recommended for production repos)
# See: https://rtyley.github.io/bfg-repo-cleaner/
```

## Current Status (April 3, 2026)

✅ Google disabled the exposed Firebase service account key  
✅ `.gitignore` updated to prevent future commits  
⏳ Action needed: Remove `serviceAccountKey.json` from git history  
⏳ Action needed: Rotate credentials in Google Cloud Console  

## Resources

- [Google Cloud: Securing Service Account Keys](https://cloud.google.com/docs/authentication/best-practices-service-accounts)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Removes sensitive files from git history

## Questions?

If you need help securing credentials or have questions about the setup, refer to the resources above or consult the team lead.
