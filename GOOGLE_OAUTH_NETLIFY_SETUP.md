# Google OAuth Setup for Netlify Deployment

## 🚨 IMPORTANT: Update Required
Your app is now live at: **https://comfy-blini-342b4c.netlify.app/**

You MUST update your Google Cloud Console OAuth configuration to work with the new domain.

## Steps to Update Google Cloud Console

### 1. Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (or the one you used before)

### 2. Navigate to OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Click **Edit App**
3. Update **Authorized domains** section:
   - Remove: `localhost` (if present)
   - Add: `netlify.app`
4. Click **Save and Continue**

### 3. Update OAuth 2.0 Client IDs
1. Go to **APIs & Services** → **Credentials**
2. Find your existing OAuth 2.0 Client ID
3. Click the **Edit** (pencil) icon
4. Update **Authorized JavaScript origins**:
   - Remove: `http://localhost:3000`
   - Add: `https://comfy-blini-342b4c.netlify.app`
5. Update **Authorized redirect URIs**:
   - Remove: `http://localhost:3000/auth/callback`
   - Add: `https://comfy-blini-342b4c.netlify.app/auth/callback`
6. Click **Save**

### 4. Update Supabase Authentication Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ccvtuoyjricxsczhsemg`
3. Go to **Authentication** → **URL Configuration**
4. Update **Site URL**: `https://comfy-blini-342b4c.netlify.app`
5. Update **Redirect URLs**, add:
   - `https://comfy-blini-342b4c.netlify.app/auth/callback`
   - `https://comfy-blini-342b4c.netlify.app/**` (wildcard for all pages)

### 5. Update Netlify Environment Variables
In your Netlify Dashboard → Site Settings → Environment Variables, ensure you have:

```
NEXT_PUBLIC_SUPABASE_URL=https://ccvtuoyjricxsczhsemg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_eLACdJJ2Xo7iE_gHVCu5wA_d_5Y7Nuo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdnR1b3lqcmljeHNjemhzZW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjUwMzI1NSwiZXhwIjoyMDkyMDc5MjU1fQ.SZ5uz-0sUOFmnDGufaA8bs7fLXxIQfBM715yclkWDWU
GEMINI_API_KEY=AIzaSyAsFRt8a1iGS3K0VpPkO41H0Tw3sxLJOPc
NEXT_PUBLIC_APP_URL=https://comfy-blini-342b4c.netlify.app
```

## ✅ After Updates

Once you've updated both Google Cloud Console and Supabase:

1. **Test Google Sign-In**: Visit your live site and try signing in with Google
2. **Check Authentication Flow**: Ensure users can sign up and log in properly
3. **Verify Redirects**: Make sure auth callbacks work correctly

## 🔧 Troubleshooting

If Google Sign-In doesn't work:
1. Check browser console for CORS errors
2. Verify all URLs match exactly (no trailing slashes mismatch)
3. Ensure OAuth consent screen is published (not in testing mode)
4. Wait 5-10 minutes for Google changes to propagate

## 📝 Summary of Changes Needed

| Service | Setting | Old Value | New Value |
|---------|---------|-----------|-----------|
| Google Cloud | Authorized Origins | `http://localhost:3000` | `https://comfy-blini-342b4c.netlify.app` |
| Google Cloud | Redirect URIs | `http://localhost:3000/auth/callback` | `https://comfy-blini-342b4c.netlify.app/auth/callback` |
| Supabase | Site URL | `http://localhost:3000` | `https://comfy-blini-342b4c.netlify.app` |
| Supabase | Redirect URLs | `http://localhost:3000/**` | `https://comfy-blini-342b4c.netlify.app/**` |

Your SyncScript app should work perfectly once these OAuth configurations are updated!