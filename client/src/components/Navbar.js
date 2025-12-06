import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

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
    <nav className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-4 shadow-md sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <Link to="/" className="text-2xl font-bold text-white">
            <span className="bg-white text-[#667eea] px-4 py-2 rounded-lg">FreshMart</span>
          </Link>

          <div className="flex gap-5">
            <Link to="/" className="text-white font-medium hover:opacity-80 transition-opacity">Home</Link>
            <Link to="/products" className="text-white font-medium hover:opacity-80 transition-opacity">Products</Link>
          </div>

          <form className="flex-1 max-w-md flex gap-2.5" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 border-none rounded-lg text-sm"
            />
            <button type="submit" className="px-5 py-2.5 bg-white text-[#667eea] rounded-lg text-base">🔍</button>
          </form>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-2xl text-white">
              🛒 <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{getCartItemCount()}</span>
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

