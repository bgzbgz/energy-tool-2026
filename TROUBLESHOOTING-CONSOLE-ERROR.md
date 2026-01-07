# 🚨 TROUBLESHOOTING: Console Not Loading

## Issue
User reports: "when i am going through the tool there is nothing loading in the console"

This is a **CRITICAL** issue indicating JavaScript execution failure.

---

## Possible Causes & Solutions

### Cause 1: Vercel Deployment Failed

**Symptoms:**
- Nothing loads in browser console
- Page appears blank or frozen
- No API calls visible in Network tab

**Diagnosis:**
1. Check Vercel deployment status
2. Look for build errors in Vercel logs

**Solution:**
- If deployment failed, revert to previous working config
- Check Vercel build logs for specific errors

---

### Cause 2: Simplified vercel.json Broke Routing

**What we changed:**
```json
// OLD (working but complex)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

// NEW (minimal)
{
  "framework": "vite"
}
```

**Issue:**
The `rewrites` rule might have been NECESSARY for React Router to work!

Without the rewrite, visiting `/drains` might try to load `/drains.html` (which doesn't exist) instead of `/index.html` (which has the React app).

**Solution:**
Restore the rewrite rule, but move it AFTER API routes:

```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures:
1. API routes go to `/api/` functions
2. All other routes go to React app

---

### Cause 3: Environment Variables Still Missing

**Check in Vercel:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

All 4 must be present in **Production** environment!

---

### Cause 4: Build Failed Due to TypeScript Errors

**The db.ts changes might have introduced errors.**

Check Vercel build logs for:
```
apps/web/api/_lib/db.ts:XX:XX - error TS...
```

**Quick Fix:**
Revert to previous version if build fails.

---

## Immediate Action Plan

### Step 1: Verify Deployment Status (USER ACTION REQUIRED)
```
1. Go to: https://vercel.com/dashboard
2. Click: "energy-tool-2026"
3. Click: "Deployments" tab
4. Check latest deployment:
   - Status: Ready ✅ or Failed ❌?
   - Commit: "fix: add env var fallbacks..."?
   - Duration: XX seconds
```

### Step 2: Check Browser Console (USER ACTION REQUIRED)
```
1. Press F12
2. Click "Console" tab
3. Visit: https://energy-tool-2026.vercel.app/
4. Look for red errors
5. Copy ALL error messages
```

### Step 3: Check Network Tab (USER ACTION REQUIRED)
```
1. Press F12
2. Click "Network" tab
3. Refresh page
4. Look for failed requests (red)
5. Check if /api/ calls are working
```

### Step 4: If Deployment Failed - Rollback
```bash
# Revert last commit
git revert HEAD
git push origin main
```

### Step 5: If Routing Broken - Fix vercel.json
Update to:
```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## Expected Results

### If Working:
```
Browser Console:
✓ React app loaded
✓ Router initialized
✓ Supabase client initialized
✓ No errors

Network Tab:
✓ index.html: 200 OK
✓ main.tsx: 200 OK
✓ Fonts: 200 OK
✓ Images: 200 OK
```

### If Broken:
```
Browser Console:
✗ Uncaught Error: ...
✗ Failed to fetch module
✗ 404 Not Found

Network Tab:
✗ main.tsx: 404
✗ /drains: 404
✗ /api/submissions/submit: 404
```

---

## USER MUST PROVIDE:

1. **Vercel deployment status screenshot**
2. **Browser console errors (copy/paste)**
3. **Network tab screenshot showing failed requests**
4. **What URL are you trying to access?**
5. **Does the diagnostic page load?** (`/diagnostic`)

Without this information, I cannot diagnose the issue!

