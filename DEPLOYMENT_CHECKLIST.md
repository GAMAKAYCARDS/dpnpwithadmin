# Deployment Checklist

## Pre-Deployment Checks

### ✅ Static Assets
- [ ] All required assets are present in /public directory
- [ ] Run: `node scripts/check-static-assets.js`

### ✅ Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL is set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY is set
- [ ] SUPABASE_SERVICE_ROLE_KEY is set (for API routes)

### ✅ Build Configuration
- [ ] next.config.mjs has proper MIME type headers
- [ ] netlify.toml has correct redirects and headers
- [ ] package.json scripts are updated

### ✅ Error Handling
- [ ] Error boundary components are in place
- [ ] Custom error pages are configured
- [ ] Fallback assets are available

## Post-Deployment Verification

### ✅ Console Errors
- [ ] No MIME type errors for CSS/JS files
- [ ] No 404 errors for static assets
- [ ] No multiple Supabase client warnings
- [ ] No DOM manipulation errors

### ✅ Performance
- [ ] Assets are loading with proper cache headers
- [ ] No preload warnings in console
- [ ] Video files are loading correctly
- [ ] Images are optimized and loading

### ✅ Functionality
- [ ] All pages are accessible
- [ ] Cart functionality works
- [ ] Product images display correctly
- [ ] Video autoplay works
- [ ] Logo displays properly

## Common Issues & Solutions

### MIME Type Errors
- **Issue**: CSS files being treated as executable scripts
- **Solution**: Ensure proper Content-Type headers in netlify.toml

### 404 Asset Errors
- **Issue**: Missing static files
- **Solution**: Run asset check script and create fallbacks

### Multiple Supabase Clients
- **Issue**: GoTrueClient instances warning
- **Solution**: Use singleton pattern in lib/supabase.ts

### DOM Manipulation Errors
- **Issue**: React trying to remove non-existent nodes
- **Solution**: Use safer DOM manipulation with proper checks

## Quick Fix Commands

```bash
# Check and fix assets
node scripts/check-static-assets.js

# Fix deployment issues
node scripts/fix-deployment-issues.js

# Build with checks
pnpm run build:check

# Deploy to Netlify
netlify deploy --prod
```
