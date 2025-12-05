import connectDB from '../lib/db.js';
import Stripe from 'stripe';
import { protect } from '../lib/auth.js';

let stripe = null;

const getStripe = () => {
  if (stripe) return stripe;
  
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  
  if (stripeKey && stripeKey !== 'sk_test_your_stripe_secret_key_here' && stripeKey.length > 20) {
    try {
      stripe = new Stripe(stripeKey);
      return stripe;
    } catch (error) {
      console.error('Error initializing Stripe:', error.message);
      return null;
    }
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);

    const stripeInstance = getStripe();
    if (!stripeInstance) {
      return res.status(503).json({ message: 'Stripe is not configured' });
    }

    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        userId: user._id.toString(),
        userEmail: user.email,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
}

