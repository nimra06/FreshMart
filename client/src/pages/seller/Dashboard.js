import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Seller.css';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/seller/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="seller-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Seller Dashboard</h1>
          <Link to="/seller/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats?.totalProducts || 0}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-info">
              <h3>{stats?.totalOrders || 0}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats?.pendingOrders || 0}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/seller/products" className="action-card">
            <h3>Manage Products</h3>
            <p>View, add, edit, or delete your products</p>
          </Link>

          <Link to="/seller/orders" className="action-card">
            <h3>View Orders</h3>
            <p>Manage and track all your orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

