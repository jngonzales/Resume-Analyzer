# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Variables ✓
- [ ] All database URLs configured
- [ ] NEXTAUTH_SECRET generated (NEW for production!)
- [ ] NEXTAUTH_URL set to production domain
- [ ] OAuth redirect URIs updated with production URL
- [ ] BLOB_READ_WRITE_TOKEN configured
- [ ] HUGGINGFACE_API_KEY set

### 2. Database ✓
- [ ] Vercel Postgres database created
- [ ] Schema pushed with `npx prisma db push`
- [ ] Database connection tested

### 3. Storage ✓
- [ ] Vercel Blob storage created
- [ ] Token verified and working

### 4. Authentication ✓
- [ ] Google OAuth configured with production callback URL
- [ ] GitHub OAuth configured with production callback URL
- [ ] At least one OAuth provider working

### 5. Code Quality ✓
- [ ] All TypeScript errors resolved
- [ ] No console errors in browser
- [ ] Tested file upload (PDF, DOCX, TXT)
- [ ] Tested AI analysis
- [ ] Tested results display

## Deployment Steps

### Method 1: Vercel CLI (Recommended)

```powershell
# Login to Vercel
vercel login

# Link project (first time only)
vercel link

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Go to https://vercel.com/new
3. Import your repository
4. Configure environment variables
5. Deploy

## Post-Deployment

### 1. Update OAuth Callbacks
Add your production URL to OAuth providers:

**Google:**
- https://console.cloud.google.com/
- Add: `https://your-app.vercel.app/api/auth/callback/google`

**GitHub:**
- https://github.com/settings/developers
- Update callback URL: `https://your-app.vercel.app/api/auth/callback/github`

### 2. Test Production Site
- [ ] Landing page loads correctly
- [ ] Sign in works with OAuth providers
- [ ] File upload functions
- [ ] AI analysis completes
- [ ] Results display properly
- [ ] Dashboard shows past analyses

### 3. Configure Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXTAUTH_URL to custom domain
5. Update OAuth redirect URIs

## Monitoring

### Vercel Dashboard
- Check deployment logs
- Monitor function execution time
- Track bandwidth usage
- Review error logs

### Database Usage
- Monitor storage (256MB limit on free tier)
- Check compute time (60 hours/month limit)
- Review query performance

### Blob Storage
- Monitor storage usage (500MB limit)
- Track upload/download metrics

## Free Tier Limits

| Resource | Free Limit | When to Upgrade |
|----------|------------|-----------------|
| Bandwidth | 100GB/month | >10K visits/month |
| Function Execution | 6,000 minutes/month | >200 analyses/day |
| Postgres Storage | 256MB | >1000 resumes stored |
| Postgres Compute | 60 hours/month | Constant usage |
| Blob Storage | 500MB | >100 resume files |
| Hugging Face API | ~1000/day | Heavy usage |

## Troubleshooting

### Build Fails
```powershell
# Clear build cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify all POSTGRES_* variables in Vercel
- Check database is not paused
- Verify IP allowlist if configured

### OAuth Not Working
- Check NEXTAUTH_URL matches deployment URL
- Verify callback URLs match exactly
- Ensure credentials are in Vercel environment variables

### File Upload Fails
- Verify BLOB_READ_WRITE_TOKEN is set
- Check Vercel Blob store is active
- Test with different file types

### AI Analysis Timeout
- Check Hugging Face API key validity
- Verify rate limits not exceeded
- App falls back to rule-based analysis

## Performance Optimization

### For Higher Traffic
1. Implement request caching
2. Add rate limiting per user
3. Optimize database queries
4. Consider upgrading to Vercel Pro ($20/month)

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_analyses_user_id ON "Analysis"("userId");
CREATE INDEX idx_analyses_created ON "Analysis"("analyzedAt");
```

### Cost Optimization
- Implement file cleanup for old analyses
- Compress stored resume files
- Cache AI analysis results
- Implement user quotas

## Scaling Beyond Free Tier

If you exceed free tier limits:

1. **Vercel Pro** ($20/month)
   - 1TB bandwidth
   - Unlimited function execution
   - Better performance

2. **Postgres Upgrade**
   - More storage and compute
   - Better performance
   - Production-grade reliability

3. **Alternative AI Solutions**
   - Consider OpenAI API (pay-as-you-go)
   - Self-hosted models
   - Hybrid approach

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Environment variables never committed to git
- [ ] OAuth secrets kept secure
- [ ] Database credentials secured
- [ ] File upload size limits enforced
- [ ] Rate limiting implemented
- [ ] CORS configured properly

## Backup Strategy

### Database
```powershell
# Export data
npx prisma db pull
npx prisma db seed
```

### Vercel Blob
- Files are automatically backed up by Vercel
- Consider periodic exports for critical data

## Success Metrics

Track these metrics post-launch:
- Total users signed up
- Resumes analyzed per day
- Average analysis score
- User retention rate
- API error rate
- Page load times

---

**Last Updated:** Deployment checklist for 100% free tier deployment
