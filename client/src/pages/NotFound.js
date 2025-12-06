import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-[#667eea] mb-4">404</h1>
          <h2 className="text-4xl mb-4 text-gray-800">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;




