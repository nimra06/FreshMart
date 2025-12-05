import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, getCartItemCount } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">FreshMart</span>
          </Link>

          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
          </div>

          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>

          <div className="navbar-actions">
            {/* Cart icon - always visible */}
            <Link to="/cart" className="cart-icon">
              🛒 <span className="cart-count">{getCartItemCount()}</span>
            </Link>

            {user ? (
              <>
                {user.role === 'seller' ? (
                  <Link to="/seller/dashboard" className="btn btn-secondary">
                    Seller Dashboard
                  </Link>
                ) : (
                  <Link to="/orders" className="btn btn-secondary">
                    Orders
                  </Link>
                )}
                <Link to="/profile" className="btn btn-secondary">
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

