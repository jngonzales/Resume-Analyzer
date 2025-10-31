# AI Resume Analyzer - Setup Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Set Up Free Services

#### A. Vercel Account & CLI
```powershell
npm install -g vercel
vercel login
vercel link
```

#### B. Create Vercel Postgres Database
1. Visit https://vercel.com/dashboard
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database" → Choose "Postgres"
5. Click "Create" (free tier selected by default)
6. Copy all connection strings shown

#### C. Create Vercel Blob Storage
1. In the same "Storage" tab
2. Click "Create Store" → Choose "Blob"
3. Click "Create"
4. Copy the `BLOB_READ_WRITE_TOKEN`

#### D. Get Hugging Face API Key (100% Free)
1. Create account at https://huggingface.co/join
2. Go to https://huggingface.co/settings/tokens
3. Click "New token"
4. Name it "resume-analyzer", select "Read" access
5. Copy the token

#### E. Google OAuth (Recommended)
1. Go to https://console.cloud.google.com/
2. Create new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google` (add after deploying)
7. Copy Client ID and Client Secret

#### F. GitHub OAuth (Optional)
1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: "AI Resume Analyzer"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Click "Generate a new client secret"
6. Copy Client ID and Client Secret

### Step 3: Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Copy from Vercel Postgres dashboard
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://...?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

# Generate a random secret
NEXTAUTH_SECRET="generate-with-command-below"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Copy from Vercel Blob dashboard
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Copy from Hugging Face
HUGGINGFACE_API_KEY="hf_..."
```

**Generate NEXTAUTH_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Initialize Database
```powershell
npx prisma generate
npx prisma db push
```

### Step 5: Run Development Server
```powershell
npm run dev
```

Visit http://localhost:3000 🎉

## Deploy to Production

### Option 1: Deploy with Vercel CLI
```powershell
vercel --prod
```

### Option 2: Deploy with Git
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Important:** Update these in production:
- `NEXTAUTH_URL` → Your production URL
- Add production URLs to OAuth redirect URIs

## Testing the Application

1. **Sign In**: Click "Get Started" → Sign in with Google/GitHub
2. **Upload Resume**: Click "Analyze New Resume" → Upload PDF/DOCX/TXT
3. **View Results**: See scores, suggestions, skills, and improvements
4. **Dashboard**: View history of all analyses

## Troubleshooting

### "Cannot find module" errors
```powershell
npm install
npx prisma generate
```

### Database connection failed
- Verify all POSTGRES_* variables are set correctly
- Check Vercel Postgres is active in dashboard

### OAuth not working
- Verify redirect URIs match exactly (including http/https)
- Check CLIENT_ID and CLIENT_SECRET are correct
- Ensure NEXTAUTH_URL is set correctly

### File upload fails
- Verify BLOB_READ_WRITE_TOKEN is set
- Check file is under 5MB
- Ensure file is PDF, DOCX, or TXT

### AI analysis fails
- Verify HUGGINGFACE_API_KEY is valid
- App will fall back to rule-based analysis if API fails
- Free tier has rate limits (~1000 requests/day)

## Cost Breakdown (All FREE!)

| Service | Free Tier | Sufficient For |
|---------|-----------|----------------|
| Vercel Hosting | 100GB bandwidth | ~10,000 visits/month |
| Vercel Postgres | 256MB, 60hrs compute | ~500-1000 analyses |
| Vercel Blob | 500MB storage | ~100 resume files |
| Hugging Face | Rate limited | ~1000 analyses/day |
| NextAuth | Free forever | Unlimited users |

## Next Steps

- Customize the landing page
- Add more AI models
- Implement PDF export
- Add email notifications
- Create resume templates

---

Need help? Check the main README.md for detailed documentation.
