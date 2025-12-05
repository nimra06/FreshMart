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

### Vercel (Full Stack)

The application is configured for Vercel deployment with serverless functions. Set the following environment variables in Vercel:

**Required Environment Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

**Optional:**
- `REACT_APP_API_URL`: Only needed if deploying backend separately (leave empty for Vercel serverless functions)

The API routes are automatically available at `/api/*` when deployed on Vercel.

## License

ISC
