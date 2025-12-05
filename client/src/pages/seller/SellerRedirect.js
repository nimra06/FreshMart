import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const SellerRedirect = () => {
  const { user, loading } = useApp();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in as seller, redirect to dashboard
  if (user.role === 'seller') {
    return <Navigate to="/seller/dashboard" replace />;
  }

  // If logged in as client, redirect to home
  return <Navigate to="/" replace />;
};

export default SellerRedirect;

