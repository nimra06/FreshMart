import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey || stripePublishableKey === 'pk_test_51QKexample') {
  console.warn('⚠️  Stripe publishable key not configured. Card payments will not work.');
}

const stripePromise = stripePublishableKey && stripePublishableKey !== 'pk_test_51QKexample'
  ? loadStripe(stripePublishableKey)
  : null;

const StripeWrapper = ({ children, clientSecret, amount }) => {
  // If Stripe is not configured, just render children
  if (!stripePromise) {
    return <>{children}</>;
  }

  // If we have clientSecret, use it (preferred method)
  if (clientSecret) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'stripe' },
        }}
      >
        {children}
      </Elements>
    );
  }

  // If no clientSecret but we have amount, use mode: 'payment'
  // This allows Elements to work while payment intent is being created
  if (amount && amount > 0) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          mode: 'payment',
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          appearance: { theme: 'stripe' },
        }}
      >
        {children}
      </Elements>
    );
  }

  // Fallback: render without Elements (hooks will return null)
  return <>{children}</>;
};

export default StripeWrapper;

