# FreshMart - Grocery Shopping Application

A full-stack grocery shopping application built with MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **Client Side**: Browse products, add to cart, checkout with Stripe payments
- **Seller Side**: Manage products, view orders, update stock
- **Authentication**: JWT-based authentication
- **Payments**: Stripe integration for card payments
- **Toast Notifications**: User-friendly notifications

## Tech Stack

- **Frontend**: React, React Router, Axios, Stripe Elements
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Payment**: Stripe

## Setup

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file for production:
```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server:
```bash
npm start
```

## Deployment

### Vercel (Separate Frontend and Backend)

Deploy the frontend and backend as **two separate Vercel projects**:

#### 1. Backend Deployment

1. Create a new Vercel project
2. Connect your GitHub repository
3. **Root Directory**: Set to `server`
4. **Framework Preset**: Other (or Node.js)
5. **Build Command**: Leave empty or `echo 'No build needed'`
6. **Output Directory**: Leave empty or `.`
7. **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `STRIPE_SECRET_KEY`: Your Stripe secret key

The backend will be available at `https://your-backend-name.vercel.app`

#### 2. Frontend Deployment

1. Create a new Vercel project
2. Connect your GitHub repository
3. **Root Directory**: Set to `client`
4. **Framework Preset**: Create React App
5. **Build Command**: `npm install && npm run build`
6. **Output Directory**: `build`
7. **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend-name.vercel.app`)
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

The frontend will automatically use the backend URL from `REACT_APP_API_URL`.

## License

ISC
