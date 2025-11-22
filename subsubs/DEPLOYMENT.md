# Beamlak SRTs - Vercel Deployment Guide

This application is ready to deploy on Vercel with zero configuration.

## Quick Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd /path/to/your/project
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy
   - Link to existing project? **No**
   - Project name? **beamlak-srts** (or your choice)
   - Directory? **./** (default)
   - Want to override settings? **No**

5. **Add environment variables** when prompted:
   - `OPENSUBTITLES_API_KEY`: Your OpenSubtitles API key
   - `NEXTAUTH_SECRET`: Generate a random string

### Option 2: Vercel Dashboard

1. **Push code to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Add environment variables**:
   ```
   OPENSUBTITLES_API_KEY=your_api_key_here
   NEXTAUTH_SECRET=your_random_secret_here
   ```
6. **Click "Deploy"**

## Environment Variables

### Required for Production

1. **OpenSubtitles API Key**:
   - Get from: https://www.opensubtitles.com/en/api
   - Add as: `OPENSUBTITLES_API_KEY`

2. **NextAuth Secret**:
   - Generate: `openssl rand -base64 32`
   - Add as: `NEXTAUTH_SECRET`

### Adding Environment Variables

**Via Vercel CLI**:
```bash
vercel env add OPENSUBTITLES_API_KEY
vercel env add NEXTAUTH_SECRET
```

**Via Vercel Dashboard**:
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable

## Pre-deployment Checklist

- [ ] You have an OpenSubtitles API key
- [ ] You've generated a NEXTAUTH_SECRET
- [ ] All dependencies are in package.json
- [ ] Project is pushed to GitHub (for dashboard deploy)
- [ ] Run `npm run build` locally to test

## Post-deployment

1. **Test your deployed app** at the provided Vercel URL
2. **Verify search functionality** works
3. **Test subtitle downloads**
4. **Check download history** feature
5. **Test dark mode toggle**

## Database Note

This app uses SQLite with Prisma. On Vercel, the database will be created automatically when the first API call is made. No additional configuration needed.

## Custom Domain (Optional)

1. Go to project settings in Vercel
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Common Issues

1. **API Key Error**:
   - Ensure `OPENSUBTITLES_API_KEY` is set correctly
   - Check the key is valid and active

2. **Build Errors**:
   - Run `npm run build` locally first
   - Check all dependencies are installed

3. **Database Issues**:
   - The SQLite database will be created automatically
   - No manual setup required on Vercel

### Getting Help

- Check Vercel deployment logs
- Review the build output
- Ensure all environment variables are set

---

Your Beamlak SRTs app is now ready for production! 🚀