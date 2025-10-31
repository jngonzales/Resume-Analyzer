# AI Resume Analyzer - 100% FREE

A production-ready AI-powered resume analyzer built with Next.js 14, TypeScript, and completely free services.

## 🚀 Features

- **AI-Powered Analysis**: Uses Hugging Face free models for intelligent resume analysis
- **ATS Optimization**: Check your resume's compatibility with Applicant Tracking Systems
- **Skills Gap Analysis**: Identify missing skills and get recommendations
- **Grammar & Spelling Check**: Detect and fix language issues
- **Readability Scoring**: Get insights on resume clarity and structure
- **Authentication**: Secure login with Google/GitHub via NextAuth
- **Cloud Storage**: Resume files stored securely on Vercel Blob
- **Database**: PostgreSQL database via Vercel
- **Beautiful UI**: Modern, responsive design with Shadcn UI and Tailwind CSS

## 🆓 100% Free Stack

- **Frontend**: Next.js 14 (Vercel Free Tier)
- **Backend**: Next.js API Routes
- **Database**: Vercel Postgres (Free Tier - 256MB)
- **Storage**: Vercel Blob (Free Tier - 500MB)
- **AI**: Hugging Face Inference API (Free)
- **Auth**: NextAuth.js
- **Deployment**: Vercel (Free Tier)

## 📋 Prerequisites

- Node.js 18+ installed
- A Vercel account (free)
- A Hugging Face account (free)
- Google/GitHub OAuth credentials (optional but recommended)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd "AI Resume Analyzer"
npm install
```

### 2. Set Up Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### 3. Set Up Database (Vercel Postgres)

1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection strings

### 4. Set Up Blob Storage (Vercel Blob)

1. In Vercel dashboard, go to Storage → Create Store → Blob
2. Copy the read/write token

### 5. Get Hugging Face API Key

1. Go to https://huggingface.co/settings/tokens
2. Create a new token (read access is enough)
3. Copy the token

### 6. Set Up OAuth (Optional but Recommended)

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (for local)
6. Add: `https://your-domain.vercel.app/api/auth/callback/google` (for production)

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github` (for local)
4. Add: `https://your-domain.vercel.app/api/auth/callback/github` (for production)

### 7. Configure Environment Variables

Create a `.env.local` file:

```bash
# Database (from Vercel Postgres)
POSTGRES_URL="your-postgres-url"
POSTGRES_PRISMA_URL="your-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-postgres-url-non-pooling"
POSTGRES_USER="your-postgres-user"
POSTGRES_HOST="your-postgres-host"
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"

# NextAuth
NEXTAUTH_SECRET="your-secret-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Hugging Face
HUGGINGFACE_API_KEY="your-huggingface-token"
```

### 8. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 9. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 🚢 Deployment

### Deploy to Vercel

```bash
# Deploy
vercel --prod
```

Or push to GitHub and connect the repository to Vercel for automatic deployments.

### Set Production Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Update `NEXTAUTH_URL` to your production domain

## 📁 Project Structure

```
ai-resume-analyzer/
├── app/
│   ├── (auth)/
│   │   └── signin/page.tsx       # Sign in page
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth API routes
│   │   ├── upload/               # File upload endpoint
│   │   ├── analyze/              # AI analysis endpoint
│   │   └── user/analyses/        # User data endpoint
│   ├── analyze/page.tsx          # Resume upload page
│   ├── dashboard/page.tsx        # User dashboard
│   ├── results/[id]/page.tsx     # Analysis results
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # Shadcn UI components
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   ├── ai.ts                     # AI analysis logic
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
├── types/
│   ├── index.ts                  # Type definitions
│   └── next-auth.d.ts            # NextAuth types
└── middleware.ts                 # Route protection
```

## 🎯 Key Features Implementation

### AI Analysis
- **Text Extraction**: Supports PDF, DOCX, and TXT using `pdf-parse` and `mammoth`
- **Skills Detection**: Pattern matching with common tech and soft skills
- **ATS Scoring**: Keyword analysis with action verbs
- **Readability**: Sentence structure and word count analysis
- **Grammar Check**: Basic rule-based grammar validation
- **AI Suggestions**: Optional Hugging Face integration for advanced tips

### Free Tier Limitations

**Vercel:**
- 100 GB bandwidth/month
- 6,000 minutes of serverless function execution
- 100 GB-hrs of Fast Data Transfer

**Vercel Postgres:**
- 256 MB storage
- 60 hours compute time/month
- Enough for ~500-1000 analyses/month

**Vercel Blob:**
- 500 MB storage
- Sufficient for ~100 resume files

**Hugging Face:**
- Rate limited to ~1000 requests/day
- Fallback to rule-based analysis if quota exceeded

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Reset database
npx prisma db push --force-reset
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate
```

## 📝 Environment Variables Checklist

Before deployment, ensure you have:
- ✅ All Postgres connection strings
- ✅ Blob storage token
- ✅ Hugging Face API key
- ✅ NextAuth secret (generate new for production!)
- ✅ At least one OAuth provider configured
- ✅ Correct NEXTAUTH_URL for production

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - Free to use for personal and commercial projects

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Hugging Face Documentation](https://huggingface.co/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🚀 What's Next?

Possible enhancements:
- Export analysis as PDF
- Resume templates
- Job description matching
- Industry-specific analysis
- Resume history comparison
- Email notifications
- Chrome extension

---

Built with ❤️ using 100% free services
