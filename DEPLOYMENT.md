# Vercel Deployment Guide for FreshMart

This guide will help you deploy FreshMart to Vercel.

## Prerequisites

1. GitHub account with the repository pushed
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. MongoDB Atlas account (for database)
4. Stripe account (for payments)

## Step 1: Deploy via Vercel Dashboard

### Option A: Import from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `nimra06/FreshMart`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && cd server && npm install && cd ../client && npm install`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project directory
cd /Users/nimralatif/Desktop/Grocery-Project

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

## Step 2: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Server Environment Variables:
```
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PORT=5000
NODE_ENV=production
```

### Client Environment Variables:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
REACT_APP_API_URL=https://your-project.vercel.app
```

**Important Notes:**
- Add these for **Production**, **Preview**, and **Development** environments
- After adding environment variables, **redeploy** your project
- The `REACT_APP_API_URL` should be your Vercel deployment URL (e.g., `https://freshmart.vercel.app`)

## Step 3: Update CORS Settings

The server already has CORS enabled, but you may need to update it for your Vercel domain:

In `server/index.js`, the CORS middleware allows all origins. For production, you can restrict it:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

## Step 4: Verify Deployment

1. After deployment, Vercel will provide you with a URL like:
   - `https://freshmart.vercel.app`
   - `https://freshmart-git-main-nimra06.vercel.app`

2. Test the deployment:
   - Visit the URL
   - Try registering a new user
   - Browse products
   - Test checkout (use Stripe test cards)

## Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### API Routes Not Working
- Check that `vercel.json` routes are configured correctly
- Verify API routes start with `/api/`
- Check server logs in Vercel dashboard

### Database Connection Issues
- Verify `MONGODB_URI` is set correctly
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
- Ensure MongoDB Atlas cluster is running

### Stripe Payment Issues
- Verify Stripe keys are set in environment variables
- Check that keys match (test keys for test mode)
- Review Stripe dashboard for payment logs

## Project Structure for Vercel

```
Grocery-Project/
├── api/
│   └── index.js          # Serverless function entry point
├── client/
│   ├── build/            # Built React app (generated)
│   └── src/
├── server/                # Original server code
├── vercel.json           # Vercel configuration
└── package.json
```

## Important Files

- `vercel.json` - Vercel deployment configuration
- `api/index.js` - Serverless function wrapper
- `.vercelignore` - Files to exclude from deployment

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- `main` branch → Production
- Other branches → Preview deployments
- Pull requests → Preview deployments

## Support

For issues:
1. Check Vercel deployment logs
2. Review server logs in Vercel dashboard
3. Check MongoDB Atlas connection
4. Verify environment variables

