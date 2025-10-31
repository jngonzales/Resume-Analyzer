# AI Resume Analyzer - Quick Reference

## 🚀 Quick Commands

### Development
```powershell
npm install                  # Install dependencies
npm run dev                  # Start dev server (localhost:3000)
npm run build                # Build for production
npm start                    # Start production server
npm run lint                 # Run linter
```

### Database
```powershell
npx prisma generate          # Generate Prisma client
npx prisma db push           # Push schema to database
npx prisma studio            # Open Prisma Studio (GUI)
npx prisma db pull           # Pull schema from database
```

### Deployment
```powershell
vercel                       # Deploy to preview
vercel --prod                # Deploy to production
vercel env pull              # Pull environment variables
vercel logs                  # View deployment logs
```

## 📁 File Structure

```
AI Resume Analyzer/
├── app/                         # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/[...nextauth]/ # NextAuth endpoints
│   │   ├── upload/             # File upload
│   │   ├── analyze/            # AI analysis
│   │   └── user/analyses/      # User data
│   ├── auth/signin/            # Sign in page
│   ├── dashboard/              # User dashboard
│   ├── analyze/                # Upload page
│   ├── results/[id]/           # Results page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Shadcn components
│   └── file-upload.tsx         # Upload component
├── lib/
│   ├── auth.ts                 # Auth config
│   ├── db.ts                   # Database client
│   ├── ai.ts                   # AI logic
│   └── utils.ts                # Utilities
├── prisma/
│   └── schema.prisma           # DB schema
├── types/                      # TypeScript types
├── .env.local                  # Local env vars (create this!)
├── .env.example                # Env template
└── middleware.ts               # Route protection
```

## 🔑 Environment Variables

### Required
```env
POSTGRES_PRISMA_URL=          # From Vercel Postgres
NEXTAUTH_SECRET=              # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_URL=                 # http://localhost:3000 (local) or production URL
BLOB_READ_WRITE_TOKEN=        # From Vercel Blob
HUGGINGFACE_API_KEY=          # From HuggingFace.co
```

### OAuth (at least one required)
```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## 🛠️ Common Tasks

### Add New UI Component
```powershell
# Shadcn components are in components/ui/
# To add more: https://ui.shadcn.com/docs/components
```

### Update Database Schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`

### Add New API Route
Create file in `app/api/your-route/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello' })
}
```

### Add New Page
Create file in `app/your-page/page.tsx`:
```typescript
export default function YourPage() {
  return <div>Your Page</div>
}
```

## 🔍 Debugging

### Check Logs
```powershell
# Development
# Logs appear in terminal

# Production (Vercel)
vercel logs
# Or check Vercel dashboard
```

### Database Issues
```powershell
# View database GUI
npx prisma studio

# Check connection
npx prisma db execute --stdin < test.sql
```

### Clear Cache
```powershell
rm -rf .next
rm -rf node_modules
npm install
```

## 🎨 Styling

### Tailwind Classes
- `bg-primary` - Primary color
- `text-primary` - Primary text
- `bg-secondary` - Secondary color
- `bg-accent` - Accent color
- `text-muted-foreground` - Muted text

### Custom Colors
Edit `tailwind.config.ts` to customize colors.

## 🔐 Authentication Flow

1. User clicks "Sign In"
2. Redirected to `/auth/signin`
3. Choose OAuth provider
4. Callback to `/api/auth/callback/[provider]`
5. Session created
6. Redirect to `/dashboard`

## 📊 AI Analysis Flow

1. Upload resume → `/api/upload`
2. File saved to Vercel Blob
3. Text extracted (PDF/DOCX/TXT)
4. AI analysis → `/api/analyze`
5. Results saved to database
6. Redirect to `/results/[id]`

## 💡 Tips

### Free Tier Optimization
- Implement caching for repeated analyses
- Add rate limiting per user
- Clean up old files periodically
- Compress stored data

### Performance
- Images: Use Next.js Image component
- Fonts: Use next/font for optimization
- API: Implement request caching
- Database: Add indexes for queries

### Security
- Never commit .env files
- Rotate secrets regularly
- Implement rate limiting
- Validate all user inputs

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| TypeScript errors | Run `npm install` and `npx prisma generate` |
| Database connection | Check POSTGRES_* variables |
| OAuth not working | Verify callback URLs match |
| File upload fails | Check BLOB_READ_WRITE_TOKEN |
| AI analysis timeout | Verify HUGGINGFACE_API_KEY |
| Build fails | Clear .next and rebuild |

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [Vercel Docs](https://vercel.com/docs)
- [Hugging Face](https://huggingface.co/docs)

## 🆘 Getting Help

1. Check `README.md` for overview
2. See `SETUP.md` for setup guide
3. Review `DEPLOYMENT.md` for deployment
4. Check Vercel logs for errors
5. Review database with Prisma Studio

## 📝 Useful Snippets

### Generate Random Secret
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Test Database Connection
```typescript
// In any API route
import { prisma } from '@/lib/db'
await prisma.$connect()
console.log('Connected!')
```

### Check Environment Variables
```typescript
// In any API route
console.log('Env check:', {
  hasDb: !!process.env.POSTGRES_PRISMA_URL,
  hasAuth: !!process.env.NEXTAUTH_SECRET,
  hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
  hasAI: !!process.env.HUGGINGFACE_API_KEY,
})
```

---

**Need more help?** Check the other documentation files or Vercel dashboard for logs.
