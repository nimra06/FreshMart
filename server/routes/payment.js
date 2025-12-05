import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe lazily (when first needed)
let stripe = null;
let stripeInitialized = false;

const getStripe = () => {
  if (stripeInitialized) {
    return stripe;
  }
  
  stripeInitialized = true;
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  
  if (stripeKey && stripeKey !== 'sk_test_your_stripe_secret_key_here' && stripeKey.length > 20) {
    try {
      stripe = new Stripe(stripeKey);
      console.log('✅ Stripe initialized successfully');
      return stripe;
    } catch (error) {
      console.error('❌ Error initializing Stripe:', error.message);
      return null;
    }
  } else {
    console.warn('⚠️  Stripe secret key not configured. Card payments will not work.');
    return null;
  }
};

// Create payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(503).json({ message: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file.' });
    }

    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm-payment', protect, async (req, res) => {
  try {
    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(503).json({ message: 'Stripe is not configured' });
    }

    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      res.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          status: paymentIntent.status,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Payment status: ${paymentIntent.status}`,
      });
    }
  } catch (error) {
    console.error('Stripe confirmation error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

