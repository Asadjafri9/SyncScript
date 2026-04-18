# Netlify Deployment Guide for SyncScript

## Files Created for Netlify
✅ `netlify.toml` - Netlify configuration
✅ Updated `frontend/package.json` - Added Netlify Next.js plugin
✅ Updated `frontend/next.config.mjs` - Netlify compatibility

## Deployment Steps

### 1. Connect Repository to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select your `SyncScript` repository

### 2. Configure Build Settings
Netlify should auto-detect the settings from `netlify.toml`, but verify:
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/.next`

### 3. Set Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://ccvtuoyjricxsczhsemg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_eLACdJJ2Xo7iE_gHVCu5wA_d_5Y7Nuo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdnR1b3lqcmljeHNjemhzZW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjUwMzI1NSwiZXhwIjoyMDkyMDc5MjU1fQ.SZ5uz-0sUOFmnDGufaA8bs7fLXxIQfBM715yclkWDWU
GEMINI_API_KEY=AIzaSyAsFRt8a1iGS3K0VpPkO41H0Tw3sxLJOPc
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
```

### 4. Deploy
1. Click "Deploy site"
2. Netlify will build and deploy automatically
3. You'll get a URL like `https://amazing-name-123456.netlify.app`

### 5. Update App URL
After deployment, update the environment variable:
- `NEXT_PUBLIC_APP_URL` to your actual Netlify URL

## Configuration Details

### netlify.toml Features
- ✅ **Base directory**: Points to `frontend` folder
- ✅ **Next.js plugin**: Handles API routes as Netlify Functions
- ✅ **Node 18**: Latest LTS version
- ✅ **Redirects**: SPA routing and API route handling
- ✅ **Environment variables**: Template with your actual keys

### Next.js Configuration
- ✅ **Removed static export**: Keeps API routes functional
- ✅ **Supabase external packages**: Proper bundling
- ✅ **Security headers**: Production-ready headers

## Expected Result
After deployment, your SyncScript app will be live on Netlify with:
- ✅ Working Next.js frontend
- ✅ API routes as Netlify Functions
- ✅ Supabase database connection
- ✅ Google OAuth authentication
- ✅ Gemini AI integration
- ✅ Automatic deployments on git push

## Troubleshooting
If deployment fails:
1. Check build logs in Netlify dashboard
2. Ensure all environment variables are set
3. Verify the base directory is set to `frontend`
4. Check that Node version is 18+