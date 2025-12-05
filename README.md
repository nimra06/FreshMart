# FreshMart

A full-stack grocery e-commerce application built with the MERN stack, featuring customer shopping experience and seller dashboard.

## Tech Stack

- **Frontend**: React, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Payment**: Stripe Integration
- **Authentication**: JWT

## Features

- User authentication and authorization
- Product browsing, search, and filtering
- Shopping cart and checkout
- Stripe payment processing
- Order management
- Seller dashboard with product and order management
- Real-time stock management

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Stripe account (for payments)

### Installation

```bash
# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Set up environment variables
# server/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5001

# client/.env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Run Development Server

```bash
# From root directory
npm run dev
```

Server runs on `http://localhost:5001`  
Client runs on `http://localhost:3000`

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   └── middleware/  # Auth middleware
└── package.json
```

## Environment Variables

See `.env.example` files in `server/` and `client/` directories for required environment variables.

## License

ISC
