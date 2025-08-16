# 🚀 Netlify Deployment Fix Guide

## Current Issue
The site works perfectly locally but is broken on Netlify due to missing environment variables and configuration issues.

## ✅ Solution Steps

### 1. Environment Variables in Netlify Dashboard
Go to your Netlify dashboard and add these environment variables:

**Site Settings > Environment Variables > Add Variable**

```
NEXT_PUBLIC_SUPABASE_URL = https://aizgswoelfdkhyosgvzu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTUyMjUsImV4cCI6MjA3MDYzMTIyNX0.4a7Smvc_bueFLqZNvGk-AW0kD5dJusNwqaSAczJs0hU
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc
```

### 2. Build Settings
Ensure these build settings in Netlify:

- **Build command:** `pnpm build`
- **Publish directory:** `.next`
- **Node version:** `20.18.0`

### 3. Plugin Configuration
Make sure the Netlify Next.js plugin is installed and configured.

### 4. Trigger New Deployment
After adding environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** > **Deploy site**
3. Wait for build to complete

## 🔍 Verification Steps

### Check Build Logs
Look for these in the build logs:
- ✅ "Compiled successfully"
- ✅ No environment variable errors
- ✅ Assets loading properly

### Test the Site
After deployment, check:
1. **Main page loads** without 404 errors
2. **Images and logo display** properly
3. **Products load** from database
4. **No console errors** in browser

## 🛠️ Troubleshooting

### If Still Broken:
1. **Check build logs** for specific errors
2. **Verify environment variables** are set correctly
3. **Clear Netlify cache** and redeploy
4. **Check Supabase connection** from Netlify's servers

### Common Issues:
- **Environment variables not loaded** - Add them in Netlify dashboard
- **Build failures** - Check Node version and dependencies
- **Asset loading issues** - Verify public directory structure

## 📞 Support
If issues persist, check:
1. Netlify build logs
2. Browser console errors
3. Network tab for failed requests
