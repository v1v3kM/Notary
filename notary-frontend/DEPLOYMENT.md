# 🚀 Deployment Guide

## Quick Setup

Run the helper script:
```bash
./deploy-setup.sh
```

Then follow the displayed instructions.

## Manual Setup

### 1. Create GitHub Repository
- Go to [github.com](https://github.com) → New repository
- Name: `digital-notary-platform`
- Public repository
- Don't initialize with README

### 2. Update package.json
Replace `YOUR_USERNAME` with your GitHub username in `package.json`

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/digital-notary-platform.git
git add .
git commit -m "Update GitHub username"
git push -u origin main
```

### 4. Deploy to Vercel
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Deploy!

## Environment Variables

Copy from your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://cjfvdwmykwsvpkocqyev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Result
Your app will be live at: `https://digital-notary-platform.vercel.app`
