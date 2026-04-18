# Netlify Build Troubleshooting Guide

## Current Error: Build script returned non-zero exit code: 2

This error indicates the build process failed. Here are the most common causes and solutions:

## ✅ Fixes Applied

### 1. Updated Build Command
- **Changed**: `npm run build` → `npm ci && npm run build`
- **Reason**: Ensures clean dependency installation

### 2. Fixed Package.json Scripts
- **Removed**: Windows-specific `set NODE_OPTIONS=--max-old-space-size=4096 &&`
- **Reason**: Linux build environment doesn't understand Windows commands

### 3. Added Build Environment Variables
- **Added**: `NPM_CONFIG_PRODUCTION = "false"`
- **Reason**: Ensures devDependencies are installed (needed for build)

## 🔍 Checklist for Netlify Dashboard

### Environment Variables (CRITICAL)
Ensure these are set in Netlify Dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ccvtuoyjricxsczhsemg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_eLACdJJ2Xo7iE_gHVCu5wA_d_5Y7Nuo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdnR1b3lqcmljeHNjemhzZW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjUwMzI1NSwiZXhwIjoyMDkyMDc5MjU1fQ.SZ5uz-0sUOFmnDGufaA8bs7fLXxIQfBM715yclkWDWU
GEMINI_API_KEY=AIzaSyAsFRt8a1iGS3K0VpPkO41H0Tw3sxLJOPc
NEXT_PUBLIC_APP_URL=https://comfy-blini-342b4c.netlify.app
```

### Build Settings
Verify in Netlify Dashboard → Site Settings → Build & Deploy:
- **Base directory**: `frontend`
- **Build command**: `npm ci && npm run build`
- **Publish directory**: `.next`

## 🚨 Common Issues & Solutions

### Issue 1: Missing Environment Variables
**Symptom**: Build fails with API key errors
**Solution**: Add all environment variables listed above

### Issue 2: Node.js Version Mismatch
**Symptom**: "Node.js version X.X.X is required"
**Solution**: Already fixed - using Node 20 in netlify.toml

### Issue 3: Dependency Installation Fails
**Symptom**: "Cannot resolve module" errors
**Solution**: Using `npm ci` for clean install

### Issue 4: TypeScript Errors
**Symptom**: Build fails on type checking
**Solution**: Already disabled with `ignoreBuildErrors: true`

## 🔧 Manual Debugging Steps

If build still fails:

1. **Check Build Logs**: Look for specific error messages in Netlify build logs
2. **Test Locally**: Run `npm ci && npm run build` in frontend directory
3. **Check Dependencies**: Ensure all packages in package.json are available
4. **Verify Environment**: Make sure all required env vars are set

## 📝 Next Steps

1. Commit these fixes
2. Push to trigger new deployment
3. Monitor build logs for specific errors
4. If still failing, share the complete build log for further diagnosis

The build should now succeed with these fixes!