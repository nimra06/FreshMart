import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="py-10 min-h-screen">
        <div className="container">
          <div className="text-center py-20 px-5 bg-white rounded-xl">
            <h2 className="text-3xl mb-4 text-gray-800">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8">Start shopping to add items to your cart!</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 min-h-screen">
      <div className="container">
        <h1 className="text-4xl mb-8 text-gray-800">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="flex flex-col gap-5">
            {cart.map((item) => (
              <div key={item.product._id} className="bg-white rounded-xl p-5 grid grid-cols-[100px_1fr_150px_100px_40px] gap-5 items-center shadow-md">
                <div className="w-24 h-24 overflow-hidden rounded-lg bg-gray-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-gray-800">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.product.category}</p>
                  <p className="text-base font-semibold text-[#667eea]">${item.product.price}</p>
                </div>
                <div className="flex items-center gap-2.5 justify-center">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.product._id, item.quantity - 1)
                    }
                    className="w-9 h-9 border-2 border-gray-200 bg-white rounded-md text-lg font-bold transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea] hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold min-w-[30px] text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartQuantity(item.product._id, item.quantity + 1)
                    }
                    className="w-9 h-9 border-2 border-gray-200 bg-white rounded-md text-lg font-bold transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea] hover:text-white"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="w-9 h-9 border-none bg-red-50 text-red-500 rounded-md text-xl font-bold transition-all duration-300 hover:bg-red-500 hover:text-white"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 h-fit shadow-md lg:sticky lg:top-24">
            <h2 className="text-2xl mb-5 text-gray-800">Order Summary</h2>
            <div className="flex justify-between mb-4 text-base text-gray-600">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-base text-gray-600">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-4 border-t-2 border-gray-200 text-xl font-bold text-gray-800 mb-5">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary w-full mt-5"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-secondary w-full mt-5">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;




