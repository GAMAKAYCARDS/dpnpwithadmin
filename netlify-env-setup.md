# 🔧 Netlify Environment Variables Setup

## Current Issue
The site is broken on Netlify because environment variables are not set. The debug page shows "Not Set" for all environment variables.

## ✅ Step-by-Step Fix

### 1. Go to Netlify Dashboard
1. Open [Netlify Dashboard](https://app.netlify.com/)
2. Find your site: `dopetechnepal`
3. Click on the site name

### 2. Navigate to Environment Variables
1. Click **Site settings** (tab at the top)
2. Scroll down to **Environment variables** section
3. Click **Add variable**

### 3. Add These Variables One by One

**Variable 1:**
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://aizgswoelfdkhyosgvzu.supabase.co`
- **Scopes:** Production, Deploy Preview, Branch Deploy

**Variable 2:**
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTUyMjUsImV4cCI6MjA3MDYzMTIyNX0.4a7Smvc_bueFLqZNvGk-AW0kD5dJusNwqaSAczJs0hU`
- **Scopes:** Production, Deploy Preview, Branch Deploy

**Variable 3:**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc`
- **Scopes:** Production, Deploy Preview, Branch Deploy

### 4. Trigger New Deployment
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete (usually 2-3 minutes)

### 5. Verify Fix
1. Visit your site: `https://dopetechnepal.netlify.app`
2. Check if images and products load properly
3. Visit debug page: `https://dopetechnepal.netlify.app/test-debug`
4. Environment variables should now show "Set" instead of "Not Set"

## 🔍 Troubleshooting

### If Still Broken:
1. **Check build logs** in Netlify dashboard
2. **Verify variables are saved** in Environment Variables section
3. **Clear Netlify cache** and redeploy
4. **Check browser console** for errors

### Common Issues:
- **Variables not saved:** Make sure to click "Save" after adding each variable
- **Wrong scopes:** Ensure variables are set for "Production" scope
- **Build cache:** Sometimes need to clear cache and redeploy

## 📞 Need Help?
If you're still having issues:
1. Check the debug page results
2. Look at Netlify build logs
3. Check browser console for errors
