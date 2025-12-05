import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from '../server/routes/auth.js';
import productRoutes from '../server/routes/products.js';
import orderRoutes from '../server/routes/orders.js';
import sellerRoutes from '../server/routes/seller.js';
import paymentRoutes from '../server/routes/payment.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/payment', paymentRoutes);

// MongoDB Connection (cached for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Vercel serverless function handler
// This catch-all route handles all /api/* requests
export default async function handler(req, res) {
  // Connect to MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }

  // Reconstruct the full URL path for Express
  // Vercel's catch-all route: /api/[...path] means /api/auth/login becomes path=['auth', 'login']
  const pathSegments = req.query.path || [];
  const path = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
  
  // Update req.url to include /api prefix so Express routes match
  const originalUrl = req.url;
  req.url = `/api/${path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
  
  // Handle the request with Express
  return new Promise((resolve) => {
    app(req, res, () => {
      // If Express didn't handle it, restore original URL and return 404
      if (!res.headersSent) {
        req.url = originalUrl;
        res.status(404).json({ message: 'Route not found' });
      }
      resolve();
    });
  });
}

