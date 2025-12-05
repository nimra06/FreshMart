# Environment Variables Guide

## Backend Project (Server) - Vercel Environment Variables

When deploying the backend to Vercel, set these environment variables in your Vercel project settings:

### Required Variables:

1. **MONGODB_URI**
   - Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - Secret key for signing JWT tokens
   - Use a long, random string (at least 32 characters)
   - Example: `your_super_secret_jwt_key_here_make_it_long_and_random`

3. **STRIPE_SECRET_KEY**
   - Your Stripe secret key (starts with `sk_test_` for test mode or `sk_live_` for production)
   - Get it from: https://dashboard.stripe.com/apikeys
   - Example: `sk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Optional Variables:

4. **PORT**
   - Server port (not needed for Vercel serverless, but can be set)
   - Default: `5000`

---

## Frontend Project (Client) - Vercel Environment Variables

When deploying the frontend to Vercel, set these environment variables in your Vercel project settings:

### Required Variables:

1. **REACT_APP_API_URL**
   - Your backend API URL (from the backend Vercel deployment)
   - Example: `https://your-backend-name.vercel.app`
   - **Important**: Don't include `/api` at the end, just the base URL
   - If left empty, it will try to use the same domain (won't work for separate deployments)

2. **REACT_APP_STRIPE_PUBLISHABLE_KEY**
   - Your Stripe publishable key (starts with `pk_test_` for test mode or `pk_live_` for production)
   - Get it from: https://dashboard.stripe.com/apikeys
   - Example: `pk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Note**: This is different from the secret key - it's safe to expose in frontend code

---

## How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Go to **Environment Variables**
4. Click **Add New**
5. Enter the **Key** and **Value**
6. Select the **Environment** (Production, Preview, Development)
7. Click **Save**
8. **Redeploy** your project for changes to take effect

---

## Example Setup:

### Backend Project:
```
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/
JWT_SECRET=my_super_secret_jwt_key_123456789
STRIPE_SECRET_KEY=sk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend Project:
```
REACT_APP_API_URL=https://freshmart-backend.vercel.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Security Notes:

- ✅ **REACT_APP_STRIPE_PUBLISHABLE_KEY** - Safe to expose (public key)
- ❌ **STRIPE_SECRET_KEY** - Never expose this in frontend code
- ❌ **JWT_SECRET** - Never expose this in frontend code
- ❌ **MONGODB_URI** - Never expose this in frontend code

All `REACT_APP_*` variables are embedded in the frontend bundle and are visible to users. Only use them for public keys or non-sensitive configuration.

