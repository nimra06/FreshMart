# Environment Variables Guide

This document lists all environment variables used in the FreshMart project, based on the actual code.

---

## Backend Project (Server) - Vercel Environment Variables

**Location**: Deploy with **Root Directory** set to `server`

### Required Variables:

1. **MONGODB_URI**
   - **Type**: String
   - **Description**: MongoDB Atlas connection string
   - **Used in**: `server/api/index.js`, `server/index.js`, `server/seed.js`
   - **Example**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Note**: Must be set, otherwise server will fail to start

2. **JWT_SECRET**
   - **Type**: String
   - **Description**: Secret key for signing and verifying JWT tokens
   - **Used in**: `server/routes/auth.js`, `server/middleware/auth.js`
   - **Example**: `your_super_secret_jwt_key_make_it_long_and_random_at_least_32_chars`
   - **Note**: Must be set, otherwise JWT token generation will fail

3. **STRIPE_SECRET_KEY**
   - **Type**: String
   - **Description**: Stripe secret key for server-side payment processing
   - **Used in**: `server/routes/payment.js`
   - **Example**: `sk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Note**: 
     - Starts with `sk_test_` for test mode or `sk_live_` for production
     - Must be at least 20 characters long
     - If not set or invalid, card payments will be disabled (returns 503 error)
     - Get from: https://dashboard.stripe.com/apikeys

### Optional Variables:

4. **PORT**
   - **Type**: Number
   - **Description**: Server port (only used for local development)
   - **Used in**: `server/index.js`
   - **Default**: `5000`
   - **Note**: Not needed for Vercel serverless deployment

---

## Frontend Project (Client) - Vercel Environment Variables

**Location**: Deploy with **Root Directory** set to `client`

### Required Variables:

1. **REACT_APP_API_URL**
   - **Type**: String
   - **Description**: Backend API base URL
   - **Used in**: `client/src/config/axios.js`
   - **Example**: `https://your-backend-name.vercel.app`
   - **Important Notes**:
     - Do NOT include `/api` at the end
     - If left empty, it will try to use the same domain (won't work for separate deployments)
     - In development, if empty, it uses the proxy from `package.json` (`http://localhost:5001`)
   - **Format**: Full URL without trailing slash

2. **REACT_APP_STRIPE_PUBLISHABLE_KEY**
   - **Type**: String
   - **Description**: Stripe publishable key for client-side payment elements
   - **Used in**: `client/src/components/StripeWrapper.js`
   - **Example**: `pk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Important Notes**:
     - Starts with `pk_test_` for test mode or `pk_live_` for production
     - This is different from the secret key - it's safe to expose in frontend code
     - If not set or equals `pk_test_51QKexample`, card payments will be disabled
     - Get from: https://dashboard.stripe.com/apikeys (same page as secret key)

---

## Complete Example Setup

### Backend Project (Vercel):
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345678901234567890
STRIPE_SECRET_KEY=sk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend Project (Vercel):
```
REACT_APP_API_URL=https://freshmart-backend.vercel.app
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51QKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Go to **Environment Variables** tab
4. Click **Add New** button
5. Enter the **Key** (exact name as listed above)
6. Enter the **Value**
7. Select the **Environment**:
   - **Production**: For production deployments
   - **Preview**: For preview deployments (pull requests, branches)
   - **Development**: For local development (if using Vercel CLI)
8. Click **Save**
9. **Redeploy** your project for changes to take effect

---

## Security Notes:

### ✅ Safe to Expose (Frontend):
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Public key, designed to be exposed

### ❌ Never Expose (Backend Only):
- `STRIPE_SECRET_KEY` - Can create charges, refunds, etc.
- `JWT_SECRET` - Can forge authentication tokens
- `MONGODB_URI` - Contains database credentials

**Important**: All `REACT_APP_*` variables are embedded in the frontend JavaScript bundle and are visible to anyone who inspects the code. Only use them for public keys or non-sensitive configuration.

---

## Development vs Production:

### Local Development:

**Backend** (`server/.env`):
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**Frontend** (`client/.env`):
```
REACT_APP_API_URL=
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```
*Note: Leave `REACT_APP_API_URL` empty in development - it will use the proxy from `package.json`*

### Production (Vercel):

Use the environment variables as shown in the "Complete Example Setup" section above.

---

## Troubleshooting:

1. **Backend returns 503 for Stripe payments**: Check that `STRIPE_SECRET_KEY` is set and valid (at least 20 characters, starts with `sk_test_` or `sk_live_`)

2. **Frontend can't connect to backend**: 
   - Verify `REACT_APP_API_URL` is set correctly (no trailing slash, no `/api` suffix)
   - Check that backend is deployed and accessible
   - Verify CORS is enabled on backend (it is by default)

3. **JWT authentication fails**: Check that `JWT_SECRET` is set on backend and matches between deployments

4. **MongoDB connection fails**: Verify `MONGODB_URI` is correct and includes proper authentication
