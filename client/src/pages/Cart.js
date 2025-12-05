import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart!</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p className="cart-item-category">{item.product.category}</p>
                  <p className="cart-item-price">${item.product.price}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.product._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartQuantity(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
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
            <button
              className="btn btn-primary"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

