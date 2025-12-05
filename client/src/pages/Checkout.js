import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import StripeWrapper from '../components/StripeWrapper';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './Checkout.css';

const CheckoutForm = ({ clientSecret, setClientSecret }) => {
  const { cart, getCartTotal, clearCart, user } = useApp();
  const navigate = useNavigate();
  const { error: showError, success } = useToast();
  // Hooks must always be called - they return null if not in Elements provider
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    phone: user?.phone || '',
    paymentMethod: 'Cash on Delivery',
  });
  const [stripeError, setStripeError] = useState(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);

  // Create payment intent when card payment is selected
  useEffect(() => {
    if (formData.paymentMethod === 'Card' && cart.length > 0) {
      createPaymentIntent();
    } else {
      if (setClientSecret) {
        setClientSecret('');
      }
      setStripeError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.paymentMethod, cart.length]);

  const createPaymentIntent = async () => {
    try {
      setStripeError(null);
      setIsLoadingPaymentIntent(true);
      const res = await api.post('/api/payment/create-payment-intent', {
        amount: getCartTotal(),
        currency: 'usd',
      });
      if (setClientSecret) {
        setClientSecret(res.data.clientSecret);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      if (error.response?.status === 503) {
        setStripeError('Card payments are currently unavailable. Please use Cash on Delivery or contact support.');
      } else {
        setStripeError('Failed to initialize payment. Please try again or use Cash on Delivery.');
      }
    } finally {
      setIsLoadingPaymentIntent(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let isPaid = false;
      let paidAt = null;
      let stripePaymentIntentId = null;

      // If card payment, process with Stripe
      if (formData.paymentMethod === 'Card') {
        if (!clientSecret) {
          showError('Payment is not initialized. Please wait a moment and try again.');
          setLoading(false);
          return;
        }

        if (!stripe || !elements) {
          showError('Stripe is not loaded. Please wait a moment and try again.');
          setLoading(false);
          return;
        }

        // Confirm payment with Stripe
        const { error: submitError } = await elements.submit();
        if (submitError) {
          showError(submitError.message);
          setLoading(false);
          return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/orders`,
          },
          redirect: 'if_required',
        });

        if (error) {
          showError(`Payment failed: ${error.message}`);
          setLoading(false);
          return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          isPaid = true;
          paidAt = new Date();
          stripePaymentIntentId = paymentIntent.id;
        } else {
          showError('Payment was not completed. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Create order
      const orderData = {
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        isPaid,
        paidAt,
        stripePaymentIntentId,
      };

      await api.post('/api/orders', orderData);
      clearCart();
      success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      showError(error.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="form-group">
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Card">Credit/Debit Card (Stripe)</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              {formData.paymentMethod === 'Card' && stripeError && (
                <div className="payment-error">
                  <p>⚠️ {stripeError}</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: 'Cash on Delivery' });
                      setClientSecret('');
                    }}
                  >
                    Switch to Cash on Delivery
                  </button>
                </div>
              )}

              {formData.paymentMethod === 'Card' && isLoadingPaymentIntent && (
                <div className="payment-loading">
                  <p>Initializing payment...</p>
                </div>
              )}

              {formData.paymentMethod === 'Card' && clientSecret && !stripeError && !isLoadingPaymentIntent && (
                <div className="stripe-payment-form">
                  {stripe && elements ? (
                    <>
                      <PaymentElement />
                      <div className="payment-note">
                        <p>🔒 Secure payment powered by Stripe</p>
                      </div>
                    </>
                  ) : (
                    <div className="payment-loading">
                      <p>Loading payment form...</p>
                    </div>
                  )}
                </div>
              )}

              {formData.paymentMethod === 'UPI' && (
                <div className="payment-note">
                  <p>UPI payment option coming soon. Please use Cash on Delivery or Card for now.</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || (formData.paymentMethod === 'Card' && (!stripe || !clientSecret || stripeError))}
            >
              {loading ? 'Processing...' : formData.paymentMethod === 'Card' ? 'Pay Now' : 'Place Order'}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map((item) => (
                <div key={item.product._id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div>
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity} × ${item.product.price}</p>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  return <CheckoutFormWrapper />;
};

const CheckoutFormWrapper = () => {
  const { getCartTotal } = useApp();
  const [clientSecret, setClientSecret] = useState('');

  // Always wrap in StripeWrapper
  // Pass amount so Elements can work even without clientSecret initially
  return (
    <StripeWrapper clientSecret={clientSecret} amount={getCartTotal()}>
      <CheckoutForm clientSecret={clientSecret} setClientSecret={setClientSecret} />
    </StripeWrapper>
  );
};

export default Checkout;
