// Load environment variables (dotenv is not needed in Vercel, but helps for local dev)
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from '../routes/auth.js';
import productRoutes from '../routes/products.js';
import orderRoutes from '../routes/orders.js';
import sellerRoutes from '../routes/seller.js';
import paymentRoutes from '../routes/payment.js';

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

    // Validate MongoDB URI format
    if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://');
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        throw error;
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
export default async function handler(req, res) {
  // Debug: Log environment variable status (without exposing the actual URI)
  console.log('Environment check:', {
    hasMongoDBUri: !!process.env.MONGODB_URI,
    mongoDBUriLength: process.env.MONGODB_URI?.length || 0,
    mongoDBUriStarts: process.env.MONGODB_URI?.substring(0, 10) || 'not set',
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  });

  // Connect to MongoDB
  try {
    await connectDB();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      hasMongoDBUri: !!process.env.MONGODB_URI,
      mongoDBUriLength: process.env.MONGODB_URI?.length || 0,
    });
    
    // Return more helpful error message
    let errorMessage = 'Database connection failed';
    if (!process.env.MONGODB_URI) {
      errorMessage = 'MONGODB_URI environment variable is not set';
    } else if (error.message.includes('authentication')) {
      errorMessage = 'MongoDB authentication failed. Check your username and password.';
    } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot reach MongoDB. Check network access settings in MongoDB Atlas.';
    }
    
    return res.status(500).json({ 
      message: errorMessage,
      error: error.message,
      hint: !process.env.MONGODB_URI ? 'Set MONGODB_URI in Vercel environment variables' : 'Check MongoDB Atlas network access settings'
    });
  }

  // Handle the request with Express
  return app(req, res);
}

