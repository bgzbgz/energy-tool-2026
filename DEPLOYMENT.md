# 🚀 Deployment Guide: GitHub → Vercel

This guide will walk you through deploying the Energy Body & Mind Tool to Vercel via GitHub.

---

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase project with `energy_submissions` table created
- ✅ Your Supabase credentials ready

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Website

1. Go to https://github.com/new
2. **Repository name**: `energy-body-mind-tool` (or your preferred name)
3. **Visibility**: Private (recommended) or Public
4. **DO NOT** initialize with README (we already have one)
5. Click **"Create repository"**

### Option B: Via GitHub CLI (if installed)

```bash
gh repo create energy-body-mind-tool --private --source=. --remote=origin --push
```

---

## Step 2: Initialize Git & Push to GitHub

Run these commands from your project root:

```powershell
# Navigate to project root
cd 'C:\Users\Admin\Desktop\specenergy_spec kit for curosr agent ps-v0.0.90'

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Energy Body & Mind Tool with design enhancements"

# Rename branch to main (if needed)
git branch -M main

# Add GitHub remote (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/energy-body-mind-tool.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Step 3: Deploy to Vercel

### 1. Go to Vercel Dashboard

Visit: https://vercel.com/dashboard

### 2. Import Project

1. Click **"Add New..." → "Project"**
2. Select **"Import Git Repository"**
3. Find your repository: `energy-body-mind-tool`
4. Click **"Import"**

### 3. Configure Project Settings

Vercel should auto-detect Vite, but verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `apps/web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 4. Add Environment Variables

Click **"Environment Variables"** and add these **3 variables**:

| Name | Value | Where to Find |
|------|-------|---------------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase → Settings → API → Project API keys → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase → Settings → API → Project API keys → service_role |

**Important**: 
- Add variables to **"Production"**, **"Preview"**, and **"Development"** environments
- Click **"Add"** after each variable
- ⚠️ **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - never expose it in client code

### 5. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll see: ✅ **"Deployment Ready"**

---

## Step 4: Verify Deployment

### 1. Visit Your Site

Vercel will provide a URL like:
```
https://energy-body-mind-tool-xxxxx.vercel.app
```

### 2. Test the Flow

1. Fill out Energy Audit (4 pillars)
2. Identify Energy Drains
3. Design Protocols
4. Set First Win
5. View Protocol Strength Analyzer
6. Submit on Canvas page

### 3. Check Supabase

Go to Supabase → Table Editor → `energy_submissions`

You should see your submission! 🎉

---

## Step 5: Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `energy.yourcompany.com`
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic, ~5-10 minutes)

---

## Troubleshooting

### ❌ Build Failed

**Check these common issues:**

1. **Node version**: Vercel uses Node 18.x by default
   - If issues, add to `package.json`:
   ```json
   "engines": {
     "node": "18.x"
   }
   ```

2. **Missing dependencies**: 
   - Verify all packages are in `dependencies` or `devDependencies`
   - Run `npm install` locally to test

3. **TypeScript errors**:
   - Fix any TS errors locally first
   - Run `npm run build` to test build

### ❌ API Endpoints Return 404

**Check these:**

1. Environment variables are set in Vercel
2. Variables are added to all environments (Production, Preview, Development)
3. `vercel.json` is in `apps/web` directory
4. API files are in `apps/web/api/` directory

### ❌ Supabase Connection Failed

**Verify:**

1. Supabase URL is correct (should start with `https://`)
2. Anon key is correct (starts with `eyJhbGc...`)
3. Service role key is correct (starts with `eyJhbGc...`)
4. Table `energy_submissions` exists in Supabase
5. RLS (Row Level Security) is configured properly

### ❌ Fonts Not Loading

**Check:**

1. Font files are in `apps/web/public/fonts/`
2. Font paths in `globals.css` are correct: `/fonts/Plaak3Trial-43-Bold.otf`
3. Public directory is not in `.gitignore`

---

## Post-Deployment

### 1. Set Up Custom Error Pages (Optional)

Create `apps/web/public/404.html` for custom 404 page.

### 2. Enable Analytics (Optional)

Vercel provides built-in analytics:
1. Go to Project → **Analytics** tab
2. Enable **Vercel Analytics**

### 3. Set Up Preview Deployments

Every push to a branch (not `main`) creates a preview deployment:
- Feature branches → Preview URLs
- Pull requests → Automatic preview links
- `main` branch → Production

### 4. Configure GitHub Integration

Vercel automatically:
- Deploys on every push to `main`
- Creates preview deployments for PRs
- Adds deployment status to GitHub commits

---

## Continuous Deployment Workflow

```
Local Development
    ↓
git commit & push
    ↓
GitHub Repository
    ↓
Vercel Auto-Deploy
    ↓
Production Live! 🚀
```

**Every time you push to `main`, Vercel automatically:**
1. Pulls latest code
2. Installs dependencies
3. Runs build
4. Deploys to production
5. Notifies you (email/Slack)

---

## Environment-Specific Deployments

| Branch | Environment | URL |
|--------|-------------|-----|
| `main` | Production | `https://your-project.vercel.app` |
| `staging` | Preview | `https://your-project-git-staging.vercel.app` |
| `feature-xyz` | Preview | `https://your-project-git-feature-xyz.vercel.app` |

---

## Security Best Practices

✅ **DO:**
- Use environment variables for all secrets
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
- Enable HTTPS (automatic with Vercel)
- Set up Row Level Security (RLS) in Supabase
- Use `.gitignore` to exclude `.env.local`

❌ **DON'T:**
- Commit `.env.local` to Git
- Expose service role key in client code
- Share environment variables publicly
- Disable HTTPS

---

## Monitoring & Maintenance

### Check Deployment Logs

1. Go to Vercel Dashboard → Your Project
2. Click on latest deployment
3. View **"Functions"** tab for API logs
4. View **"Build Logs"** for build output

### Monitor Database

1. Supabase Dashboard → **Database** → **Logs**
2. Check for errors or slow queries
3. Monitor table size and performance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update (carefully)
npm update

# Test locally
npm run dev:all

# Deploy
git commit -am "Update dependencies"
git push
```

---

## Quick Reference

### Useful URLs
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **GitHub Repository**: https://github.com/YOUR_USERNAME/energy-body-mind-tool

### Key Commands
```bash
# Local development
npm run dev:all

# Build test
npm run build

# Deploy (automatic on push)
git push origin main
```

### Environment Variables
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev

---

**🎉 Congratulations! Your Energy Body & Mind Tool is now live!**

