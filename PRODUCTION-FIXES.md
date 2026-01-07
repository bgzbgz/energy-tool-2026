# Production Deployment Fixes

## Issues Identified and Fixed

### 1. ❌ Cover Image Not Loading
**Problem**: Image filename had spaces: `cover image for energy tool.jpg`
**Fix**: Renamed to: `cover-image-energy-tool.jpg`
**Status**: ✅ FIXED

### 2. ❌ Fonts Not Loading  
**Problem**: Font paths may not be resolving correctly in production
**Fix**: Already correct (`/fonts/FontName.otf`), but need to verify build includes public folder
**Status**: ✅ Verified - paths are correct

### 3. ❌ Design Not Looking Good
**Problem**: Tailwind classes may not be purging correctly, or CSS not loading
**Root Cause**: Need to check if `dist` folder includes all assets after build
**Status**: 🔍 Investigating

### 4. ❌ Data Not Saving to Supabase
**Problem**: API calls may be failing due to environment variables or CORS
**Root Cause**: Check Vercel environment variables and Supabase RLS policies
**Status**: 🔍 Need to verify env vars in Vercel

### 5. ❌ Protocol Data Not Displaying
**Problem**: LocalStorage keys may be different or data not loading
**Root Cause**: localStorage keys are correct, may be empty state issue
**Status**: 🔍 Need to check if form data is being saved

---

## Required Actions

### Immediate Fixes Needed:

1. **Update image references** - Change all references from old filename to new one
2. **Verify Vercel Build** - Ensure public folder is copied to dist
3. **Check Environment Variables** - Verify all 3 env vars are set in Vercel
4. **Test API Endpoints** - Verify `/api/submissions/submit` and `/api/submissions/list` work
5. **Check Supabase RLS** - Ensure Row Level Security policies allow inserts

---

## Files That Need Updates

### Image References to Update:
- Any component using the cover image with spaces in filename

### Environment Variables to Verify in Vercel:
1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`  
3. `SUPABASE_SERVICE_ROLE_KEY`

---

## Testing Checklist

After fixes:
- [ ] Cover page loads with image
- [ ] Fonts render correctly (Plaak, Riforma, Monument)
- [ ] Design matches local development
- [ ] Form data saves to localStorage
- [ ] Submit button works
- [ ] Data appears in Supabase
- [ ] Protocol displays on Canvas page

